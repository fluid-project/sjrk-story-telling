/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    fs = require("fs"),
    exif = require("jpeg-exif"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    path = require("path"),
    { v4: uuidv4 } = require("uuid");

require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/authRequestHandlers");
require("../../src/server/staticRequestHandlers");
require("../../src/server/storyRequestHandlers");
require("../../src/server/validators");
require("../../src/server/db/story-dbConfiguration");
require("./utils/serverTestUtils.js");
require("./utils/mockDatabase.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

// a test story
var testStoryModelPrePublish = {
    "id": "testStoryModel-ID",
    "title": "History of the Fluid Project",
    "content": [
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "image",
            "mediaUrl": "logo_small_fluid_vertical.png",
            "alternativeText": "Fluid",
            "description": "The Fluid Project logo"
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
    "published": false
};

var testStoryModelPostPublish = fluid.extend({}, testStoryModelPrePublish, {"published": true});

// a story with no content
var blankStory = {
    "id": "blankStory-ID",
    "title": "",
    "content": [],
    "author": "",
    "tags": [
        ""
    ],
    "published": true
};

// an unpublished story with no content
var unpublishedStory = fluid.extend({}, testStoryModelPrePublish, {
    "id": "unpublishedStory-ID",
    "published": false
});

// a story consisting only of empty blocks
var blankStoryWithEmptyMediaBlocks = {
    "id": "blankStoryWithEmptyMediaBlocks-ID",
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
            "mediaUrl": null,
            "alternativeText": null,
            "description": null
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "mediaUrl": null,
            "alternativeText": null,
            "description": null,
            "blockType": "audio"
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "mediaUrl": null,
            "alternativeText": null,
            "description": null,
            "blockType": "video"
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
    "id": "testStoryWithImages-ID",
    "title": "A story to test image rotation",
    "content": [
        {
            "blockType": "image",
            "mediaUrl": "incorrectOrientation.jpeg",
            "description": "A photo of a cup that starts out with incorrect orientation"
        },
        {
            "blockType": "image",
            "mediaUrl": "correctOrientation.jpg",
            "description": "A photo of a virtual room that has the correct orientation already"
        }
    ],
    "author": "Gregor Moss",
    "published": true
};

// TODO: Generalize story testing so that components (such as request
// for retrieving saved story) and test sequences can be reused across
// different story configurations. And use these generalized pieces to
// test more story configurations.

fluid.registerNamespace("sjrk.tests.storyTelling.server.storage.mockRecords");

sjrk.tests.storyTelling.server.storage.insertIntoArray = function (toUpdate, index, toInsert) {
    var start = toUpdate.slice(0, index);
    var end = toUpdate.slice(index);
    return start.concat(fluid.makeArray(toInsert), end);
};

sjrk.tests.storyTelling.server.storage.IMAGE_ORIENTATION_TOP_LEFT = 1;
sjrk.tests.storyTelling.server.storage.verifyImageOrientation = function (filePath, expectedOrientation) {
    var actualOrientation = exif.parseSync(filePath).Orientation;
    jqUnit.assertEquals("Image orientation is as expected for image " + filePath, expectedOrientation, actualOrientation);
};

sjrk.tests.storyTelling.server.storage.mockRecords.docs = {
    "publishedStory": {
        "type": "story",
        "authorID": "author-abcd-123",
        "value": {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "author": "IDRC",
            "tags": [],
            "content": []
        }
    },
    "unpublishedStory": {
        "type": "story",
        "authorID": "author-abcd-123",
        "value": {
            "published": false,
            "id": "unpublishedStory",
            "title": "Sample Unpublished Story",
            "author": "IDRC",
            "tags": [],
            "content": []
        }
    },
    "publishedGuestStory": {
        "type": "story",
        "value": {
            "published": true,
            "id": "publishedGuestStory",
            "title": "Sample Guest Story",
            "author": "Guest",
            "tags": [],
            "content": []
        }
    },
    "unpublishedGuestStory": {
        "type": "story",
        "value": {
            "published": false,
            "id": "unpublishedGuestStory",
            "title": "Sample Unpublished Guest Story",
            "author": "Guest",
            "tags": [],
            "content": []
        }
    }
};

// Base configuration for storage test defs. Should be mixed in with concrete test defs.
fluid.defaults("sjrk.tests.storyTelling.server.storage.testDef.base", {
    port: 8082,
    events: {
        // Create/refresh kettle request components
        "refreshRequests": null
    },
    listeners: {
        "onCreate.refreshRequests": "{that}.events.refreshRequests"
    },
    members: {
        savedStories: [],
        savedFiles: [],
        saveFileFormData: {}
    },
    testOpts: {
        uploadDirectory: "./tests/server/uploads/"
    },
    components: {
        testDB: {
            type: "sjrk.test.storyTelling.server.mockDatabase",
            options: {
                components: {
                    storiesDBConfig: {
                        options: {
                            dbDocuments: sjrk.tests.storyTelling.server.storage.mockRecords.docs
                        }
                    }
                }
            }
        },
        saveStory: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/stories",
                method: "POST",
                listeners: {
                    "onComplete.saveStory": {
                        "this": "{sjrk.tests.storyTelling.server.storage.testDef.base}.savedStories",
                        method: "push",
                        args: {
                            expander: {
                                funcName: "JSON.parse",
                                args: ["{arguments}.0"]
                            }
                        },
                        priority: "first"
                    }
                }
            }
        },
        getStory: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/stories/%id"
            }
        },
        getStoryForEdit: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/stories/%id/edit"
            }
        },
        saveFile: {
            type: "kettle.test.request.formData",
            createOnEvent: "refreshRequests",
            options: {
                path: "/stories/%id",
                method: "POST",
                storeCookies: true,
                formData: "{sjrk.tests.storyTelling.server.storage.testDef.base}.saveFileFormData",
                listeners: {
                    "onComplete.trackUploadedFiles": {
                        "this": "{sjrk.tests.storyTelling.server.storage.testDef.base}.savedFiles",
                        method: "push",
                        args: ["{arguments}.0"],
                        priority: "first"
                    }
                }
            }
        },
        getFile: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/%filePath"
            }
        }
    },
    distributeOptions: {
        "server.port": {
            source: "{that}.options.port",
            target: "{that server}.options.port"
        },
        "request.port": {
            source: "{that}.options.port",
            target: "{that kettle.test.request.http}.options.port"
        }
    }
});

