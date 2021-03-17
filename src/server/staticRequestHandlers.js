/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// A basic static HTTP Kettle request handler that will return a 404
fluid.defaults("sjrk.storyTelling.server.staticHandlerBase", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "kettle.request.notFoundHandler"
        }
    }
});


// Kettle request handler for getting Client Configuration data
fluid.defaults("sjrk.storyTelling.server.clientConfigHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.getClientConfig",
            args: ["{arguments}.0", "{server}.options.globalConfig", "{server}.options.secureConfig"]
        }
    }
});

/**
 * Returns a collection of values which are "safe" to share with the client side of the application
 *
 * @param {Object} request - a Kettle request for clientConfig
 * @param {Object} globalConfig - the "global config" entry list
 * @param {Object} secureConfig - the "secure config" entry list
 */
sjrk.storyTelling.server.getClientConfig = function (request, globalConfig, secureConfig) {
    request.events.onSuccess.fire({
        theme: globalConfig.theme || secureConfig.baseThemeName,
        baseTheme: secureConfig.baseThemeName,
        authoringEnabled: globalConfig.authoringEnabled
    });
};

// Kettle request handler for the ui directory
fluid.defaults("sjrk.storyTelling.server.uiHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.ui"
        }
    }
});

// Kettle request handler for the themes directory. It looks first in the custom
// theme directory before falling back to the base theme directory
fluid.defaults("sjrk.storyTelling.server.themeHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        // includes things like robots.txt and (in the future) favicon
        "staticFiles": {
            middleware: "{server}.static"
        },
        "baseTheme": {
            middleware: "{server}.baseTheme",
            priority: "before:staticFiles"
        },
        "currentTheme": {
            middleware: "{server}.currentTheme",
            priority: "before:baseTheme"
        }
    }
});

// Kettle request handler for the uploads directory
fluid.defaults("sjrk.storyTelling.server.uploadsHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "static": {
            middleware: "{server}.uploads"
        }
    }
});

// Kettle request handler for the node_modules directory
fluid.defaults("sjrk.storyTelling.server.nodeModulesHandler", {
    gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
    requestMiddleware: {
        "staticFilter": {
            middleware: "{server}.nodeModulesFilter"
        },
        "static": {
            middleware: "{server}.nodeModules",
            priority: "after:staticFilter"
        }
    }
});
