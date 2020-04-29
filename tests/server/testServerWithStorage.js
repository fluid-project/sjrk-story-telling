/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    fs = require("fs"),
    exif = require("jpeg-exif"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    path = require("path"),
    uuidv4 = require("uuid/v4");

require("../../src/server/staticHandlerBase");
require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryWithBinaries");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/requestHandlers");
require("../../src/server/db/story-dbConfiguration");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

require("gpii-pouchdb");

// a test story
var testStoryModel = {
    "title": "History of the Fluid Project",
    "content": [
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "image",
            "imageUrl": "logo_small_fluid_vertical.png",
            "alternativeText": "Fluid",
            "description": "The Fluid Project logo",
            "fileDetails": {
                "lastModified": 1524592510016,
                "lastModifiedDate": "2018-04-24T17:55:10.016Z",
                "name": "logo_small_fluid_vertical.png",
                "size": 3719,
                "type": "image/png"
            }
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "text",
            "text": "Fluid is an open, collaborative project to improve the user experience and inclusiveness of open source software.\n\nFluid was formed in April 2007."
        }
    ],
    "author": "Alan Harnum",
    "language": "",
    "tags": [
        "fluidproject",
        "history"
    ],
    "published": true
};

// a story with no content
var blankStory = {
    "title": "",
    "content": [],
    "author": "",
    "tags": [
        ""
    ],
    "published": true
};

// an unpublished story with no content
var unpublishedStory = {
    "title": "",
    "content": [],
    "author": "",
    "tags": [
        ""
    ],
    "published": false
};

// a story consisting only of empty blocks
var blankStoryWithEmptyMediaBlocks = {
    "title": "",
    "content": [
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "text",
            "text": null
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "image",
            "imageUrl": null,
            "alternativeText": null,
            "description": null,
            "fileDetails": null
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "mediaUrl": null,
            "alternativeText": null,
            "description": null,
            "blockType": "audio",
            "fileDetails": null
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "mediaUrl": null,
            "alternativeText": null,
            "description": null,
            "blockType": "video",
            "fileDetails": null
        }
    ],
    "author": "",
    "tags": [
        ""
    ],
    "published": true
};

// a story with image blocks, one having correct orientation and the other without
var testStoryWithImages = {
    "title": "A story to test image rotation",
    "content": [
        {
            "blockType": "image",
            "imageUrl": "incorrectOrientation.jpeg",
            "description": "A photo of a cup that starts out with incorrect orientation",
            "fileDetails": {
                "name": "incorrectOrientation.jpeg",
                "size": 1143772,
                "type": "image/jpeg"
            }
        },
        {
            "blockType": "image",
            "imageUrl": "correctOrientation.jpg",
            "description": "A photo of a virtual room that has the correct orientation already",
            "fileDetails": {
                "name": "correctOrientation.jpg",
                "size": 1064578,
                "type": "image/jpeg"
            }
        }
    ],
    "author": "Gregor Moss",
    "published": true
};

// TODO: Generalize story testing so that components (such as request
// for retrieving saved story) and test sequences can be reused across
// different story configurations. And use these generalized pieces to
// test more story configurations.

