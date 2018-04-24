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

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

// gpii-pouchdb
var gpii = fluid.registerNamespace("gpii");
require("gpii-pouchdb");

sjrk.storyTelling.server.testServerWithStorageDefs = [{
    name: "Test server with storage",
    expect: 1,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/configs"
    },
    components: {
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
    },
    sequence: [{
        func: "{that}.storySave.send"
    }, {
        event: "{that}.storySave.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful"
    }]
}];

sjrk.storyTelling.server.testServerWithStorageDefs.testStorySaveSuccessful = function (arg1, arg2) {    
    jqUnit.assert("Story save successful");
};

// Start PouchDB harness, then run the tests
gpii.pouch.harness({
    port: 5984,
    listeners: {
        // TODO: configure DB before starting tests
        "onReady.configureDB": {
            listener: "fluid.require",
            args: ["../src/js/dbSetup", require]
        },
        "onReady.startTests": {
            listener: "sjrk.storyTelling.server.testServerWithStorageDefs.startTests",
            priority: "last"
        }
    }
});

sjrk.storyTelling.server.testServerWithStorageDefs.startTests = function () {
    kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithStorageDefs);
};