// Base configuration for storage test defs with authentication. Should be mixed in with concrete test defs.
fluid.defaults("sjrk.tests.storyTelling.server.storage.testDef.authentication", {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    testOpts: {
        signup: {
            author1: {
                credentials: {
                    email: "test@example.com",
                    password: "test-pass",
                    confirm: "test-pass"

                },
                response: {
                    email: "test@example.com"
                }
            },
            author2: {
                credentials: {
                    email: "other@example.com",
                    password: "other-pass",
                    confirm: "other-pass"

                },
                response: {
                    email: "other@example.com"
                }
            }
        },
        logoutResponse: "logout successful"
    },
    components: {
        logout: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/logout",
                method: "POST"
            }
        },
        signup: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/signup",
                method: "POST"
            }
        }
    }
});

sjrk.tests.storyTelling.server.storage.testDef.saveStory = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    name: "Save story - guest",
    expect: 14,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        storyWithId: {
            "id": "test-ID",
            "title": "",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        storyWithoutId: {
            "title": "",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        updatedStory: {
            "id": "test-ID",
            "title": "updated",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        storyWithIdSaveResponse: {
            "ok": true,
            "id": "test-ID"
        },
        storyWithoutIdSaveResponse: {
            "ok": true
        }
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // save story with storyId
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.storyWithId"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save story with storyId",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithIdSaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // save story without storyId
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.storyWithoutId"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save story without storyId",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithoutIdSaveResponse",
            filter: ["id", "rev"],
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // save empty story
        func: "{saveStory}.send"
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save empty story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithoutIdSaveResponse",
            filter: ["id", "rev"],
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // update existing story
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.updatedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt to update existing story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 403
        }]
    }]
};

