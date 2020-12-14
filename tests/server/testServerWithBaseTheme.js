/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/authorsRequestHandlers");
require("../../src/server/staticRequestHandlers");
require("../../src/server/storyRequestHandlers");
require("../../src/server/validators");
require("./utils/serverTestUtils.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

// server definitions to test the base theme only configuration
sjrk.storyTelling.server.testServerWithBaseThemeDefs = [{
    name: "Base theme server tests",
    expect: 10,
    port: 8082,
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
    distributeOptions: {
        "server.port": {
            source: "{that}.options.port",
            target: "{that server}.options.port"
        },
        "request.port": {
            source: "{that}.options.port",
            target: "{that kettle.test.request.http}.options.port"
        }
    },
    sequence: [{
        // test the clientConfig info endpoint
        func: "{clientConfigRequest}.send"
    }, {
        event: "{clientConfigRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.verifyGetClientConfigSuccessful",
        args: ["{arguments}.0", "{arguments}.1", "mockBaseTheme"]
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

// starts up the test server based on the provided definitions
kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerWithBaseThemeDefs);
