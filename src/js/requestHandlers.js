/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var uuidv1 = require("uuid/v1");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// TODO: this needs tests
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

// TODO: might more appropriately be a transform
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

// TODO: the get handler will need to provide an expanded URL for the binary locations, based on the config
sjrk.storyTelling.server.handleGetStory = function (request, dataSource, uploadedFilesHandlerPath) {
    var id = request.req.params.id;
    var promise = dataSource.get({directStoryId: id});

    promise.then(function (response) {

        fluid.transform(response.content, function (block) {
            // fluid.log("BLOCK: ", block);
            if (block.blockType === "image") {
                block.imageUrl = uploadedFilesHandlerPath + "/" + block.imageUrl;
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

    // TODO: validation of model - via https://github.com/GPII/gpii-json-schema maybe?

    // key-value pairs of original filename : generated filename
    // this is used primarily by tests, but may be of use
    // to client-side components too
    var binaryRenameMap = {};

    // Update any image URLs to refer to the changed
    // file names
    fluid.transform(storyModel.content, function (block) {
        // fluid.log("BLOCK: ", block);
        if (block.blockType === "image") {
            var imageFile = fluid.find_if(request.req.files.file, function (singleFile) {
                // fluid.log("SINGLEFILE: ", singleFile);
                return singleFile.originalname === block.fileDetails.name;
            });

            block.imageUrl = imageFile.filename;

            binaryRenameMap[imageFile.originalname] = imageFile.filename;

            return block;
        }
    });

    // Then persist that model to couch, with the updated
    // references to where the binaries are saved
    // TODO: remove fileDetails since it's not needed for persistence

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
            args: ["{arguments}.0", "{server}.deleteStoryDataSource", "{server}.storyDataSource"]
        }
    }
});

sjrk.storyTelling.server.handleDeleteStory = function (request, deleteStoryDataSource, getStoryDataSource) {

    var promise = sjrk.storyTelling.server.deleteStoryFromCouch(request.req.params.id, deleteStoryDataSource, getStoryDataSource);

    promise.then(function (response) {
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

sjrk.storyTelling.server.deleteStoryFromCouch = function (id, deleteStoryDataSource, getStoryDataSource) {

    // TODO: get the revision ID from the record and set it
    // dynamically

    var promise = fluid.promise();

    var getPromise = getStoryDataSource.get({
        directStoryId: id
    });

    getPromise.then(function (response) {

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