sjrk.tests.storyTelling.server.storage.testDef.saveStoryAuthenticated = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.authentication"],
    name: "Save story - authenticated",
    expect: 25,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        storyWithId: {
            "id": "test-ID",
            "title": "",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        storyWithoutId: {
            "title": "",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        updatedStory: {
            "id": "test-ID",
            "title": "updated",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        attemptedUpdateStory: {
            "id": "test-ID",
            "title": "attempt to update",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        storyWithIdSaveResponse: {
            "ok": true,
            "id": "test-ID"
        },
        storyWithoutIdSaveResponse: {
            "ok": true
        }
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author1.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author1.response"
        }]
    },
    {
        // save story with storyId
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.storyWithId"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save story with storyId",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithIdSaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // save story without storyId
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.storyWithoutId"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save story without storyId",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithoutIdSaveResponse",
            filter: ["id", "rev"],
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // save empty story
        func: "{saveStory}.send"
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save empty story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithoutIdSaveResponse",
            filter: ["id", "rev"],
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // update existing story
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.updatedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "update existing story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.storyWithIdSaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // setup: logout
        func: "{logout}.send"
    },
    {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: [{
            plainText: true,
            message: "logout",
            request: "{logout}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.logoutResponse"
        }]
    },
    {
        // attempt to update existing story after logout
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.attemptedUpdateStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt to update existing story after logout",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 403
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author2.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login with other account",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author2.response"
        }]
    },
    {
        // attempt to update existing story with other account
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.attemptedUpdateStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt to update existing story with other account",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 403
        }]
    }]
};

fluid.defaults("sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory", {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    expect: 17,
    members: {
        saveFileFormData: {
            files: {
                "file": "{that}.options.testOpts.files.imagePNG"
            }
        }
    },
    testOpts: {
        files: {
            imagePNG: "./tests/testData/logo_small_fluid_vertical.png",
            imageJPG: "./tests/testData/obliterationroom.jpg"
        },
        fileHeaders: {
            imagePNG: {
                "content-type": "image/png",
                "content-length": "3719"
            },
            imageJPG: {
                "content-type": "image/jpeg",
                "content-length": "1583244"
            }
        },
        story: {
            "id": "test-story",
            "title": "",
            "content": [],
            "author": "",
            "tags": [],
            "published": true
        },
        saveStoryResponse: {
            "ok": true,
            "id": "test-story"
        }
    }
});

