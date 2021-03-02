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
    jqUnit = fluid.registerNamespace("jqUnit");

require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/authRequestHandlers");
require("../../src/server/staticRequestHandlers");
require("../../src/server/storyRequestHandlers");
require("../../src/server/validators");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

// basic test server definitions
sjrk.storyTelling.server.testServerDefs = {
    name: "Basic server tests",
    expect: 3,
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
        },
        staticFileRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/robots.txt",
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
    }, {
        func: "{staticFileRequest}.send"
    }, {
        event: "{staticFileRequest}.events.onComplete",
        listener: "sjrk.storyTelling.server.testServerDefs.verifyGetRequestSuccessful"
    }]
};

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

// test usage and distribution of configuration sourced from the secrets file
sjrk.storyTelling.server.testServerSecretsDefs = {
    name: "Basic server tests - Secrets",
    expect: 8,
    port: 8082,
    config: {
        configName: "sjrk.storyTelling.server.testSecrets",
        configPath: "./tests/server/configs"
    },
    testOpts: {
        expectedSecrets: {
            "adminPass": "test-password",
            "session": "test-session-secret",
            "authorCredentialConfig": {
                "digest": "sha256",
                "keyLength": 10,
                "iterations": 10
            },
            "https": {
                "cert": "./server-cert.pem",
                "key": "./server-key.pem"
            }
        }
    },
    distributeOptions: {
        "server.port": {
            source: "{that}.options.port",
            target: "{that server}.options.port"
        }
    },
    sequence: [{
        funcName: "jqUnit.assertDeepEq",
        args: [
            "The secrets.json file should be loaded into the secure config",
            "{that}.options.testOpts.expectedSecrets",
            "{server}.server.options.secureConfig.secrets"
        ]
    }, {
        funcName: "jqUnit.assertEquals",
        args: [
            "The session secret should have been set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.session",
            "{server}.server.options.session.middlewareOptions.secret"
        ]
    }, {
        funcName: "jqUnit.assertEquals",
        args: [
            "The basic auth password should have been set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.adminPass",
            "{server}.server.basicAuth.options.middlewareOptions.users.admin"
        ]
    }, {
        funcName: "jqUnit.assertDeepEq",
        args: [
            "The authorCredentialConfig should have been set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.authorCredentialConfig",
            "{server}.server.options.authorCredentialConfig"
        ]
    }, {
        funcName: "jqUnit.assertEquals",
        args: [
            "The expressUserUtils iterations options should be set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.authorCredentialConfig.iterations",
            "{server}.server.expressUserUtils.options.iterations"
        ]
    }, {
        funcName: "jqUnit.assertEquals",
        args: [
            "The expressUserUtils keyLength options should be set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.authorCredentialConfig.keyLength",
            "{server}.server.expressUserUtils.options.keyLength"
        ]
    }, {
        funcName: "jqUnit.assertEquals",
        args: [
            "The expressUserUtils digest options should be set from the secrets file",
            "{that}.options.testOpts.expectedSecrets.authorCredentialConfig.digest",
            "{server}.server.expressUserUtils.options.digest"
        ]
    }, {
        funcName: "jqUnit.assertValue",
        args: [
            "The httpsServerOptions options should be set",
            "{server}.server.options.httpsServerOptions"
        ]
    }]
};


// starts up the test server based on the provided definitions
kettle.test.bootstrapServer([
    sjrk.storyTelling.server.testServerDefs,
    sjrk.storyTelling.server.testServerSecretsDefs
]);
