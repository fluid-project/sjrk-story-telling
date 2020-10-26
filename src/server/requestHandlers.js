/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var { v4: uuidv4 } = require("uuid");
var fse = require("fs-extra");
var path = require("path");
var jo = require("jpeg-autorotate");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// Kettle request handler for a list of stories (Browse)
fluid.defaults("sjrk.storyTelling.server.browseStoriesHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleBrowseStories",
            args: ["{request}", "{server}.viewDataSource"]
        }
    }
});

/**
 * Parses the response from the CouchDB server (via the provided viewDataSource)
 * and responds to the HTTP request
 *
 * @param {Object} request - a Kettle request
 * @param {Component} viewDataSource - an instance of sjrk.storyTelling.server.dataSource.couch.view
 */
sjrk.storyTelling.server.handleBrowseStories = function (request, viewDataSource) {
    var promise = viewDataSource.get({directViewId: "storiesById"});
    promise.then(function (response) {
        var extracted = sjrk.storyTelling.server.browseStoriesHandler.extractFromCouchResponse(response);
        request.events.onSuccess.fire(JSON.stringify(extracted));
    }, function (error) {
        request.events.onError.fire({
            isError: true,
            message: JSON.stringify(error)
        });
    });
};

/**
 * A collection of stories along with the count and offset from the start
 * @typedef {Object} StoriesCouchData
 * @property {Number} totalResults - the total number of stories
 * @property {Number} offset - the offset from the first story (for pagination)
 * @property {Object.<String, Object>} stories - the collection of story metadata by ID
 */

/**
 * Extracts a collection of stories from the raw CouchDB Browse response and
 * returns an object with that collection along with some statistics about it
 *
 * @param {Object} response - the raw storiesById response data
 *
 * @return {StoriesCouchData} - a collection of stories as well as the total number and page offset
 */
sjrk.storyTelling.server.browseStoriesHandler.extractFromCouchResponse = function (response) {
    var storyBrowse = {
        totalResults: response.total_rows,
        offset: response.offset,
        stories: {}
    };

    fluid.each(response.rows, function (storyDoc) {
        var story = storyDoc.value;

        var contentTypes = {};

        fluid.each(story.content, function (contentBlock) {
            contentTypes[contentBlock.blockType] = true;
        });

        story.contentTypes = fluid.keys(contentTypes);

        story = fluid.censorKeys(story, ["content"]);

        storyBrowse.stories[storyDoc.id] = story;

    });

    return storyBrowse;
};

// Kettle request handler for a single story (View)
fluid.defaults("sjrk.storyTelling.server.getStoryHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleGetStory",
            args: ["{request}", "{server}.storyDataSource", "{server}.options.secureConfig.uploadedFilesHandlerPath"]
        }
    }
});

/**
 * Gets a single story's data from the database, parses it, rebuilds any URLs to
 * files associated with that story and responds to the HTTP request
 *
 * @param {Object} request - a Kettle request that includes an ID for the story to retrieve
 * @param {Component} dataSource - an instance of sjrk.storyTelling.server.dataSource.couch.story
 */
sjrk.storyTelling.server.handleGetStory = function (request, dataSource) {
    var id = request.req.params.id;
    var promise = dataSource.get({directStoryId: id});

    var noAccessErrorMessage = "An error occurred while retrieving the requested story";

    promise.then(function (response) {
        if (response.published) {
            request.events.onSuccess.fire(JSON.stringify(response));
        } else {
            fluid.log("Unauthorized: cannot access an unpublished story: " + id);

            request.events.onError.fire({
                isError: true,
                message: noAccessErrorMessage
            });
        }
    }, function (error) {
        fluid.log("Error getting story with ID " + id + ", error detail: " + JSON.stringify(error));

        request.events.onError.fire({
            isError: true,
            message: noAccessErrorMessage
        });
    });
};

// Kettle request handler for saving a single story
fluid.defaults("sjrk.storyTelling.server.saveStoryHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleSaveStory",
            args: ["{arguments}.0", "{server}.storyDataSource", "{server}.options.globalConfig.authoringEnabled"]
        }
    }
});

/**
 * Saves a single story to the CouchDB server and responds to the HTTP request.
 * If authoring is not enabled, the request raises an error.
 *
 * @param {Object} request - a Kettle request with data and files associated with a single story
 * @param {Component} dataSource - an instance of sjrk.storyTelling.server.dataSource.couch.story
 * @param {Boolean} authoringEnabled - a server-level flag to indicate whether authoring is enabled
 */
