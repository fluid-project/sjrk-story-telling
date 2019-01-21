/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    fs = require("fs"),
    jqUnit = fluid.registerNamespace("jqUnit");

require("../src/js/staticHandlerBase");
require("../src/js/middleware/basicAuth");
require("../src/js/middleware/saveStoryWithBinaries");
require("../src/js/middleware/staticMiddlewareSubdirectoryFilter");
require("../src/js/dataSource");
require("../src/js/serverSetup");
require("../src/js/requestHandlers");
require("../src/js/serverSetup");
require("../src/js/db/story-dbConfiguration");

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
            "simplifiedText": null,
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
            "simplifiedText": null,
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
            "transcript": null,
            "hasTranscript": true,
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
            "transcript": null,
            "hasTranscript": true,
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

// TODO: Generalize story testing so that components (such as request
// for retrieving saved story) and test sequences can be reused across
// different story configurations. And use these generalized pieces to
// test more story configurations.

sjrk.storyTelling.server.testServerWithStorageDefs = [{
    name: "Test server with storage",
    expect: 16,
    events: {
        // Receives two arguments:
        // - the ID of the saved story
        // - the binaryRenameMap
        "onStorySaveSuccessful": null,
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
        testFile: "./tests/binaries/logo_small_fluid_vertical.png",
        testDirectory: "./tests/uploads/",
        expectedUploadDirectory: "./tests/uploads/",
        expectedUploadedFilesHandlerPath: "/uploads/"
    },
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/configs"
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
                        "file": ["{testCaseHolder}.options.testUploadOptions.testFile"]
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
        args: ["{arguments}.0", "{arguments}.1", "{that}.events.onStorySaveSuccessful"]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{arguments}.1", "{getSavedStory}"]
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
            "{testCaseHolder}.events.onTestImageRetrieval"
        ]
    },
    {
        event: "{that}.events.onTestImageRetrieval",
        args: ["{arguments}.0", "{getUploadedImage}"],
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.retrieveUploadedImage"
    },
    {
        event: "{getUploadedImage}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testImageRetrieval"
    },
    {
        func: "sjrk.storyTelling.server.testServerWithStorageDefs.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testUploadOptions.testDirectory"]
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
            "{that}.events.onBlankStorySaveSuccessful"
        ]
    }, {
        event: "{that}.events.onBlankStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{getSavedBlankStory}"
        ]
    }, {
        event: "{getSavedBlankStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            blankStory,
            null, // No file expected
            null // No event needed
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
            "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful"
        ]
    }, {
        event: "{that}.events.onBlankStoryWithEmptyMediaBlocksSaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            "{getSavedBlankStoryWithEmptyMediaBlocks}"
        ]
    }, {
        event: "{getSavedBlankStoryWithEmptyMediaBlocks}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence",
        args: [
            "{arguments}.0",
            "{arguments}.1",
            blankStoryWithEmptyMediaBlocks,
            null, // No file expected
            null // No event needed
        ]
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

sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPostRequestSuccessful = function (data, request, completionEvent) {
    var parsedData = JSON.parse(data);

    jqUnit.assertTrue("Response OK is true", parsedData.ok);

    jqUnit.assertTrue("Response contains ID field", parsedData.id);

    jqUnit.assertTrue("Response contains binaryRenameMap field", parsedData.binaryRenameMap);

    completionEvent.fire(parsedData.id, parsedData.binaryRenameMap);
};

sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory = function (storyId, binaryRenameMap, getSavedStoryRequest) {

    // We store this material on the request so we can
    // keep moving it forward; may be a better way
    getSavedStoryRequest.binaryRenameMap = binaryRenameMap;
    getSavedStoryRequest.send(null, {termMap: {id: storyId}});
};

sjrk.storyTelling.server.testServerWithStorageDefs.testStoryPersistence = function (data, request, expectedStory, fileOptions, completionEvent) {
    var binaryRenameMap = request.binaryRenameMap;
    var parsedData = JSON.parse(data);

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
};

sjrk.storyTelling.server.testServerWithStorageDefs.retrieveUploadedImage = function (imageUrl, getUploadedImageRequest) {
    // TODO: this is fragile, find a better way; path.dirname and path.basename may be appropriate
    var imageFilename, handlerPath;
    handlerPath = imageUrl.split("/")[1];
    imageFilename = imageUrl.split("/")[2];

    getUploadedImageRequest.send(null, {termMap: {imageFilename: imageFilename, handlerPath: handlerPath}});
};

sjrk.storyTelling.server.testServerWithStorageDefs.testImageRetrieval = function (data, request) {
    jqUnit.assertEquals("Status code from retrieving image is 200", 200, request.nativeResponse.statusCode);
    jqUnit.assertEquals("header.content-type is image/png", "image/png", request.nativeResponse.headers["content-type"]);
    jqUnit.assertEquals("header.content-length is 3719", "3719", request.nativeResponse.headers["content-length"]);
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
