/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var uuidv1 = require("uuid/v1");
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
        var responseAsJSON = JSON.stringify(extracted);
        request.events.onSuccess.fire(responseAsJSON);
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            isError: true,
            message: errorAsJSON
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
 * @param {String} uploadedFilesHandlerPath - the path on the server to uploaded files
 */
sjrk.storyTelling.server.handleGetStory = function (request, dataSource, uploadedFilesHandlerPath) {
    var id = request.req.params.id;
    var promise = dataSource.get({directStoryId: id});

    promise.then(function (response) {

        fluid.transform(response.content, function (block) {
            if (block.blockType === "image") {
                if (block.imageUrl) {
                    block.imageUrl = uploadedFilesHandlerPath + "/" + block.imageUrl;
                }
                return block;
            } else if (block.blockType === "audio" || block.blockType === "video") {
                if (block.mediaUrl) {
                    block.mediaUrl = uploadedFilesHandlerPath + "/" + block.mediaUrl;
                }
                return block;
            }
        });

        var responseAsJSON = JSON.stringify(response);
        request.events.onSuccess.fire(responseAsJSON);
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            isError: true,
            message: errorAsJSON
        });
    });
};

// Kettle request handler for saving a single story and its files
fluid.defaults("sjrk.storyTelling.server.saveStoryWithBinariesHandler", {
    gradeNames: "kettle.request.http",
    requestMiddleware: {
        "saveStoryWithBinaries": {
            middleware: "{server}.saveStoryWithBinaries"
        }
    },
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleSaveStoryWithBinaries",
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
sjrk.storyTelling.server.handleSaveStoryWithBinaries = function (request, dataSource, authoringEnabled) {
    if (authoringEnabled) {
        var rotateImagePromises = [];

        // rotate any images based on their EXIF data, if present
        fluid.each(request.req.files.file, function (singleFile) {
            if (singleFile.mimetype && singleFile.mimetype.indexOf("image") === 0) {
                rotateImagePromises.push(sjrk.storyTelling.server.rotateImageFromExif(singleFile));
            }
        });

        fluid.promise.sequence(rotateImagePromises).then(function () {
            var storyModel = JSON.parse(request.req.body.model);
            var binaryRenameMap = sjrk.storyTelling.server.buildBinaryRenameMap(storyModel.content, request.req.files.file);

            sjrk.storyTelling.server.saveStoryToDatabase(dataSource, binaryRenameMap, storyModel, request.events.onSuccess, request.events.onError);
        }, function (error) {
            request.events.onError.fire({
                errorCode: error.errorCode,
                isError: true,
                message: error.message || "Unknown error in image rotation."
            });
        });
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
 * @param {Object.<String, String>} binaryRenameMap - a map of uploaded file names to paths
 * @param {Object} storyModel - a single story's model
 * @param {Object} successEvent - an infusion event to fire upon successful completion
 * @param {Object} failureEvent - an infusion event to fire on failure
 */
sjrk.storyTelling.server.saveStoryToDatabase = function (dataSource, binaryRenameMap, storyModel, successEvent, failureEvent) {
    var id = uuidv1();

    dataSource.set({directStoryId: id}, storyModel).then(function (response) {
        response.binaryRenameMap = binaryRenameMap;
        successEvent.fire(JSON.stringify(response));
    }, function (error) {
        failureEvent.fire({
            isError: true,
            message: error.reason || "Unspecified server error saving story to database."
        });
    });
};

/**
 * Update any media URLs to refer to the changed file names
 *
 * @param {Object} blocks - a collection of story blocks with file references
 * @param {Object} files - a list of files to refer to
 *
 * @return {Object.<String, String>} - a key-value collection linking uploaded filenames to server paths
 */
sjrk.storyTelling.server.buildBinaryRenameMap = function (blocks, files) {
    // key-value pairs of original filename : generated filename
    // this is used primarily by tests, but may be of use
    // to client-side components too
    var binaryRenameMap = {};

    fluid.each(blocks, function (block) {
        if (block.blockType === "image" || block.blockType === "audio" || block.blockType === "video") {
            if (block.fileDetails) {
                // Look for the uploaded file matching this block
                var mediaFile = fluid.find_if(files, function (file) {
                    return file.originalname === block.fileDetails.name;
                });

                // If we find a match, update the media URL. If not, clear it.
                if (mediaFile) {
                    sjrk.storyTelling.server.setMediaBlockUrl(block, mediaFile.filename);
                    binaryRenameMap[mediaFile.originalname] = mediaFile.filename;
                } else {
                    sjrk.storyTelling.server.setMediaBlockUrl(block, null);
                }
            } else {
                sjrk.storyTelling.server.setMediaBlockUrl(block, null);
            }
        }
    });

    return binaryRenameMap;
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

/**
 * Sets the "URL" field of a media block (image, audio, video) to the given URL
 *
 * @param {Component} block - the sjrk.storyTelling.block to update
 * @param {String} url - the URL to the block's media file
 */
sjrk.storyTelling.server.setMediaBlockUrl = function (block, url) {
    if (block.blockType === "image") {
        block.imageUrl = url;
    } else if (block.blockType === "audio" || block.blockType === "video") {
        block.mediaUrl = url;
    }
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
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            isError: true,
            message: errorAsJSON
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
        var blockFileName = "";

        if (block.blockType === "image") {
            blockFileName = block.imageUrl;
        } else if (block.blockType === "audio" || block.blockType === "video") {
            blockFileName = block.mediaUrl;
        }

        if (sjrk.storyTelling.server.isValidMediaFilename(blockFileName)) {
            filesToDelete.push(blockFileName);
        } else {
            fluid.log("Invalid filename:", blockFileName);
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

// Kettle request handler for the tests directory
fluid.defaults("sjrk.storyTelling.server.testsHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.tests"
        }
    }
});

// Kettle request handler for the testData directory
fluid.defaults("sjrk.storyTelling.server.testDataHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.testData"
        }
    }
});

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