// Not included in the `sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory` grade because the
// grade merging happens after the sequence is required by `kettle.test.bootstrapServer`. The squence needs to be
// manually added to testDef directly.
sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.sequence = [{
    // setup: clear test uploads directory
    func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
    args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
},
{
    // setup: wait for database to initialize
    event: "{testDB}.events.onReady",
    listener: "jqUnit.assert",
    args: ["The database is initialized"]
},
{
    // setup: save story
    func: "{saveStory}.send",
    args: ["{that}.options.testOpts.story"]
},
{
    event: "{saveStory}.events.onComplete",
    listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
    args: [{
        message: "save story",
        request: "{saveStory}",
        string: "{arguments}.0",
        statusCode: 200,
        expected: "{that}.options.testOpts.saveStoryResponse",
        filter: "rev",
        checkFiltered: true
    }]
},
{
    // save image to story
    func: "{saveFile}.send",
    args: [undefined, {
        termMap: {id: "{that}.options.testOpts.story.id"}
    }]
},
{
    event: "{saveFile}.events.onComplete",
    listener: "kettle.test.assertResponse",
    args: [{
        message: "save file to story",
        request: "{saveFile}",
        string: "{arguments}.0",
        statusCode: 200,
        expectedSubstring: "{that}.options.testOpts.uploadDirectory",
        plainText: true
    }]
},
{
    // get image saved to story
    func: "{getFile}.send",
    args: [undefined, {
        termMap: {filePath: "{that}.savedFiles.0"}
    }]
},
{
    event: "{getFile}.events.onComplete",
    listener: "sjrk.storyTelling.server.assertBinaryResponse",
    args: [{
        message: "get file saved to story",
        request: "{getFile}",
        string: "{arguments}.0",
        statusCode: 200,
        expectedHeaders: "{that}.options.testOpts.fileHeaders.imagePNG"
    }]
},
{
    // setup: set new formData
    func: "fluid.set",
    args: [
        "{that}",
        "saveFileFormData",
        {
            files: {
                "file": "{that}.options.testOpts.files.imageJPG"
            },
            fields: {
                previousFileUrl: "{that}.savedFiles.0"
            }
        }
    ]
},
{
    // setup: reset request components
    func: "{that}.events.refreshRequests.fire"
},
{
    // save new image to story
    func: "{saveFile}.send",
    args: [undefined, {
        termMap: {id: "{that}.options.testOpts.story.id"}
    }]
},
{
    event: "{saveFile}.events.onComplete",
    listener: "kettle.test.assertResponse",
    args: [{
        message: "save new file to story",
        request: "{saveFile}",
        string: "{arguments}.0",
        statusCode: 200,
        expectedSubstring: "{that}.options.testOpts.uploadDirectory",
        plainText: true
    }]
},
{
    // get new image saved to story
    func: "{getFile}.send",
    args: [undefined, {
        termMap: {filePath: "{that}.savedFiles.1"}
    }]
},
{
    event: "{getFile}.events.onComplete",
    listener: "sjrk.storyTelling.server.assertBinaryResponse",
    args: [{
        message: "get new file saved to story",
        request: "{getFile}",
        string: "{arguments}.0",
        statusCode: 200,
        expectedHeaders: "{that}.options.testOpts.fileHeaders.imageJPG"
    }]
},
{
    // cleanup: reset request components
    func: "{that}.events.refreshRequests.fire"
},
{
    // get original image saved to story
    func: "{getFile}.send",
    args: [undefined, {
        termMap: {filePath: "{that}.savedFiles.0"}
    }]
},
{
    event: "{getFile}.events.onComplete",
    listener: "sjrk.storyTelling.server.assertBinaryResponse",
    args: [{
        message: "get original file saved to story",
        request: "{getFile}",
        string: "{arguments}.0",
        statusCode: 200,
        expectedHeaders: "{that}.options.testOpts.fileHeaders.imagePNG"
    }]
},
{
    // cleanup: clear test uploads directory
    func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
    args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
}];

// Inject the authentication step into the sequence
sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.authenticatedSequence = sjrk.tests.storyTelling.server.storage.insertIntoArray(
    sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.sequence,
    2,
    [{
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author1.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author1.response"
        }]
    }]
);

sjrk.tests.storyTelling.server.storage.testDef.saveFileToUnpublished = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory"],
    name: "Save file to unpublished story - guest author",
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        story: {
            "published": false
        }
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.sequence
};

sjrk.tests.storyTelling.server.storage.testDef.saveFileToPublished = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory"],
    name: "Save file to published story - guest author",
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.sequence
};

sjrk.tests.storyTelling.server.storage.testDef.saveFileToUnpublishedAuthenticated = {
    gradeNames: [
        "sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory",
        "sjrk.tests.storyTelling.server.storage.testDef.authentication"
    ],
    name: "Save file to unpublished story - authenticated author",
    expect: 19,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        story: {
            "published": false
        }
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.authenticatedSequence
};

sjrk.tests.storyTelling.server.storage.testDef.saveFileToPublishedAuthenticated = {
    gradeNames: [
        "sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory",
        "sjrk.tests.storyTelling.server.storage.testDef.authentication"
    ],
    name: "Save file to published story - authenticated author",
    expect: 19,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory.authenticatedSequence
};


