/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit");

require("../src/js/staticHandlerBase");
require("../src/js/middleware/saveStoryWithBinaries");
require("../src/js/middleware/staticMiddlewareSubdirectoryFilter");
require("../src/js/dataSource");
require("../src/js/serverSetup");
require("../src/js/requestHandlers");
require("../src/js/serverSetup");
require("../src/js/db/dbConfiguration");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

require("gpii-pouchdb");

var testStoryModel = {
    "type": "story",
    "value": {
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
    }
};

sjrk.storyTelling.server.testServerWithStorageDefs = [{
    name: "Test server with storage",
    expect: 3,
    // Receives the ID of the saved story
    events: {
        "onStorySaveSuccessful": null
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
                path: "/binaries",
                method: "POST",
                formData: {
                    files: {
                        "file": ["./tests/binaries/logo_small_fluid_vertical.png"]
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
                path: "/story/%id",
                termMap: {
                    // We don't know this until the story is saved, so needs
                    // to be filled in at runtime
                    id: null
                }
            }
        }
    },
    // TODO: remove binary upload before test run
    // TODO: test for presence of uploaded binary
    sequence: [{
        event: "{testDB}.dbConfiguration.events.onSuccess",
        listener: "{that}.storySave.send"
    }, {
        event: "{storySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "{that}.events.onStorySaveSuccessful"]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedStory}"]
    }, {
        event: "{getSavedStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testGetSavedStory"
    }]
}];

sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful = function (data, request, completionEvent) {
    var parsedData = JSON.parse(data);
    jqUnit.assertTrue("Response OK is true", parsedData.ok);
    jqUnit.assertTrue("Response contains ID field", parsedData.id);
    completionEvent.fire(parsedData.id);
};

sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory = function (storyId, getSavedStoryRequest) {
    getSavedStoryRequest.send(null, {termMap: {id: storyId}});
};

sjrk.storyTelling.server.testServerWithStorageDefs.testGetSavedStory = function (data, request) {
    var parsedData = JSON.parse(data);
    jqUnit.assertDeepEq("Saved story data is as expected", testStoryModel, parsedData);
};

fluid.defaults("sjrk.storyTelling.server.testServerWithStorageDefs.testDB", {
    gradeNames: ["fluid.component"],
    components: {
        pouchHarness: {
            type: "gpii.pouch.harness",
            options: {
                port: 5984
            }
        },
        dbConfiguration: {
            type: "sjrk.storyTelling.server.storiesDb",
            createOnEvent: "{pouchHarness}.events.onReady",
        }
    }
});

kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithStorageDefs);
