/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var sjrk = fluid.registerNamespace("sjrk");
require("kettle");

// Given a list of node modules, mounts them as static directories
// using kettle.middleware.static, automatically generating handlers
// and routes
//
// Should be used at the top level of a kettle app definition
fluid.defaults("sjrk.storyTelling.server.nodeModuleMounter", {
    gradeNames: ["fluid.component", "{that}.generateStaticMiddlewareComponentsGrade", "{that}.generateNodeModulersHandlersGrade"],
    invokers: {
        generateStaticMiddlewareComponentsGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateStaticMiddlewareComponentsGrade",
            args: ["{that}.options.nodeModulesToMount"]
        },
        generateNodeModulersHandlersGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateNodeModuleMountAppGrade",
            args: ["{that}.options.nodeModulesToMount"]
        }
    }
});

sjrk.storyTelling.server.nodeModuleMounter.generateStaticMiddlewareComponentsGrade = function (nodeModulesToMount) {
    var middlewareComponents = {};

    fluid.each(nodeModulesToMount, function (nodeModuleName) {
        var def = {
            type: "kettle.middleware.static",
            options: {
                "root": "./node_modules/" + nodeModuleName
            }
        };
        var key = nodeModuleName + "-NodeModules";
        middlewareComponents[key] = def;
    });

    fluid.defaults("sjrk.storyTelling.server.staticMiddlewareComponentsGrade", {
        components: {
            server: {
                options: {
                    components: middlewareComponents
                }
            }
        }
    });

    return "sjrk.storyTelling.server.staticMiddlewareComponentsGrade";

};

sjrk.storyTelling.server.nodeModuleMounter.createStaticHandlerGrade = function (gradeSuffix, middlewareIoCReference) {
    return fluid.defaults("sjrk.storyTelling.server." + gradeSuffix, {
        gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
        requestMiddleware: {
            "static": {
                middleware: middlewareIoCReference
            }
        }
    });
};

sjrk.storyTelling.server.nodeModuleMounter.generateNodeModuleMountAppGrade = function (nodeModulesToMount) {
    // return "fluid.component";

    var nodeModulesRequestHandlers = {};
    fluid.each(nodeModulesToMount, function (nodeModuleName) {
        var suffix = nodeModuleName + "-NodeModulesHandler";
        var handler = {
            type: "sjrk.storyTelling.server." + suffix,
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/" + nodeModuleName
        };
        nodeModulesRequestHandlers[suffix] = handler;
    });

    fluid.defaults("sjrk.storyTelling.server.app.nodeModuleMountApp", {
        components: {
            server: {
                options: {
                    components: {
                        nodeModuleMountApp: {
                            type: "kettle.app",
                            options: {
                                requestHandlers: nodeModulesRequestHandlers
                            }
                        }
                    }
                }
            }
        }
    });

    // Create corresponding handler grades
    fluid.each(nodeModulesToMount, function (nodeModuleName) {
        var gradeSuffix = nodeModuleName + "-NodeModulesHandler";
        var middlewareIoCReference = "{server}." + nodeModuleName + "-NodeModules";
        sjrk.storyTelling.server.nodeModuleMounter.createStaticHandlerGrade(gradeSuffix, middlewareIoCReference);
    });

    return "sjrk.storyTelling.server.app.nodeModuleMountApp";
};

sjrk.storyTelling.server.nodeModuleMounter.createStaticHandlerGrade = function (gradeSuffix, middlewareIoCReference) {
    fluid.defaults("sjrk.storyTelling.server." + gradeSuffix, {
        gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
        requestMiddleware: {
            "static": {
                middleware: middlewareIoCReference
            }
        }
    });
};
