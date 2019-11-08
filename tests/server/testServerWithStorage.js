/*
Copyright 2018-2019 OCAD University
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
    uuidv1 = require("uuid/v1");

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

var testStoryModel = {
    "languageFromSelect": "",
    "languageFromInput": "",
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
            "languageFromSelect": "",
            "languageFromInput": "",
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
            "text": "Fluid is an open, collaborative project to improve the user experience and inclusiveness of open source software.\n\nFluid was formed in April 2007.",
            "languageFromSelect": "",
            "languageFromInput": ""
        }
    ],
    "author": "Alan Harnum",
    "language": "",
    "images": [],
    "tags": [
        "fluidproject",
        "history"
    ],
    "categories": [],
    "summary": "",
    "timestampCreated": null,
    "timestampModified": null,
    "requestedTranslations": [],
    "translationOf": null
};

var blankStory = {
    "title": "",
    "content": [],
    "contentString": "",
    "author": "",
    "tags": [
        ""
    ],
    "keywordString": "",
    "summary": "",
    "thumbnailUrl": "",
    "thumbnailAltText": "",
    "contentTypes": [],
    "languageFromSelect": "",
    "languageFromInput": ""
};

var blankStoryWithEmptyMediaBlocks = {
    "title": "",
    "content": [
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "text",
            "text": null,
            "contentString": "",
            "languageFromSelect": "",
            "languageFromInput": ""
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "image",
            "imageUrl": null,
            "alternativeText": null,
            "description": null,
            "contentString": "",
            "languageFromSelect": "",
            "languageFromInput": "",
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
            "contentString": "",
            "languageFromSelect": "",
            "languageFromInput": "",
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
            "contentString": "",
            "languageFromSelect": "",
            "languageFromInput": "",
            "fileDetails": null
        }
    ],
    "contentString": "",
    "author": "",
    "tags": [
        ""
    ],
    "keywordString": "",
    "summary": "",
    "thumbnailUrl": "",
    "thumbnailAltText": "",
    "contentTypes": [],
    "languageFromSelect": "",
    "languageFromInput": ""
};

var testStoryWithImages = {
    "title": "A story to test image rotation",
    "content": [
        {
            "blockType": "image",
            "imageUrl": "hotblack_cup_rotated.jpeg",
            "description": "A photo of a cup that starts out with incorrect orientation",
            "fileDetails": {
                "name": "hotblack_cup_rotated.jpeg",
                "size": 1143772,
                "type": "image/jpeg"
            }
        },
        {
            "blockType": "image",
            "imageUrl": "obliterationroom.jpg",
            "description": "A photo of a wall that has the correct orientation already",
            "fileDetails": {
                "name": "obliterationroom.jpg",
                "size": 1583244,
                "type": "image/jpeg"
            }
        }
    ],
    "author": "Gregor Moss"
};

// TODO: Generalize story testing so that components (such as request
// for retrieving saved story) and test sequences can be reused across
// different story configurations. And use these generalized pieces to
// test more story configurations.

sjrk.storyTelling.server.testServerWithStorageDefs = [{
    name: "Test server with storage",
    expect: 81,
    events: {
        // Receives two arguments:
        // - the ID of the saved story
        // - the binaryRenameMap
        "onStorySaveSuccessful": null,
        // Receives error details
        "onStorySaveUnsuccessful": null,
        // Receives one argument:
        // - the filename of the image to retrieve
        "onTestImageRetrieval": null,
        // Receives two arguments:
        // - the ID of the saved story
        // - the binaryRenameMap
        "onBlankStorySaveSuccessful": null,
        // Receives two arguments:
        // - the ID of the saved story
        // - the binaryRenameMap
        "onBlankStoryWithEmptyMediaBlocksSaveSuccessful": null
    },
    testUploadOptions: {
        testPNGFile: "./tests/testData/logo_small_fluid_vertical.png",
        testImageWithCorrectOrientation: "./tests/testData/obliterationroom.jpg",
        testImageWithIncorrectOrientation: "./tests/testData/hotblack_cup_rotated.jpeg",
        testDirectory: "./tests/server/uploads/",
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
            type: "kettle.test.request.formData",
            options: {
                path: "/stories",
                method: "POST",
                formData: {
                    files: {
                        "file": ["{testCaseHolder}.options.testUploadOptions.testPNGFile"]
                    },
                    fields: {
                        "model": {
                            expander: {
                                type: "fluid.noexpand",
                                value: JSON.stringify(testStoryModel)
                            }
                        }
                    }
                }
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
            type: "kettle.test.request.formData",
            options: {
                path: "/stories",
                method: "POST",
                formData: {
                    fields: {
                        "model": {
                            expander: {
                                type: "fluid.noexpand",
                                value: JSON.stringify(blankStory)
                            }
                        }
                    }
                }
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
        blankStoryWithEmptyMediaBlocksSave: {
            type: "kettle.test.request.formData",
            options: {
                path: "/stories",
                method: "POST",
                formData: {
                    fields: {
                        "model": {
                            expander: {
                                type: "fluid.noexpand",
                                value: JSON.stringify(blankStoryWithEmptyMediaBlocks)
                            }
                        }
                    }
                }
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
            type: "kettle.test.request.formData",
            options: {
                path: "/stories",
                method: "POST",
                formData: {
                    files: {
                        "file": [
                            "{testCaseHolder}.options.testUploadOptions.testImageWithCorrectOrientation",
                            "{testCaseHolder}.options.testUploadOptions.testImageWithIncorrectOrientation"
                        ]
                    },
                    fields: {
                        "model": {
                            expander: {
                                type: "fluid.noexpand",
                                value: JSON.stringify(testStoryWithImages)
                            }
                        }
                    }
                }
            }
        }
    },
    sequence: [{
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory"]
    },
    // Story with an image
    {
        event: "{testDB}.dbConfiguration.events.onSuccess",
        listener: "{that}.storySave.send"
    }, {
        event: "{storySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "{that}.events.onStorySaveSuccessful", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{arguments}.1", "{getSavedStory}", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    }, {
        event: "{getSavedStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence",
        args: [
            "{arguments}.0",
            "{arguments}.1",
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
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testImageRetrieval",
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
        func: "{that}.blankStorySave.send"
    }, {
        event: "{blankStorySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{that}.events.onBlankStorySaveSuccessful",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    }, {
        event: "{that}.events.onBlankStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{getSavedBlankStory}",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    }, {
        event: "{getSavedBlankStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            blankStory,
            null, // No file expected
            null, // No event needed
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    },
    // Blank story with empty media blocks
    {
        func: "{that}.blankStoryWithEmptyMediaBlocksSave.send"
    }, {
        event: "{blankStoryWithEmptyMediaBlocksSave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    }, {
        event: "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{getSavedBlankStoryWithEmptyMediaBlocks}",
            "{that}.configuration.server.options.globalConfig.authoringEnabled"
        ]
    }, {
        event: "{getSavedBlankStoryWithEmptyMediaBlocks}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence",
        args: [
            "{arguments}.0",
            "{arguments}.1",
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
            { testFile:"mappedName.test" },
            { modelKey: "testValue" },
            "{that}.events.onStorySaveSuccessful",
            "{that}.events.onStorySaveUnsuccessful"
        ]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse",
        args: [{ ok: true, binaryRenameMap: { testFile: "mappedName.test" } }, "{arguments}.0"]
    }, {
        funcName: "sjrk.storyTelling.server.saveStoryToDatabase",
        args: ["{server}.server.storyDataSource", null, null, "{that}.events.onStorySaveSuccessful", "{that}.events.onStorySaveUnsuccessful"]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse",
        args: [{ ok: true, binaryRenameMap: null }, "{arguments}.0"]
    },
    // Verify image with incorrect orientation was rotated after uploading
    {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageOrientations",
        args: [
            ["{testCaseHolder}.options.testUploadOptions.testImageWithCorrectOrientation",
            "{testCaseHolder}.options.testUploadOptions.testImageWithIncorrectOrientation"],
            [1, 6]
        ]
    }, {
        func: "{that}.storyWithImagesSave.send"
    }, {
        event: "{storyWithImagesSave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "{that}.events.onStorySaveSuccessful", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    }, {
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
    }, {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.rotateImageFromExifTests"
    }, {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.buildBinaryRenameMapTests"
    }, {
        funcName: "sjrk.storyTelling.server.testServerWithStorageDefs.isValidMediaFilenameTests"
    },
    {
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory", "{that}.configuration.server.options.globalConfig.authoringEnabled"]
    }]
}];

sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory = function (dirPath) {
    var testUploadsDir = fs.readdirSync(dirPath);
    fluid.each(testUploadsDir, function (filePath) {
        if (filePath !== ".gitkeep") {
            fs.unlinkSync(dirPath + filePath);
        }
    });
};

sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful = function (data, request, completionEvent, authoringEnabled) {
    var parsedData = JSON.parse(data);

    if (authoringEnabled) {
        jqUnit.assertTrue("Response OK is true", parsedData.ok);
        jqUnit.assertTrue("Response contains ID field", parsedData.id);
        jqUnit.assertTrue("Response contains binaryRenameMap field", parsedData.binaryRenameMap);
        completionEvent.fire(parsedData.id, parsedData.binaryRenameMap);
    } else {
        jqUnit.assertTrue("Response isError is true", parsedData.isError);
        jqUnit.assertFalse("Response does not contain ID field", parsedData.id);
        jqUnit.assertFalse("Response does not contains binaryRenameMap field", parsedData.binaryRenameMap);
        completionEvent.fire(0, undefined); // fire the completion event with a dummy ID
    }
};

sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory = function (storyId, binaryRenameMap, getSavedStoryRequest, authoringEnabled) {
    if (authoringEnabled) {
        // We store this material on the request so we can
        // keep moving it forward; may be a better way
        getSavedStoryRequest.binaryRenameMap = binaryRenameMap;
    }

    getSavedStoryRequest.send(null, {termMap: {id: storyId}});
};

sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence = function (data, request, expectedStory, fileOptions, completionEvent, authoringEnabled) {
    var binaryRenameMap = request.binaryRenameMap;
    var parsedData = JSON.parse(data);

    if (authoringEnabled) {
        // update the expected model to use the
        // dynamically-generated file name before we
        // test on it
        var updatedModel = fluid.copy(expectedStory);
        if (fileOptions) {
            updatedModel.content[0][fileOptions.urlProp] =
                fileOptions.expectedUploadedFilesHandlerPath
                + binaryRenameMap[testStoryModel.content[0][fileOptions.urlProp]];
        }

        // Strip the _rev field from the parsedData
        parsedData = fluid.censorKeys(parsedData, "_rev");

        jqUnit.assertDeepEq("Saved story data is as expected", updatedModel, parsedData);

        if (fileOptions) {
            var exists = fs.existsSync(fileOptions.expectedUploadDirectory
                + binaryRenameMap[testStoryModel.content[0][fileOptions.urlProp]]);

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

sjrk.storyTelling.server.testServerWithStorageDefs.testImageRetrieval = function (data, request, authoringEnabled) {
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

sjrk.storyTelling.server.testServerWithStorageDefs.verifyStoryDataSourceResponse = function (expectedResponse, actualResponse) {
    var actualResponseWithoutIds = fluid.censorKeys(JSON.parse(actualResponse), ["id", "rev"]);

    jqUnit.assertDeepEq("Story save response was as expected", expectedResponse, actualResponseWithoutIds);
};

// Verifies whether the orientation of a given set of images is as expected
// assumes the images have EXIF data that can be read
sjrk.storyTelling.server.testServerWithStorageDefs.verifyImageOrientations = function (images, expectedOrientations) {
    fluid.each(images, function (image, index) {
        var actualOrientation = exif.parseSync(image).Orientation;
        jqUnit.assertEquals("Image orientation is as expected for image " + image, expectedOrientations[index], actualOrientation);
    });
};

sjrk.storyTelling.server.testServerWithStorageDefs.binaryRenameMapToUploadedFilePaths = function (binaryRenameMap, testUploadsDir) {
    var uploadedPaths = [];
    fluid.each(binaryRenameMap, function (mapping) {
        uploadedPaths.push(testUploadsDir + mapping);
    });
    return uploadedPaths;
};

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

sjrk.storyTelling.server.testServerWithStorageDefs.rotateImageFromExifTests = function () {
    var testCases = [
        { fileName: null, options: null, expectedResolution: false },
        { fileName: "", options: null, expectedResolution: false },
        { fileName: "", options: "", expectedResolution: false },
        { fileName: "obliterationroom.jpg", options: null, expectedResolution: false }, // false because it is already oriented properly
        { fileName: "hotblack_cup_rotated.jpeg", options: null, expectedResolution: true },
        { fileName: "test_gif.gif", options: null, expectedResolution: false },
        { fileName: "logo_small_fluid_vertical.png", options: null, expectedResolution: false },
        { fileName: "Leslie_s_Strut_Sting.mp3", options: null, expectedResolution: false },
        { fileName: "shyguy_and_rootbeer.mp4", options: null, expectedResolution: false },
        { fileName: "obliterationroom.jpg", options: { quality: 1 }, expectedResolution: false },
        { fileName: "hotblack_cup_rotated.jpeg", options: { quality: 1 }, expectedResolution: true },
        { fileName: "test_gif.gif", options: { quality: 1 }, expectedResolution: false },
        { fileName: "logo_small_fluid_vertical.png", options: { quality: 1 }, expectedResolution: false },
        { fileName: "Leslie_s_Strut_Sting.mp3", options: { quality: 1 }, expectedResolution: false },
        { fileName: "shyguy_and_rootbeer.mp4", options: { quality: 1 }, expectedResolution: false }
    ];

    fluid.each(testCases, function (testCase) {
        var filePath = testCase.fileName;

        // copy the file to the test uploads dir, if a filename was provided
        if (filePath) {
            var oldFilePath = "./tests/testData/" + testCase.fileName;
            filePath = "./tests/server/uploads/" + uuidv1() + path.extname(testCase.fileName);
            fs.copyFileSync(oldFilePath, filePath);
        }

        // call the function passing the new path and options where applicable
        jqUnit.stop();
        sjrk.storyTelling.server.rotateImageFromExif({ path: filePath }, testCase.options).then(function () {
            jqUnit.assertEquals("Rotation call resolved as expected", testCase.expectedResolution, true);
            jqUnit.start();
        }, function () {
            jqUnit.assertEquals("Rotation call rejected as expected", testCase.expectedResolution, false);
            jqUnit.start();
        });
    });
};

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

kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithStorageDefs);