sjrk.tests.storyTelling.server.storage.testDef.rotateSavedImage = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.saveFileToStory"],
    name: "Save file to published story - guest author",
    expect: 9,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    members: {
        saveFileFormData: {
            files: {
                "file": "{that}.options.testOpts.files.imageIncorrectOrientation"
            }
        }
    },
    testOpts: {
        files: {
            imageIncorrectOrientation: "./tests/testData/incorrectOrientation.jpeg"
        },
        filesHeaders: {
            imageIncorrectOrientation: {
                "content-type": "image/jpeg",
                "content-length": "1583244"
            }
        }
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // setup: save story
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.story"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.saveStoryResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // save image to story
        func: "{saveFile}.send",
        args: [undefined, {
            termMap: {id: "{that}.options.testOpts.story.id"}
        }]
    },
    {
        event: "{saveFile}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: [{
            message: "save file to story",
            request: "{saveFile}",
            string: "{arguments}.0",
            statusCode: 200,
            expectedSubstring: "{that}.options.testOpts.uploadDirectory",
            plainText: true
        }]
    },
    {
        // get image saved to story
        func: "{getFile}.send",
        args: [undefined, {
            termMap: {filePath: "{that}.savedFiles.0"}
        }]
    },
    {
        event: "{getFile}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertBinaryResponse",
        args: [{
            message: "get file saved to story",
            request: "{getFile}",
            string: "{arguments}.0",
            statusCode: 200,
            expectedHeaders: "{that}.options.testOpts.fileHeaders.imageIncorrectOrientation"
        }]
    },
    {
        // verify that the image is rotated correctly
        funcName: "sjrk.tests.storyTelling.server.storage.verifyImageOrientation",
        args: [
            "{that}.savedFiles.0",
            sjrk.tests.storyTelling.server.storage.IMAGE_ORIENTATION_TOP_LEFT
        ]
    },
    {
        // cleanup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    }]
};

sjrk.tests.storyTelling.server.storage.testDef.getStories_view = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    name: "Get stories to View - Guest",
    expect: 16,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        publishedStoryResponse: {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "tags": [],
            "content": []
        },
        publishedGuestStoryResponse: {
            "published": true,
            "id": "publishedGuestStory",
            "title": "Sample Guest Story",
            "tags": [],
            "content": []
        },
        noAccessErrorMsg: "An error occurred while retrieving the requested story"
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // get (view story) published story by authenticated author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "publishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "get (view story) published story by authenticated author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.publishedStoryResponse",
            filter: "_rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) unpublished story by authenticated author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "unpublishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by authenticated author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (view story) published story by guest author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "publishedGuestStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "get (view story) published story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.publishedGuestStoryResponse",
            filter: "_rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) unpublished story by guest author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "unpublishedGuestStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) missing story
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "missing-story"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    }]
};

sjrk.tests.storyTelling.server.storage.testDef.getStories_authenticated_view = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.authentication"],
    name: "Get stories to View - Authenticated",
    expect: 30,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        ownPublishedStory: {
            "published": true,
            "id": "ownPublishedStory",
            "title": "My published story",
            "author": "IDRC",
            "tags": [
                "Test",
                "Example"
            ],
            "content": [{
                "heading": "Add Content Blocks",
                "blockType": "text",
                "text": "The Story Builder is designed based on building blocks."
            }]
        },
        ownPublishedStorySaveResponse: {
            "ok": true,
            "id": "ownPublishedStory"
        },
        ownPublishedStoryResponse: {
            "published": true,
            "id": "ownPublishedStory",
            "title": "My published story",
            "tags": [
                "Test",
                "Example"
            ],
            "content": [{
                "heading": "Add Content Blocks",
                "blockType": "text",
                "text": "The Story Builder is designed based on building blocks."
            }]
        },
        ownUnpublishedStory: {
            "published": false,
            "id": "ownUnpublishedStory",
            "title": "My unpublished story",
            "content": [{
                "heading": "Navigating through Content Blocks",
                "blockType": "text",
                "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block."
            }],
            "author": "Fluid",
            "tags": [
                "Example"
            ]
        },
        ownUnpublishedStorySaveResponse: {
            "ok": true,
            "id": "ownUnpublishedStory"
        },
        ownUnpublishedStoryResponse: {
            "published": false,
            "id": "ownUnpublishedStory",
            "title": "My unpublished story",
            "content": [{
                "heading": "Navigating through Content Blocks",
                "blockType": "text",
                "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block."
            }],
            "tags": [
                "Example"
            ]
        },
        publishedStoryResponse: {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "tags": [],
            "content": []
        },
        publishedGuestStoryResponse: {
            "published": true,
            "id": "publishedGuestStory",
            "title": "Sample Guest Story",
            "tags": [],
            "content": []
        },
        noAccessErrorMsg: "An error occurred while retrieving the requested story"
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author1.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author1.response"
        }]
    },
    {
        // setup: save published story with authenticated user
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.ownPublishedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save published story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownPublishedStorySaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // setup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // setup: save unpublished story with authenticated user
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.ownUnpublishedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save unpublished story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownUnpublishedStorySaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // setup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (view story) own published story
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "ownPublishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "get (view story) own published story",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownPublishedStoryResponse",
            filter: "_rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) own unpublished story
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "ownUnpublishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) own unpublished story",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (view story) published story by other authenticated author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "publishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "get (view story) published story by other authenticated author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.publishedStoryResponse",
            filter: "_rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) unpublished story by other authenticated author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "unpublishedStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by other authenticated author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (view story) published story by guest author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "publishedGuestStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "get (view story) published story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.publishedGuestStoryResponse",
            filter: "_rev",
            checkFiltered: true
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) unpublished story by guest author
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "unpublishedGuestStory"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (view story) missing story
        func: "{getStory}.send",
        args: [undefined, {
            termMap: {id: "missing-story"}
        }]
    },
    {
        event: "{getStory}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (view story) unpublished story by guest author",
            request: "{getStory}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    }]
};

