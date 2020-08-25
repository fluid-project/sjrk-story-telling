/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

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
require("../../src/server/middleware/removePreviousStoryFile");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/requestHandlers");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

// basic test server definitions
sjrk.storyTelling.server.testServerDefs = [{
    name: "Basic server tests",
    expect: 2,
    port: 8082,
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
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
        func: "{validNodeModulesRequest}.send"
    }, {
        event: "{validNodeModulesRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerDefs.verifyGetRequestSuccessful"
    }, {
        func: "{invalidNodeModulesRequest}.send"
    }, {
        event: "{invalidNodeModulesRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerDefs.verifyGetRequestFailed"
    }]
}];

/**
 * Verifies that a GET request completed successfully
 *
 * @param {Object} data - the data returned by the call
 * @param {Object} that - the server response object
 */
sjrk.storyTelling.server.testServerDefs.verifyGetRequestSuccessful = function (data, that) {
    jqUnit.assertEquals("Successful GET request for allowed subdirectory of node_modules", 200, that.nativeResponse.statusCode);
};

/**
 * Verifies that a GET request completed unsuccessfully with a 404 error
 *
 * @param {Object} data - the data returned by the call
 * @param {Object} that - the server response object
 */
sjrk.storyTelling.server.testServerDefs.verifyGetRequestFailed = function (data, that) {
    jqUnit.assertEquals("Failed GET request for unallowed subdirectory of node_modules", 404, that.nativeResponse.statusCode);
};

// starts up the test server based on the provided definitions
kettle.test.bootstrapServer(sjrk.storyTelling.server.testServerDefs);
