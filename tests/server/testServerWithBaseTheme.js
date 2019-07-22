/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

require("../../src/server/staticHandlerBase");
require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryWithBinaries");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/requestHandlers");
require("./utils/serverTestUtils.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

sjrk.storyTelling.server.testServerWithBaseThemeDefs = [{
    name: "Base theme server tests",
    expect: 10,
    config: {
        configName: "sjrk.storyTelling.server.testServerWithBaseTheme",
        configPath: "./tests/server/configs"
    },
    components: {
        clientConfigRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/clientConfig",
                method: "GET"
            }
        },
        baseThemeFileBothExistRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/testFile.txt",
                method: "GET"
            }
        },
        baseThemeFileBaseOnlyRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/testBaseFile.txt",
                method: "GET"
            }
        },
        baseThemeFileCustomOnlyRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/testCustomFile.txt",
                method: "GET"
            }
        },
        baseThemeFileMissingRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/notARealFile.txt",
                method: "GET"
            }
        }
    },
    sequence: [{
        // test the clientConfig info endpoint
        func: "{clientConfigRequest}.send"
    }, {
        event: "{clientConfigRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetClientConfigSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "base"]
    }, {
        // test getting a file that exists for both base and custom theme, with no custom theme specified
        func: "{baseThemeFileBothExistRequest}.send"
    }, {
        event: "{baseThemeFileBothExistRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetThemeFileSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "This is the base test file"]
    }, {
        // test getting a file that exists only for base theme, with no custom theme specified
        func: "{baseThemeFileBaseOnlyRequest}.send"
    }, {
        event: "{baseThemeFileBaseOnlyRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetThemeFileSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "Test file that isn't in the custom theme"]
    }, {
        // test getting a file that exists only for custom theme, with no custom theme specified
        func: "{baseThemeFileCustomOnlyRequest}.send"
    }, {
        event: "{baseThemeFileCustomOnlyRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetThemeFileUnsuccessful",
        args: ["{arguments}.0", "{arguments}.1"]
    }, {
        // test getting a file that exists only for custom theme, with no custom theme specified
        func: "{baseThemeFileMissingRequest}.send"
    }, {
        event: "{baseThemeFileMissingRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetThemeFileUnsuccessful",
        args: ["{arguments}.0", "{arguments}.1"]
    }]
}];

kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithBaseThemeDefs);