sjrk.tests.storyTelling.server.storage.testDef.getStories_edit = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    name: "Get stories to Edit - Guest",
    expect: 16,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        publishedStoryResponse: {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "tags": [],
            "content": []
        },
        publishedGuestStoryResponse: {
            "published": true,
            "id": "publishedGuestStory",
            "title": "Sample Guest Story",
            "tags": [],
            "content": []
        },
        unpublishedGuestStoryResponse: {
            "published": false,
            "id": "unpublishedGuestStory",
            "title": "Sample Unpublished Guest Story",
            "author": "Guest",
            "tags": [],
            "content": []
        },
        noAccessErrorMsg: "An error occurred while retrieving the requested story"
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // attempt get (edit story) published story by authenticated author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "publishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) published story by authenticated author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) unpublished story by authenticated author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "unpublishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by authenticated author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) published story by guest author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "publishedGuestStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) published story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) unpublished story by guest author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "unpublishedGuestStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) missing story
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "missing-story"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    }]
};

sjrk.tests.storyTelling.server.storage.testDef.getStoriesAuthenticated_edit = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.authentication"],
    name: "Get stories to Edit - Authenticated",
    expect: 28,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        ownPublishedStory: {
            "published": true,
            "id": "ownPublishedStory",
            "title": "My published story",
            "author": "IDRC",
            "tags": [
                "Test",
                "Example"
            ],
            "content": [{
                "heading": "Add Content Blocks",
                "blockType": "text",
                "text": "The Story Builder is designed based on building blocks."
            }]
        },
        ownPublishedStorySaveResponse: {
            "ok": true,
            "id": "ownPublishedStory"
        },
        ownPublishedStoryResponse: {
            "published": true,
            "id": "ownPublishedStory",
            "title": "My published story",
            "author": "IDRC",
            "tags": [
                "Test",
                "Example"
            ],
            "content": [{
                "heading": "Add Content Blocks",
                "blockType": "text",
                "text": "The Story Builder is designed based on building blocks."
            }]
        },
        ownUnpublishedStory: {
            "published": false,
            "id": "ownUnpublishedStory",
            "title": "My unpublished story",
            "content": [{
                "heading": "Navigating through Content Blocks",
                "blockType": "text",
                "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block."
            }],
            "author": "Fluid",
            "tags": [
                "Example"
            ]
        },
        ownUnpublishedStorySaveResponse: {
            "ok": true,
            "id": "ownUnpublishedStory"
        },
        ownUnpublishedStoryResponse: {
            "published": false,
            "id": "ownUnpublishedStory",
            "title": "My unpublished story",
            "author": "Fluid",
            "content": [{
                "heading": "Navigating through Content Blocks",
                "blockType": "text",
                "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block."
            }],
            "tags": [
                "Example"
            ]
        },
        publishedStoryResponse: {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "tags": [],
            "content": []
        },
        publishedGuestStoryResponse: {
            "published": true,
            "id": "publishedGuestStory",
            "title": "Sample Guest Story",
            "tags": [],
            "content": []
        },
        unpublishedGuestStoryResponse: {
            "published": false,
            "id": "unpublishedGuestStory",
            "title": "Sample Unpublished Guest Story",
            "author": "Guest",
            "tags": [],
            "content": []
        },
        noAccessErrorMsg: "An error occurred while retrieving the requested story"
    },
    sequence: [{
        // setup: clear test uploads directory
        func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
        args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
    },
    {
        // setup: wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    },
    {
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author1.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author1.response"
        }]
    },
    {
        // setup: save published story with authenticated user
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.ownPublishedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save published story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownPublishedStorySaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // setup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // setup: save unpublished story with authenticated user
        func: "{saveStory}.send",
        args: ["{that}.options.testOpts.ownUnpublishedStory"]
    },
    {
        event: "{saveStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
        args: [{
            message: "save unpublished story",
            request: "{saveStory}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownUnpublishedStorySaveResponse",
            filter: "rev",
            checkFiltered: true
        }]
    },
    {
        // setup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (edit story) own published story
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "ownPublishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "get (edit story) own published story",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownPublishedStoryResponse"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // get (edit story) own unpublished story
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "ownUnpublishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "get (edit story) own unpublished story",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.ownUnpublishedStoryResponse"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) published story by other authenticated author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "publishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) published story by other authenticated author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) unpublished story by other authenticated author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "unpublishedStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by other authenticated author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) published story by guest author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "publishedGuestStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) published story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) unpublished story by guest author
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "unpublishedGuestStory"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    },
    {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    },
    {
        // attempt get (edit story) missing story
        func: "{getStoryForEdit}.send",
        args: [undefined, {
            termMap: {id: "missing-story"}
        }]
    },
    {
        event: "{getStoryForEdit}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: [{
            message: "attempt get (edit story) unpublished story by guest author",
            request: "{getStoryForEdit}",
            string: "{arguments}.0",
            statusCode: 404,
            errorTexts: "{that}.options.testOpts.noAccessErrorMsg"
        }]
    }]
};

