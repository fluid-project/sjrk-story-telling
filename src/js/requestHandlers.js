/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var uuidv1 = require("uuid/v1");
var fs = require("fs");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.browseStoriesHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleBrowseStories",
            args: ["{request}", "{server}.viewDataSource"]
        }
    }
});

sjrk.storyTelling.server.handleBrowseStories = function (request, viewDatasource) {
    var promise = viewDatasource.get({directViewId: "storiesById"});
    promise.then(function (response) {
        var extracted = sjrk.storyTelling.server.browseStoriesHandler.extractFromCouchResponse(response);
        var responseAsJSON = JSON.stringify(extracted);
        request.events.onSuccess.fire(responseAsJSON);
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            message: errorAsJSON
        });
    });

};

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


fluid.defaults("sjrk.storyTelling.server.getStoryHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleGetStory",
            args: ["{request}", "{server}.storyDataSource", "{server}.options.globalConfig.uploadedFilesHandlerPath"]
        }
    }
});

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
            message: errorAsJSON
        });
    });
};

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
            args: ["{arguments}.0", "{server}.storyDataSource"]
        }
    }
});

sjrk.storyTelling.server.handleSaveStoryWithBinaries = function (request, dataSource) {

    var id = uuidv1();

    var storyModel = JSON.parse(request.req.body.model);

    // key-value pairs of original filename : generated filename
    // this is used primarily by tests, but may be of use
    // to client-side components too
    var binaryRenameMap = {};

    // Update any media URLs to refer to the changed
    // file names
    fluid.each(storyModel.content, function (block) {
        if ((block.blockType === "image" || block.blockType === "audio" || block.blockType === "video") && block.fileDetails) {
            // Look for the uploaded file matching this block
            var mediaFile = fluid.find_if(request.req.files.file, function (singleFile) {
                return singleFile.originalname === block.fileDetails.name;
            });

            // If we find a match, update the media URL
            if (mediaFile) {
                if (block.blockType === "image") {
                    block.imageUrl = mediaFile.filename;
                } else if (block.blockType === "audio" || block.blockType === "video") {
                    block.mediaUrl = mediaFile.filename;
                }

                binaryRenameMap[mediaFile.originalname] = mediaFile.filename;
            }
        }
    });

    // Then persist that model to couch, with the updated
    // references to where the binaries are saved

    var promise = dataSource.set({directStoryId: id}, storyModel);

    promise.then(function (response) {
        response.binaryRenameMap = binaryRenameMap;
        var responseAsJSON = JSON.stringify(response);
        request.events.onSuccess.fire(responseAsJSON);
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            message: errorAsJSON
        });
    });
};

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
            args: ["{arguments}.0", "{server}.deleteStoryDataSource", "{server}.storyDataSource", "{server}.options.globalConfig"]
        }
    }
});

sjrk.storyTelling.server.handleDeleteStory = function (request, deleteStoryDataSource, getStoryDataSource, serverConfig) {

    var promise = sjrk.storyTelling.server.deleteStoryFromCouch(request.req.params.id, deleteStoryDataSource, getStoryDataSource, serverConfig);

    promise.then(function () {
        request.events.onSuccess.fire({
            message: "DELETE request received successfully for story with id: " + request.req.params.id
        });
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            message: errorAsJSON
        });
    });
};

sjrk.storyTelling.server.deleteStoryFromCouch = function (id, deleteStoryDataSource, getStoryDataSource, serverConfig) {

    var promise = fluid.promise();

    var getPromise = getStoryDataSource.get({
        directStoryId: id
    });

    getPromise.then(function (response) {
        if (response.content) {
            sjrk.storyTelling.server.deleteStoryFiles(response.content, serverConfig);
        }

        var deletePromise = deleteStoryDataSource.set({
            directStoryId: id,
            directRevisionId: response._rev
        });

        deletePromise.then(function (response) {
            promise.resolve(response);
        }, function (error) {
            promise.reject(error);
        });
    }, function (error) {

        promise.reject(error);
    });

    return promise;
};

sjrk.storyTelling.server.deleteStoryFiles = function (storyContent, serverConfig) {
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
        }
    });

    // remove duplicate entries so we don't try to delete already-deleted files
    filesToDelete = filesToDelete.filter(function (fileName, index, self) {
        return self.indexOf(fileName) === index;
    });

    fluid.each(filesToDelete, function (fileToDelete) {
        sjrk.storyTelling.server.deleteSingleFileRecoverable(fileToDelete, serverConfig);
    });
};

/*
 * Verifies that a given file name follows the UUID format as laid out in
 * RFC4122. A detailed description of the format can be found here:
 * https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
 */
sjrk.storyTelling.server.isValidMediaFilename = function (fileName) {
    if (fileName && typeof fileName === "string" ) {
        var validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\..*$/;

        return validUuid.test(fileName);
    } else {
        return false;
    }
};

sjrk.storyTelling.server.getServerPathForFile = function (fileName, directoryName) {
    return "." + directoryName + path.sep + fileName;
};

sjrk.storyTelling.server.deleteSingleFileRecoverable = function (fileToDelete, serverConfig) {
    var recoveryPath = sjrk.storyTelling.server.getServerPathForFile(fileToDelete, serverConfig.deletedFilesRecoveryPath);
    var deletionPath = sjrk.storyTelling.server.getServerPathForFile(fileToDelete, serverConfig.uploadedFilesHandlerPath);

    // make sure the file is in the uploads dir before we begin
    try {
        fs.accessSync(deletionPath, fs.constants.W_OK | fs.constants.R_OK);
    } catch (err) {
        fluid.fail("File did not exist before deletion:", deletionPath, "Error detail:", err.toString());
    }

    // move it to the recovery dir and make sure it was moved
    try {
        fs.renameSync(deletionPath, recoveryPath);
        fs.accessSync(recoveryPath, fs.constants.W_OK | fs.constants.R_OK);
        fluid.log("Moved file to recovery dir:", recoveryPath);
    } catch (err) {
        fluid.fail("Error moving file to recover dir:", deletionPath, "Error detail:", err.toString());
    }

    // make sure it's gone from the uploads dir
    try {
        fs.accessSync(deletionPath);
        fluid.fail("File was not deleted:", deletionPath);
    } catch (err) {
        fluid.log("Deleted file:", deletionPath);
    }
};

fluid.defaults("sjrk.storyTelling.server.uiHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.ui"
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.uploadsHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.uploads"
        }
    }
});

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