sjrk.storyTelling.server.handleSaveStory = function (request, dataSource, authoringEnabled) {
    if (authoringEnabled) {
        sjrk.storyTelling.server.saveStoryToDatabase(dataSource, request.req.body, request.events.onSuccess, request.events.onError);
    } else {
        request.events.onError.fire({
            isError: true,
            message: "Saving is currently disabled."
        });
    }
};

/**
 * Persist the story model to couch, with the updated references to where the binaries are saved
 *
 * @param {Component} dataSource - an instance of sjrk.storyTelling.server.dataSource.couch.story
 * @param {Object} storyModel - a single story's model
 * @param {Object} successEvent - an infusion event to fire upon successful completion
 * @param {Object} failureEvent - an infusion event to fire on failure
 */
sjrk.storyTelling.server.saveStoryToDatabase = function (dataSource, storyModel, successEvent, failureEvent) {
    var id = fluid.get(storyModel, "id") || uuidv4();

    dataSource.set({directStoryId: id}, storyModel).then(function (response) {
        successEvent.fire(JSON.stringify(response));
    }, function (error) {
        failureEvent.fire({
            isError: true,
            message: error.reason || "Unspecified server error saving story to database."
        });
    });
};

// Kettle request handler for saving a single file associated with a pre-existing story
fluid.defaults("sjrk.storyTelling.server.saveStoryFileHandler", {
    gradeNames: "kettle.request.http",
    requestMiddleware: {
        saveStoryFile: {
            middleware: "{server}.saveStoryFile"
        },
        deleteFile: {
            middleware: "{server}.deleteFile",
            priority: "after:saveStoryFile"
        }
    },
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleSaveStoryFile",
            args: ["{arguments}.0", "{server}.storyDataSource", "{server}.options.globalConfig.authoringEnabled"]
        }
    }
});

/**
 * Saves a single file to the server filesystem and responds to the HTTP request.
 * If the file is an image, it will be rotated to match its EXIF orientation data.
 *
 * Errors will be raised in the following situations:
 * - Authoring is not enabled
 * - An error is encountered while trying to get the story (invalid ID, DB offline, etc.)
 * - The story that the file is associated with is already published
 * - The provided file is not valid
 * - An error is encountered while rotating an image to its correct orientation
 *
 * @param {Object} request - a Kettle request containing a single file associated with a story
 * @param {Component} dataSource - an instance of sjrk.storyTelling.server.dataSource.couch.story
 * @param {Boolean} authoringEnabled - a server-level flag to indicate whether authoring is enabled
 */
sjrk.storyTelling.server.handleSaveStoryFile = function (request, dataSource, authoringEnabled) {
    if (!authoringEnabled) {
        request.events.onError.fire({
            isError: true,
            message: "Saving is currently disabled."
        });

        return;
    }

    var id = request.req.params.id;

    // verify that the story exists and isn't published before continuing
    dataSource.get({directStoryId: id}).then(function (story) {
        if (story && !story.published && request.req.file) {
            // if the file is an image, rotate it based on its EXIF data
            if (request.req.file.mimetype &&
                request.req.file.mimetype.indexOf("image") === 0) {

                sjrk.storyTelling.server.rotateImageFromExif(request.req.file).then(function () {
                    request.events.onSuccess.fire(request.req.file.destination + "/" + request.req.file.filename);
                }, function (error) {
                    request.events.onError.fire({
                        errorCode: error.errorCode,
                        isError: true,
                        message: error.message || "Unknown error in image rotation."
                    });
                });
            } else {
                request.events.onSuccess.fire(request.req.file.destination + "/" + request.req.file.filename);
            }
        } else {
            request.events.onError.fire({
                isError: true,
                message: "Error saving file: file was not provided or story is already published"
            });
        }
    }, function (err) {
        request.events.onError.fire({
            isError: true,
            message: "Error retrieving story with ID " + id,
            error: err
        });
    });
};

/**
 * Rotates an image to be oriented based on its EXIF orientation data, if present.
 * Uses the npm package {@link https://www.npmjs.com/package/jpeg-autorotate|jpeg-autorotate}
 *
 * @param {Object} file - an image file to process
 * @param {Object} options - additional options to pass into the rotate call
 *
 * @return {Promise} - a fluid-flavoured promise that returns nothing on resolve,
 *                     returns an error object on rejection
 */
