/*
Copyright 2018-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit");

require("../server/src/js/staticHandlerBase");
require("../server/src/js/middleware/basicAuth");
require("../server/src/js/middleware/saveStoryWithBinaries");
require("../server/src/js/middleware/staticMiddlewareSubdirectoryFilter");
require("../server/src/js/dataSource");
require("../server/src/js/serverSetup");
require("../server/src/js/requestHandlers");
require("../server/src/js/serverSetup");

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
                path: "/node_modules/infusion/src/framework/preferences/js/Panels.js",
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