fluid.defaults("sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled", {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.base"],
    members: {
        saveFileFormData: {
            files: {
                "file": "{that}.options.testOpts.files.imagePNG"
            }
        }
    },
    testOpts: {
        files: {
            imagePNG: "./tests/testData/logo_small_fluid_vertical.png"
        },
        storyToSave: {
            "id": "test-ID",
            "title": "",
            "content": [],
            "author": "",
            "tags": [
                ""
            ],
            "published": true
        },
        saveErrorResponse: "Saving is currently disabled.",
        editErrorResponse: "Editing is currently disabled.",
        publishedStoryResponse: {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story",
            "tags": [],
            "content": []
        }
    }
});

sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled.sequence = [{
    // setup: clear test uploads directory
    func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
    args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
},
{
    // setup: wait for database to initialize
    event: "{testDB}.events.onReady",
    listener: "jqUnit.assert",
    args: ["The database is initialized"]
},
{
    // attempt to save story
    func: "{saveStory}.send",
    args: ["{that}.options.testOpts.storyToSave"]
},
{
    event: "{saveStory}.events.onComplete",
    listener: "kettle.test.assertErrorResponse",
    args: [{
        message: "attempt to save story when authoring disabled",
        request: "{saveStory}",
        string: "{arguments}.0",
        statusCode: 403,
        errorTexts: "{that}.options.testOpts.saveErrorResponse"
    }]
},
{
    // attempt to save image to story
    func: "{saveFile}.send",
    args: [undefined, {
        termMap: {id: "publishedStory"}
    }]
},
{
    event: "{saveFile}.events.onComplete",
    listener: "kettle.test.assertErrorResponse",
    args: [{
        message: "attempt to save file when authoring disabled",
        request: "{saveFile}",
        string: "{arguments}.0",
        statusCode: 403,
        errorTexts: "{that}.options.testOpts.saveErrorResponse"
    }]
},
{
    // attempt to get (view story) published story
    func: "{getStory}.send",
    args: [undefined, {
        termMap: {id: "publishedStory"}
    }]
},
{
    event: "{getStory}.events.onComplete",
    listener: "sjrk.storyTelling.server.assertFilteredJSONResponse",
    args: [{
        message: "attempt to get (view story) published story when authoring disabled",
        request: "{getStory}",
        string: "{arguments}.0",
        statusCode: 200,
        expected: "{that}.options.testOpts.publishedStoryResponse",
        filter: "_rev",
        checkFiltered: true
    }]
},
{
    // attempt to get (edit story) published story
    func: "{getStoryForEdit}.send",
    args: [undefined, {
        termMap: {id: "publishedStory"}
    }]
},
{
    event: "{getStoryForEdit}.events.onComplete",
    listener: "kettle.test.assertErrorResponse",
    args: [{
        message: "attempt to get (edit story) published story when authoring disabled",
        request: "{getStoryForEdit}",
        string: "{arguments}.0",
        statusCode: 403,
        errorTexts: "{that}.options.testOpts.editErrorResponse"
    }]
},
{
    // cleanup: clear test uploads directory
    func: "sjrk.storyTelling.server.cleanTestUploadsDirectory",
    args: ["{testCaseHolder}.options.testOpts.uploadDirectory"]
}];