sjrk.storyTelling.server.rotateImageFromExif = function (file, options) {
    var togo = fluid.promise();

    try {
        // ensure the file is present and we have all permissions
        fse.accessSync(file.path);

        // jpeg-autorotate will crash if the `options` arg is undefined
        options = options || {};

        jo.rotate(file.path, options).then(function (rotatedFile) {
            fse.writeFileSync(file.path, rotatedFile.buffer);
            togo.resolve(rotatedFile);
        }, function (error) {
            // if the error code is an "acceptable" error, resolve the promise after all
            if (error.code && (
                error.code === jo.errors.read_exif ||
                error.code === jo.errors.no_orientation ||
                error.code === jo.errors.correct_orientation)) {
                togo.resolve();
            } else {
                fluid.log(fluid.logLevel.WARN, "Image rotation failed for file " + file.path + ": " + error.message);

                togo.reject({
                    errorCode: error.code,
                    isError: true,
                    message: error.message
                });
            }
        });
    } catch (error) {
        togo.reject(error);
    }

    return togo;
};

// Kettle request handler for deleting a single story and its files
fluid.defaults("sjrk.storyTelling.server.deleteStoryHandler", {
    gradeNames: "kettle.request.http",
    requestMiddleware: {
        "basicAuth": {
            middleware: "{server}.basicAuth"
        }
    },
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleDeleteStory",
            args: ["{arguments}.0"] // request
        },
        deleteStoryFromCouch: {
            funcName: "sjrk.storyTelling.server.deleteStoryFromCouch",
            args: [
                "{that}",
                "{arguments}.0", // storyId
                "{server}.deleteStoryDataSource",
                "{server}.storyDataSource"
            ]
        },
        deleteStoryFiles: {
            funcName: "sjrk.storyTelling.server.deleteStoryFiles",
            args: ["{that}", "{arguments}.0"] // storyContent
        },
        deleteSingleFileRecoverable: {
            funcName: "sjrk.storyTelling.server.deleteSingleFileRecoverable",
            args: [
                "{arguments}.0", // fileName
                "{server}.options.secureConfig.deletedFilesRecoveryPath",
                "{server}.options.secureConfig.uploadedFilesHandlerPath"
            ]
        }
    }
});

/**
 * Deletes a given story and its files
 *
 * @param {Object} request - a Kettle request that includes an ID for the story to delete
 */
sjrk.storyTelling.server.handleDeleteStory = function (request) {
    var promise = request.deleteStoryFromCouch(request.req.params.id);

    promise.then(function () {
        request.events.onSuccess.fire({
            message: "DELETE request received successfully for story with id: " + request.req.params.id
        });
    }, function (error) {
        request.events.onError.fire({
            isError: true,
            message: JSON.stringify(error)
        });
    });
};

/**
 * Deletes a single story (based on its ID) from the CouchDB server as well as
 * any uploaded files associated with that story. Due to the nature of Kettle
 * DataSources and deleting, this is achieved by first getting the story from
 * CouchDB in order to have a proper reference to its internal IDs
 *
 * @param {Component} deleteStoryHandler - an instance of sjrk.storyTelling.server.deleteStoryHandler
 * @param {String} storyId - the ID of the story to delete
 * @param {Component} deleteStoryDataSource - an instance of sjrk.storyTelling.server.dataSource.couch.deleteStory
 * @param {Component} getStoryDataSource - an instance of sjrk.storyTelling.server.dataSource.couch.story
 *
 * @return {Promise} - a fluid-flavoured promise that returns nothing on resolve,
 *                     returns an error object on rejection
 */
sjrk.storyTelling.server.deleteStoryFromCouch = function (deleteStoryHandler, storyId, deleteStoryDataSource, getStoryDataSource) {
    var promise = fluid.promise();

    var getPromise = getStoryDataSource.get({
        directStoryId: storyId
    });

    getPromise.then(function (response) {
        if (response.content) {
            deleteStoryHandler.deleteStoryFiles(response.content);
        }

        var deletePromise = deleteStoryDataSource.set({
            directStoryId: storyId,
            directRevisionId: response._rev
        });

        deletePromise.then(function (response) {
            promise.resolve(response);
        }, function (error) {
            promise.reject({
                isError: true,
                message: error
            });
        });
    }, function (error) {
        promise.reject({
            isError: true,
            message: error
        });
    });

    return promise;
};

/**
 * Deletes all files on the file system that are associated with a given story
 *
 * @param {Component} deleteStoryHandler - an instance of sjrk.storyTelling.server.deleteStoryHandler
 * @param {Component[]} storyContent - a list of sjrk.storyTelling.block components representing the story
 */