// server definitions to test file and database operations on the server
sjrk.storyTelling.server.testServerWithStorageDefs = [{
    name: "Test server with storage",
    expect: 107,
    events: {
        // Receives one argument:
        // - the path of the newly "uploaded" file
        "onMockUploadComplete": null,
        // Receives one argument:
        // - the ID of the saved story
        "onStorySaveSuccessful": null,
        // Receives error details
        "onStorySaveUnsuccessful": null,
        // Receives one argument:
        // - the filename of the image to retrieve
        "onTestImageRetrieval": null,
        // Receives two arguments:
        // - the ID of the saved story
        "onBlankStorySaveSuccessful": null,
        // Receives one argument:
        // - the ID of the saved story
        "onUnpublishedStorySaveSuccessful": null,
        // Receives one argument:
        // - the ID of the saved story
        "onBlankStoryWithEmptyMediaBlocksSaveSuccessful": null
    },
    testUploadOptions: {
        testPNGFile: "./tests/testData/logo_small_fluid_vertical.png",
        testImageWithCorrectOrientation: "./tests/testData/correctOrientation.jpg",
        testImageWithIncorrectOrientation: "./tests/testData/incorrectOrientation.jpeg",
        testDirectory: "./tests/server/uploads/",
        testDataDirectory: "./tests/testData/",
        expectedUploadDirectory: "./tests/server/uploads/",
        expectedUploadedFilesHandlerPath: "./tests/server/uploads/"
    },
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    components: {
        testDB: {
            type: "sjrk.storyTelling.server.testServerWithStorageDefs.testDB"
        },
        storySave: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories",
                method: "POST"
            }
        },
        getSavedStory: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories/%id",
                termMap: {
                    // We don't know this until the story is saved, so needs
                    // to be filled in at runtime
                    id: null
                }
            }
        },
        getUploadedImage: {
            type: "kettle.test.request.http",
            options: {
                path: "/%handlerPath/%imageFilename",
                termMap: {
                    // We don't know this until after story is saved, so needs
                    // to be filled in at runtime
                    imageFilename: null,
                    handlerPath: null
                }
            }
        },
        blankStorySave: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories",
                method: "POST"
            }
        },
        getSavedBlankStory: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories/%id",
                termMap: {
                    // We don't know this until the story is saved, so needs
                    // to be filled in at runtime
                    id: null
                }
            }
        },
        unpublishedStorySave: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories",
                method: "POST"
            }
        },
        getSavedUnpublishedStory: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories/%id"
            }
        },
        blankStoryWithEmptyMediaBlocksSave: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories",
                method: "POST"
            }
        },
        getSavedBlankStoryWithEmptyMediaBlocks: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories/%id",
                termMap: {
                    // We don't know this until the story is saved, so needs
                    // to be filled in at runtime
                    id: null
                }
            }
        },
        storyWithImagesSave: {
            type: "kettle.test.request.http",
            options: {
                path: "/stories",
                method: "POST"
            }
        }
    },
    sequence: [{
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory"]
    },
    // Story with an image
    {
        // mocks the file upload until that functionality is working again
        event: "{testDB}.dbConfiguration.events.onSuccess",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.mockFileUpload",
        args: [testStoryModel.content[0].imageUrl, "{testCaseHolder}.options.testUploadOptions.testDataDirectory", "{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.events.onMockUploadComplete"]
    },
    {
        event: "{that}.events.onMockUploadComplete",
        listener: "{that}.storySave.send",
        args: [testStoryModel]
    },
    {
        event: "{storySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful",
        args: ["{arguments}.0", "{that}.events.onStorySaveSuccessful", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    },
    {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedStory}"]
    },
    {
        event: "{getSavedStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPersistence",
        args: [
            "{arguments}.0",
            testStoryModel,
            {
                urlProp: "imageUrl",
                expectedUploadDirectory: "{testCaseHolder}.options.testUploadOptions.expectedUploadDirectory",
                expectedUploadedFilesHandlerPath: "{testCaseHolder}.options.testUploadOptions.expectedUploadedFilesHandlerPath"
            },
            "{testCaseHolder}.events.onTestImageRetrieval",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    {
        event: "{that}.events.onTestImageRetrieval",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.retrieveUploadedImage",
        args: ["{arguments}.0", "{getUploadedImage}", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    },
    {
        event: "{getUploadedImage}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageRetrieval",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    {
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    },
    // Blank story
    {
        func: "{that}.blankStorySave.send",
        args: [blankStory]
    },
    {
        event: "{blankStorySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful",
        args: [
            "{arguments}.0",
            "{that}.events.onBlankStorySaveSuccessful",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    {
        event: "{that}.events.onBlankStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedBlankStory}"]
    },
    {
        event: "{getSavedBlankStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPersistence",
        args: [
            "{arguments}.0",
            blankStory,
            null, // No file expected
            null, // No event needed
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    // Unpublished story
    {
        func: "{that}.unpublishedStorySave.send",
        args: [unpublishedStory]
    },
    {
        event: "{unpublishedStorySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful",
        args: [
            "{arguments}.0",
            "{that}.events.onUnpublishedStorySaveSuccessful",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    {
        event: "{that}.events.onUnpublishedStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedUnpublishedStory}"]
    },
    {
        event: "{getSavedUnpublishedStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryGetFails",
        args: [
            "{arguments}.0",
            null, // No event needed
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    // Blank story with empty media blocks
    {
        func: "{that}.blankStoryWithEmptyMediaBlocksSave.send",
        args: [blankStoryWithEmptyMediaBlocks]
    },
    {
        event: "{blankStoryWithEmptyMediaBlocksSave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful",
        args: [
            "{arguments}.0",
            "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    {
        event: "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedBlankStoryWithEmptyMediaBlocks}"]
    },
    {
        event: "{getSavedBlankStoryWithEmptyMediaBlocks}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPersistence",
        args: [
            "{arguments}.0",
            blankStoryWithEmptyMediaBlocks,
            null, // No file expected
            null, // No event needed
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    // Test sjrk.storyTelling.server.saveStoryToDatabase
    {
        funcName: "sjrk.storyTelling.server.saveStoryToDatabase",
        args: [
            "{server}.server.storyDataSource",
            { modelKey: "testValue" },
            "{that}.events.onStorySaveSuccessful",
            "{that}.events.onStorySaveUnsuccessful"
        ]
    },
    {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse",
        args: [{ ok: true }, "{arguments}.0"]
    },
    {
        funcName: "sjrk.storyTelling.server.saveStoryToDatabase",
        args: ["{server}.server.storyDataSource", null, "{that}.events.onStorySaveSuccessful", "{that}.events.onStorySaveUnsuccessful"]
    },
    {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse",
        args: [{ ok: true }, "{arguments}.0"]
    },
    // Verify image with incorrect orientation was rotated after uploading
    {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.mockFileUpload",
        args: [testStoryWithImages.content[0].imageUrl, "{testCaseHolder}.options.testUploadOptions.testDataDirectory", "{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.events.onMockUploadComplete"]
    },
    {
        event: "{that}.events.onMockUploadComplete",
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.mockFileUpload",
        args: [testStoryWithImages.content[1].imageUrl, "{testCaseHolder}.options.testUploadOptions.testDataDirectory", "{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.events.onMockUploadComplete"]
    },
    {
        event: "{that}.events.onMockUploadComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageOrientations",
        args: [
            ["{testCaseHolder}.options.testUploadOptions.testImageWithCorrectOrientation",
                "{testCaseHolder}.options.testUploadOptions.testImageWithIncorrectOrientation"],
            [1, 6]
        ]
    },
    {
        func: "{that}.storyWithImagesSave.send",
        args: [testStoryWithImages]
    },
    {
        event: "{storyWithImagesSave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful",
        args: ["{arguments}.0", "{that}.events.onStorySaveSuccessful", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    },
    {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageOrientations",
        args: [
            "@expand:sjrk.storyTelling.server.testServerWithStorageDefs.binaryRenameMapToUploadedFilePaths({arguments}.1, {testCaseHolder}.options.testUploadOptions.testDirectory)",
            [1, 1]
        ]
    },
    {
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    },
    // Unit tests for individual functions
    {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.setMediaBlockTests"
    },
    {
        task: "sjrk.storyTelling.server.testServerWithStorageDefs.rotateImageFromExifTests",
        resolve: "jqUnit.assert",
        resolveArgs: ["The rotateImageFromExif tests have completed successfully"]
    },
    {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.buildBinaryRenameMapTests"
    },
    {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.isValidMediaFilenameTests"
    },
    {
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    }]
}];

/**
 * Mocks a single file upload by copying a file from a given path
 * to the test uploads directory. Fires an event upon successful completion
 *
 * @param {String} filePath - the path to the file to "upload"
 * @param {String} dirPath - the path for the test uploads directory
 * @param {Object} completionEvent - an event to fire on completion
 */
sjrk.storyTelling.server.testServerWithStorageDefs.mockFileUpload = function (fileName, sourceDirPath, copyDirPath, completionEvent) {
    if (fileName) {
        var sourcePath = path.join(sourceDirPath, fileName);

        if (fs.existsSync(sourcePath)) {
            var copyPath = path.join(copyDirPath, fileName);
            fs.copyFileSync(sourcePath, copyPath);

            if (fs.existsSync(copyPath)) {
                completionEvent.fire(copyPath);
            }
        }
    }
};

/**
 * Removes all files from the test uploads directory
 *
 * @param {String} dirPath - the path for the test uploads directory
 */
sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory = function (dirPath) {
    var testUploadsDir = fs.readdirSync(dirPath);
    fluid.each(testUploadsDir, function (filePath) {
        if (filePath !== ".gitkeep") {
            fs.unlinkSync(dirPath + filePath);
        }
    });
};

/**
 * Verifies that a story was posted successfully if authoring is enabled, or
 * was not posted successfully if authoring is disabled
 *
 * @param {String} data - the data returned by the call
 * @param {Object} completionEvent - an event to fire on test completion
 * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPostRequestSuccessful = function (data, completionEvent, authoringEnabled) {
    var parsedData = JSON.parse(data);

    if (authoringEnabled) {
        jqUnit.assertTrue("Response OK is true", parsedData.ok);
        jqUnit.assertTrue("Response contains ID field", parsedData.id);
        completionEvent.fire(parsedData.id, parsedData.binaryRenameMap);
    } else {
        jqUnit.assertTrue("Response isError is true", parsedData.isError);
        jqUnit.assertFalse("Response does not contain ID field", parsedData.id);
        completionEvent.fire(0, undefined); // fire the completion event with a dummy ID
    }
};

/**
 * Prepares and sends a request to get a story from the server, including its files
 *
 * @param {String} storyId - the ID of the story to get
 * @param {Component} getSavedStoryRequest - an instance of kettle.test.request.http
 */
sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory = function (storyId, getSavedStoryRequest) {
    getSavedStoryRequest.send(null, {termMap: {id: storyId}});
};

/**
 * Verifies that a story and its files are correctly stored on the server and
 * in the database
 *
 * @param {String} data - the data returned by the call
 * @param {Object} expectedStory - the expected story model
 * @param {Object} fileOptions - options related to the uploaded files
 * @param {Object} completionEvent - an event to fire on test completion
 * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryPersistence = function (data, expectedStory, fileOptions, completionEvent, authoringEnabled) {
    var parsedData = JSON.parse(data);

    if (authoringEnabled) {
        // update the expected model to use the
        // dynamically-generated file name before we
        // test on it
        var updatedModel = fluid.copy(expectedStory);
        if (fileOptions) {
            updatedModel.content[0][fileOptions.urlProp] =
                fileOptions.expectedUploadedFilesHandlerPath
                + testStoryModel.content[0][fileOptions.urlProp];
        }

        // Strip the _rev field from the parsedData
        parsedData = fluid.censorKeys(parsedData, "_rev");

        jqUnit.assertDeepEq("Saved story data is as expected", updatedModel, parsedData);

        if (fileOptions) {
            var exists = fs.existsSync(fileOptions.expectedUploadDirectory
                + testStoryModel.content[0][fileOptions.urlProp]);

            jqUnit.assertTrue("Uploaded file exists", exists);
        }

        if (completionEvent && fileOptions) {
            completionEvent.fire(parsedData.content[0][fileOptions.urlProp]);
        }
    } else {
        jqUnit.assert("Saved story data does not exist");

        if (fileOptions) {
            jqUnit.assert("Uploaded file does not exist");
        }

        if (completionEvent) {
            completionEvent.fire(undefined);
        }
    }
};

/**
 * Verifies that a story is not successfully retrieved
 *
 * @param {String} data - the data returned by the call
 * @param {Object} completionEvent - an event to fire on test completion
 * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryGetFails = function (data, completionEvent, authoringEnabled) {
    var parsedData = JSON.parse(data);

    if (authoringEnabled) {
        jqUnit.assertEquals("Story request produced an error as expected", true, parsedData.isError);

        if (completionEvent) {
            completionEvent.fire(parsedData);
        }
    } else {
        jqUnit.assert("Saved story data does not exist");

        if (completionEvent) {
            completionEvent.fire(undefined);
        }
    }
};

/**
 * Prepares and sends a request to get an image file from the server
 *
 * @param {String} imageUrl - the URL of the image to get
 * @param {Component} getUploadedImageRequest - an instance of kettle.test.request.http
 * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
 */
sjrk.storyTelling.server.testServerWithStorageDefs.retrieveUploadedImage = function (imageUrl, getUploadedImageRequest, authoringEnabled) {
    if (authoringEnabled) {
        // TODO: this is fragile, find a better way; path.dirname and path.basename may be appropriate
        var imageFilename, handlerPath;
        handlerPath = path.dirname(imageUrl);
        imageFilename = path.basename(imageUrl);

        getUploadedImageRequest.send(null, {termMap: {imageFilename: imageFilename, handlerPath: handlerPath}});
    } else {
        getUploadedImageRequest.send(null, {termMap: {imageFilename: authoringEnabled, handlerPath: authoringEnabled}});
    }
};

/**
 * Verifies that an image was successfully retrieved
 *
 * @param {String} data - the data returned by the call
 * @param {Object} request - the Kettle request component
 * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageRetrieval = function (data, request, authoringEnabled) {
    if (authoringEnabled) {
        jqUnit.assertEquals("Status code from retrieving image is 200", 200, request.nativeResponse.statusCode);
        jqUnit.assertEquals("header.content-type is image/png", "image/png", request.nativeResponse.headers["content-type"]);
        jqUnit.assertEquals("header.content-length is 3719", "3719", request.nativeResponse.headers["content-length"]);
    } else {
        jqUnit.assertEquals("Status code from retrieving image is 404", 404, request.nativeResponse.statusCode);
        jqUnit.assertNotEquals("header.content-type is not image/png", "image/png", request.nativeResponse.headers["content-type"]);
        jqUnit.assertNotEquals("header.content-length is not 3719", "3719", request.nativeResponse.headers["content-length"]);
    }
};

/**
 * Verifies a database response is as expected (less internal DB ID's)
 *
 * @param {String} expectedResponse - the expected response data
 * @param {String} actualResponse - the expected response data
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse = function (expectedResponse, actualResponse) {
    var actualResponseWithoutIds = fluid.censorKeys(JSON.parse(actualResponse), ["id", "rev"]);

    jqUnit.assertDeepEq("Story save response was as expected", expectedResponse, actualResponseWithoutIds);
};

/**
 * Verifies whether the orientation of a given set of images is as expected
 * assumes the images have EXIF data that can be read
 *
 * @param {String[]} images - a set of images
 * @param {Number[]} expectedOrientations - a set of expected orientation values
 */
sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageOrientations = function (images, expectedOrientations) {
    fluid.each(images, function (image, index) {
        var actualOrientation = exif.parseSync(image).Orientation;
        jqUnit.assertEquals("Image orientation is as expected for image " + image, expectedOrientations[index], actualOrientation);
    });
};

/**
 * Converts a binaryRenameMap to a set of upload paths relative to the test
 * uploads directory
 *
 * @param {Object.<String, String>} binaryRenameMap - a map of uploaded file names to paths
 * @param {String} testUploadsDir - the path for the test uploads directory
 *
 * @return {String[]} - a collection of paths to which files were uploaded
 */
sjrk.storyTelling.server.testServerWithStorageDefs.binaryRenameMapToUploadedFilePaths = function (binaryRenameMap, testUploadsDir) {
    var uploadedPaths = [];
    fluid.each(binaryRenameMap, function (mapping) {
        uploadedPaths.push(testUploadsDir + mapping);
    });
    return uploadedPaths;
};

/**
 * Tests the setMediaBlockUrl function
 */
sjrk.storyTelling.server.testServerWithStorageDefs.setMediaBlockTests = function () {
    var testCases = [
        { block: { blockType: "image" }, url: "", fieldToCheck: "imageUrl", expected: "" }, // test image block with empty string
        { block: { blockType: "audio" }, url: "", fieldToCheck: "mediaUrl", expected: "" }, // test audio block with empty string
        { block: { blockType: "video" }, url: "", fieldToCheck: "mediaUrl", expected: "" }, // test video block with empty string
        { block: { blockType: "image" }, url: "testUrl", fieldToCheck: "imageUrl", expected: "testUrl" }, // test image block with set string
        { block: { blockType: "audio" }, url: "testUrl", fieldToCheck: "mediaUrl", expected: "testUrl" }, // test audio block with set string
        { block: { blockType: "video" }, url: "testUrl", fieldToCheck: "mediaUrl", expected: "testUrl" } // test video block with set string
    ];

    fluid.each(testCases, function (testCase) {
        sjrk.storyTelling.server.setMediaBlockUrl(testCase.block, testCase.url);
        var actual = testCase.block[testCase.fieldToCheck];

        var message = "Media block URL is as expected: " + testCase.expected;
        jqUnit.assertEquals(message, testCase.expected, actual);
    });
};

/**
 * Tests the rotateImageFromExif function
 *
 * @return {Promise} - a promise representing the cumulative result of all test cases
 */
sjrk.storyTelling.server.testServerWithStorageDefs.rotateImageFromExifTests = function () {
    var testCases = {
        nullFile: {
            fileName: null,
            options: null,
            expectedResolution: false,
            expectedDetails: {}
        },
        emptyFileNullOpts: {
            fileName: "",
            options: null,
            expectedResolution: false,
            expectedDetails: {}
        },
        emptyFileEmptyOpts: {
            fileName: "",
            options: "",
            expectedResolution: false,
            expectedDetails: {}
        },
        correctOrientationNullOpts: {
            fileName: "correctOrientation.jpg",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 1064578, finalFileSize: 1064578 }
        },
        incorrectOrientationNullOpts: {
            fileName: "incorrectOrientation.jpeg",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 1143772, finalFileSize: 2331730, initialOrientation: 6, finalOrientation: 1 }
        },
        gifNullOpts: {
            fileName: "test_gif.gif",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 99303, finalFileSize: 99303 }
        },
        pngNullOpts: {
            fileName: "logo_small_fluid_vertical.png",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 3719, finalFileSize: 3719 }
        },
        mp3NullOpts: {
            fileName: "Leslie_s_Strut_Sting.mp3",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 365968, finalFileSize: 365968 }
        },
        mp4NullOpts: {
            fileName: "shyguy_and_rootbeer.mp4",
            options: null,
            expectedResolution: true,
            expectedDetails: { initialFileSize: 3017238, finalFileSize: 3017238 }
        },
        correctOrientationWithOpts: {
            fileName: "correctOrientation.jpg",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 1064578, finalFileSize: 1064578 }
        },
        incorrectOrientationWithOpts: {
            fileName: "incorrectOrientation.jpeg",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 1143772, finalFileSize: 144091, initialOrientation: 6, finalOrientation: 1 }
        },
        gifWithOpts: {
            fileName: "test_gif.gif",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 99303, finalFileSize: 99303 }
        },
        pngWithOpts: {
            fileName: "logo_small_fluid_vertical.png",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 3719, finalFileSize: 3719 }
        },
        mp3WithOpts: {
            fileName: "Leslie_s_Strut_Sting.mp3",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 365968, finalFileSize: 365968 }
        },
        mp4WithOpts: {
            fileName: "shyguy_and_rootbeer.mp4",
            options: { quality: 1 },
            expectedResolution: true,
            expectedDetails: { initialFileSize: 3017238, finalFileSize: 3017238 }
        }
    };

    // We need to wait until all of the test cases are done before moving on.
    // This collection of promises will be collapsed and waited for in an IoC task fixture
    var testPromises = [];

    fluid.each(testCases, function (testCase, index) {
        jqUnit.stop();

        var filePath = testCase.fileName;

        // copy the file to the test uploads dir, if a filename was provided
        if (filePath) {
            var oldFilePath = "./tests/testData/" + testCase.fileName;
            filePath = "./tests/server/uploads/" + uuidv4() + path.extname(testCase.fileName);
            fs.copyFileSync(oldFilePath, filePath);

            var initialFileStats = fs.statSync(filePath);
            jqUnit.assertEquals("The file size is as expected for test case: initial " + index, testCase.expectedDetails.initialFileSize, initialFileStats.size);
        }

        if (testCase.expectedDetails.initialOrientation) {
            jqUnit.assertEquals("The file orientation is as expected for test case: initial " + index, testCase.expectedDetails.initialOrientation, exif.parseSync(filePath).Orientation);
        }

        var singleTestPromise = fluid.promise();
        testPromises.push(singleTestPromise);

        // call the function passing the new copy's path and options
        sjrk.storyTelling.server.rotateImageFromExif({ path: filePath }, testCase.options).then(function (imageData) {
            jqUnit.assertEquals("Rotation call resolved as expected for test case " + index, testCase.expectedResolution, true);

            var finalFileStats = fs.statSync(filePath);
            jqUnit.assertEquals("The file size is as expected for test case: final " + index, testCase.expectedDetails.finalFileSize, finalFileStats.size);

            if (testCase.expectedDetails.finalOrientation) {
                // imageData.orientation is the original orientation, so we have to check the returned file (via the jpeg-exif package)
                jqUnit.assertEquals("The file orientation is as expected for test case: final " + index, testCase.expectedDetails.finalOrientation, exif.fromBuffer(imageData.buffer).Orientation);
            }

            jqUnit.start();
            singleTestPromise.resolve();
        }, function () {
            jqUnit.assertEquals("Rotation call rejected as expected for test case " + index, testCase.expectedResolution, false);

            if (filePath) {
                var finalFileStats = fs.statSync(filePath);
                jqUnit.assertEquals("The file size is as expected for test case: final " + index, testCase.expectedDetails.finalFileSize, finalFileStats.size);
            }

            jqUnit.start();
            singleTestPromise.resolve();
        });
    });

    return fluid.promise.sequence(testPromises);
};

/**
 * Tests the buildBinaryRenameMap function
 */
sjrk.storyTelling.server.testServerWithStorageDefs.buildBinaryRenameMapTests = function () {
    var testImageBlockNoFileDetails = { blockType: "image", imageUrl: "shouldNotBeMapped", mediaUrl: "shouldBeIgnored" };
    var testImageBlockWithFileDetails = { blockType: "image", imageUrl: "shouldNotBeMapped", mediaUrl: "shouldBeIgnored", fileDetails: { name: "testFile.jpg" } };

    var testAudioBlockNoFileDetails = { blockType: "audio", imageUrl: "shouldBeIgnored", mediaUrl: "shouldNotBeMapped" };
    var testAudioBlockWithFileDetails = { blockType: "audio", imageUrl: "shouldBeIgnored", mediaUrl: "shouldNotBeMapped", fileDetails: { name: "testFile.mp3" } };

    var testVideoBlockNoFileDetails = { blockType: "video", imageUrl: "shouldBeIgnored", mediaUrl: "shouldNotBeMapped" };
    var testVideoBlockWithFileDetails = { blockType: "video", imageUrl: "shouldBeIgnored", mediaUrl: "shouldNotBeMapped", fileDetails: { name: "testFile.mp4" } };

    var testImageFile = { filename: "aNewFileName.jpg", originalname: "testFile.jpg" };
    var testAudioFile = { filename: "aNewFileName.mp3", originalname: "testFile.mp3" };
    var testVideoFile = { filename: "aNewFileName.mp4", originalname: "testFile.mp4" };
    var testDuplicateImageFile = { filename: "aDifferentNewFileName.jpg", originalname: "testFile.jpg" };
    var testBogusFile = { filename: "aNewFileName.jpg", originalname: "notReallyAFile.jpg" };

    var testCases = [
        { content: [], files: [], expectedResult: {} },
        { content: null, files: null, expectedResult: {} },
        { content: [{ blockType: "text", text: "", imageUrl: "shouldBeIgnored", mediaUrl: "shouldAlsoBeIgnored" }], files: [], expectedResult: {} },
        // testing blocks with no file details and no files
        { content: [testImageBlockNoFileDetails], files: [], expectedResult: {} },
        { content: [testAudioBlockNoFileDetails], files: [], expectedResult: {} },
        { content: [testVideoBlockNoFileDetails], files: [], expectedResult: {} },
        // testing blocks with file details but no matching blocks
        { content: [testImageBlockWithFileDetails], files: [testAudioFile, testVideoFile, testBogusFile], expectedResult: {} },
        { content: [testAudioBlockWithFileDetails], files: [testImageFile, testVideoFile, testBogusFile], expectedResult: {} },
        { content: [testVideoBlockWithFileDetails], files: [testImageFile, testAudioFile, testBogusFile], expectedResult: {} },
        // testing blocks with file details and one matching block each
        { content: [testImageBlockWithFileDetails], files: [testImageFile, testBogusFile], expectedResult: { "testFile.jpg": "aNewFileName.jpg" } },
        { content: [testAudioBlockWithFileDetails], files: [testAudioFile, testBogusFile], expectedResult: { "testFile.mp3": "aNewFileName.mp3" } },
        { content: [testVideoBlockWithFileDetails], files: [testVideoFile, testBogusFile], expectedResult: { "testFile.mp4": "aNewFileName.mp4" } },
        // testing image block with two files that have the same original name, which we expect only one match out of
        { content: [testImageBlockWithFileDetails, testImageBlockWithFileDetails], files: [testImageFile, testDuplicateImageFile, testBogusFile], expectedResult: { "testFile.jpg": "aNewFileName.jpg" } },
        // testing multiple blocks all with matching files
        { content: [
            testImageBlockWithFileDetails,
            testAudioBlockWithFileDetails,
            testVideoBlockWithFileDetails
        ], files: [
            testImageFile,
            testAudioFile,
            testVideoFile,
            testBogusFile
        ], expectedResult: {
            "testFile.jpg": "aNewFileName.jpg",
            "testFile.mp3": "aNewFileName.mp3",
            "testFile.mp4": "aNewFileName.mp4"
        }}
    ];

    fluid.each(testCases, function (testCase) {
        var actualResult = sjrk.storyTelling.server.buildBinaryRenameMap(testCase.content, testCase.files);

        jqUnit.assertDeepEq("Binary rename map was produced as expected", testCase.expectedResult, actualResult);
    });
};

/**
 * Tests the isValidMediaFilename function
 */
sjrk.storyTelling.server.testServerWithStorageDefs.isValidMediaFilenameTests = function () {
    var testCases = [
        { input: null, expected: false },
        { input: undefined, expected: false },
        { input: 0, expected: false },
        { input: {}, expected: false },
        { input: [], expected: false },
        { input: [0], expected: false },
        { input: "", expected: false },
        { input: "../", expected: false },
        { input: "FailingFileName", expected: false },
        { input: "FailingFileName.ext", expected: false },
        { input: "1f4EAE4020CF11E9975C2103755D20B8.mp4", expected: false },
        { input: "1f4eae4020cf11e9975c2103755d20b8.mp4", expected: false },
        { input: "jpg.1f4845a0-20cf-11e9-975c-2103755d20b8", expected: false },
        { input: "/uploads/1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: false },
        { input: "../1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: false },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8.jpg.exe", expected: false },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8", expected: true },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: true },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8.mp4", expected: true },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8._jpg", expected: true },
        { input: "1f4845a0-20cf-11e9-975c-2103755d20b8.somethingVeryLong", expected: true }
    ];

    fluid.each(testCases, function (testCase) {
        var actualResult = sjrk.storyTelling.server.isValidMediaFilename(testCase.input);
        var message = "Filename validity is as expected: " + testCase.input;
        jqUnit.assertEquals(message, testCase.expected, actualResult);
    });
};

// a database for file and database tests
fluid.defaults("sjrk.storyTelling.server.testServerWithStorageDefs.testDB", {
    gradeNames: ["fluid.component"],
    components: {
        pouchHarness: {
            type: "gpii.pouch.harness",
            options: {
                port: 6789
            }
        },
        dbConfiguration: {
            type: "sjrk.storyTelling.server.storiesDb",
            createOnEvent: "{pouchHarness}.events.onReady",
            options: {
                listeners: {
                    "onCreate.configureCouch": "{that}.configureCouch"
                },
                couchOptions: {
                    couchUrl: "http://localhost:6789"
                }
            }
        }
    }
});

// starts up the test server based on the provided definitions
kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithStorageDefs);
