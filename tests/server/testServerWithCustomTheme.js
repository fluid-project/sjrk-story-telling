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

require("../../src/server/staticHandlerBase");
require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryWithBinaries");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/requestHandlers");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

sjrk.storyTelling.server.testServerWithCustomThemeDefs = [{
    name: "Custom theme server tests",
    expect: 1,
    config: {
        configName: "sjrk.storyTelling.server.testServerWithCustomTheme",
        configPath: "./tests/server/configs"
    },
    components: {
        clientConfigRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/clientConfig",
                method: "GET"
            }
        }
    },
    sequence: [{
        func: "{clientConfigRequest}.send"
    }, {
        event: "{clientConfigRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerWithCustomThemeDefs.testGetClientConfigSuccessful"
    }]
}];

sjrk.storyTelling.server.testServerWithCustomThemeDefs.testGetClientConfigSuccessful = function (data, that) {
    jqUnit.assertEquals("Successful GET request for clientConfig endpoint", 200, that.nativeResponse.statusCode);
};

kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithCustomThemeDefs);