sjrk.storyTelling.server.deleteStoryFiles = function (deleteStoryHandler, storyContent) {
    var filesToDelete = [];

    fluid.each(storyContent, function (block) {
        if (sjrk.storyTelling.server.isValidMediaFilename(block.mediaUrl)) {
            filesToDelete.push(block.mediaUrl);
        } else {
            fluid.log("Invalid filename:", block.mediaUrl);
        }
    });

    // remove duplicate entries so we don't try to delete already-deleted files
    filesToDelete = filesToDelete.filter(function (fileName, index, self) {
        return self.indexOf(fileName) === index;
    });

    fluid.each(filesToDelete, function (fileToDelete) {
        deleteStoryHandler.deleteSingleFileRecoverable(fileToDelete);
    });
};

/**
 * Verifies that a given file name follows the UUID format as laid out in
 * RFC4122. A detailed description of the format can be found here:
 * {@link https://en.wikipedia.org/wiki/Universally_unique_identifier#Format}
 *
 * @param {String} fileName - the filename to verify
 *
 * @return {Boolean} - true if the filename is valid
 */
sjrk.storyTelling.server.isValidMediaFilename = function (fileName) {
    if (fileName && typeof fileName === "string" ) {
        var validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(\.\w+)?$/;

        return validUuid.test(fileName);
    } else {
        return false;
    }
};

/**
 * Returns a server path to a particular file
 *
 * @param {String} fileName - the name of the file
 * @param {String} directoryName - the directory in which the file is located (may also be a partial path)
 *
 * @return {String} - the combined server path
 */
sjrk.storyTelling.server.getServerPathForFile = function (fileName, directoryName) {
    return "." + directoryName + path.sep + fileName;
};

/**
 * "Deletes" a file by relocating it to a recovery directory on the server
 *
 * @param {String} fileToDelete - the name of the file to be deleted
 * @param {String} deletedFilesRecoveryPath - the path to the directory where deleted files live
 * @param {String} uploadedFilesHandlerPath - the path to the directory where files are uploaded
 */
sjrk.storyTelling.server.deleteSingleFileRecoverable = function (fileToDelete, deletedFilesRecoveryPath, uploadedFilesHandlerPath) {
    var recoveryPath = sjrk.storyTelling.server.getServerPathForFile(fileToDelete, deletedFilesRecoveryPath);
    var deletionPath = sjrk.storyTelling.server.getServerPathForFile(fileToDelete, uploadedFilesHandlerPath);

    // move it to the recovery dir and make sure it was moved
    try {
        fse.moveSync(deletionPath, recoveryPath);
        fse.accessSync(recoveryPath, fse.constants.W_OK | fse.constants.R_OK);
        fluid.log("Moved file to recovery dir:", recoveryPath);
    } catch (err) {
        fluid.fail("Error moving file ", deletionPath, " to recovery dir. Error detail: ", err.toString());
    }

    // make sure it's gone from the uploads dir
    try {
        fse.accessSync(deletionPath);
        fluid.fail("File was not deleted:", deletionPath);
    } catch (err) {
        fluid.log("Deleted file:", deletionPath);
    }
};

// Kettle request handler for getting Client Configuration data
fluid.defaults("sjrk.storyTelling.server.clientConfigHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.getClientConfig",
            args: ["{arguments}.0", "{server}.options.globalConfig", "{server}.options.secureConfig"]
        }
    }
});

/**
 * Returns a collection of values which are "safe" to share with the client side of the application
 *
 * @param {Object} request - a Kettle request for clientConfig
 * @param {Object} globalConfig - the "global config" entry list
 * @param {Object} secureConfig - the "secure config" entry list
 */
sjrk.storyTelling.server.getClientConfig = function (request, globalConfig, secureConfig) {
    request.events.onSuccess.fire({
        theme: globalConfig.theme || secureConfig.baseThemeName,
        baseTheme: secureConfig.baseThemeName,
        authoringEnabled: globalConfig.authoringEnabled
    });
};

// Kettle request handler for the ui directory
fluid.defaults("sjrk.storyTelling.server.uiHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.ui"
        }
    }
});

// Kettle request handler for the themes directory. It looks first in the custom
// theme directory before falling back to the base theme directory
fluid.defaults("sjrk.storyTelling.server.themeHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "baseTheme": {
            middleware: "{server}.baseTheme"
        },
        "currentTheme": {
            middleware: "{server}.currentTheme",
            priority: "before:baseTheme"
        }
    }
});

// Kettle request handler for the uploads directory
fluid.defaults("sjrk.storyTelling.server.uploadsHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.uploads"
        }
    }
});

// Kettle request handler for the node_modules directory
fluid.defaults("sjrk.storyTelling.server.nodeModulesHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "staticFilter": {
            middleware: "{server}.nodeModulesFilter"
        },
        "static": {
            middleware: "{server}.nodeModules",
            priority: "after:staticFilter"
        }
    }
});
