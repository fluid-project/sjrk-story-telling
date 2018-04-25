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

// gpii-pouchdb
var gpii = fluid.registerNamespace("gpii");
require("gpii-pouchdb");

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
                                // TODO: real story model
                                value: JSON.stringify({"ABC": "DEF"})
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
                    id: "%directStoryId"
                }
            }
        }
    },
    sequence: [{
        event: "{testDB}.dbConfiguration.events.onSuccess",
        listener: "{that}.storySave.send"
    }, {
        event: "{storySave}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful",
        args: ["{arguments}.0", "{that}.events.onStorySaveSuccessful"]
    }, {
        event: "{that}.events.onStorySaveSuccessful",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory",
        args: ["{arguments}.0", "{getSavedStory}"]
    }, {
        event: "{getSavedStory}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testGetSavedStory"
    }]
}];

sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful = function (response, completionEvent) {
    var parsedResponse = JSON.parse(response);
    jqUnit.assertTrue("Response OK is true", parsedResponse["ok"]);
    jqUnit.assertTrue("Response contains ID field", parsedResponse["id"]);
    completionEvent.fire(parsedResponse["id"]);
};

sjrk.storyTelling.server.testServerWithStorageDefs.getSavedStory = function (storyId, getSavedStoryRequest) {
    console.log("testGetSavedStory called for storyId: " + storyId);
    jqUnit.assert("testGetSavedStory called for storyId: " + storyId);
    // TODO: this doesn't seem to work for passing in the ID
    getSavedStoryRequest.send(null, {termMap: {directStoryId: storyId}});
};

sjrk.storyTelling.server.testServerWithStorageDefs.testGetSavedStory = function (response) {
    console.log(response);
}

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