// Inject the authentication step into the sequence
sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled.authenticatedSequence = sjrk.tests.storyTelling.server.storage.insertIntoArray(
    sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled.sequence,
    2,
    [{
        // setup: authenticate
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup.author1.credentials"]
    },
    {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: [{
            message: "login",
            request: "{signup}",
            string: "{arguments}.0",
            statusCode: 200,
            expected: "{that}.options.testOpts.signup.author1.response"
        }]
    }]
);

sjrk.tests.storyTelling.server.storage.testDef.authoringDisabledGuest = {
    gradeNames: ["sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled"],
    name: "Authoring Disabled - Guest",
    expect: 13,
    config: {
        configName: "sjrk.storyTelling.server.testAuthoringDisabled",
        configPath: "./tests/server/configs"
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled.sequence
};

sjrk.tests.storyTelling.server.storage.testDef.authoringDisabledAuthenticated = {
    gradeNames: [
        "sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled",
        "sjrk.tests.storyTelling.server.storage.testDef.authentication"
    ],
    name: "Authoring Disabled - Authenticated",
    expect: 15,
    config: {
        configName: "sjrk.storyTelling.server.testAuthoringDisabled",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        signup: {
            author1: {
                credentials: {
                    email: "test@example.com",
                    password: "test-pass",
                    confirm: "test-pass"

                },
                response: {
                    email: "test@example.com"
                }
            }
        }
    },
    sequence: sjrk.tests.storyTelling.server.storage.testDef.authoringDisabled.authenticatedSequence
};

/*
    Other tests
    - review that there are no tests that were in the original file that are no longer covered here.

*/

// starts up the test server based on the provided definitions
kettle.test.bootstrapServer([
    sjrk.tests.storyTelling.server.storage.testDef.saveStory,
    sjrk.tests.storyTelling.server.storage.testDef.saveStoryAuthenticated,
    sjrk.tests.storyTelling.server.storage.testDef.saveFileToUnpublished,
    sjrk.tests.storyTelling.server.storage.testDef.saveFileToPublished,
    sjrk.tests.storyTelling.server.storage.testDef.saveFileToUnpublishedAuthenticated,
    sjrk.tests.storyTelling.server.storage.testDef.saveFileToPublishedAuthenticated,
    sjrk.tests.storyTelling.server.storage.testDef.rotateSavedImage,
    sjrk.tests.storyTelling.server.storage.testDef.getStories_view,
    sjrk.tests.storyTelling.server.storage.testDef.getStories_authenticated_view,
    sjrk.tests.storyTelling.server.storage.testDef.getStories_edit,
    sjrk.tests.storyTelling.server.storage.testDef.getStoriesAuthenticated_edit,
    sjrk.tests.storyTelling.server.storage.testDef.authoringDisabledGuest,
    sjrk.tests.storyTelling.server.storage.testDef.authoringDisabledAuthenticated
]);
