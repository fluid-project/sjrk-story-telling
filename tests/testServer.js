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
require("../src/js/middleware/basicAuth");
require("../src/js/middleware/saveStoryWithBinaries");
require("../src/js/middleware/staticMiddlewareSubdirectoryFilter");
require("../src/js/dataSource");
require("../src/js/serverSetup");
require("../src/js/requestHandlers");
require("../src/js/serverSetup");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

sjrk.storyTelling.server.testServerDefs = [{
    name: "Basic server tests",
    expect: 2,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/configs"
    },
    components: {
        validNodeModulesRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/node_modules/sjrk-story-telling/src/js/dynamicViewComponentManager.js",
                method: "GET"
            }
        },
        invalidNodeModulesRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/node_modules/nano/lib/nano.js",
                method: "GET"
            }
        }
    },
    sequence: [{
        func: "{validNodeModulesRequest}.send"
    }, {
        event: "{validNodeModulesRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerDefs.testGetRequestSuccessful"
    }, {
        func: "{invalidNodeModulesRequest}.send"
    }, {
        event: "{invalidNodeModulesRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerDefs.testGetRequestFailed"
    }]
}];

sjrk.storyTelling.server.testServerDefs.testGetRequestSuccessful = function (data, that) {
    jqUnit.assertEquals("Successful GET request for allowed subdirectory of node_modules", 200, that.nativeResponse.statusCode);
};

sjrk.storyTelling.server.testServerDefs.testGetRequestFailed = function (data, that) {
    jqUnit.assertEquals("Failed GET request for unallowed subdirectory of node_modules", 404, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerDefs);
