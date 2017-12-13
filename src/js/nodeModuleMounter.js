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
// Should be used at the top level of a kettle server definition
fluid.defaults("sjrk.storyTelling.server.nodeModuleMounter", {
    gradeNames: ["fluid.component", "{that}.generateStaticMiddlewareComponentsGrade", "{that}.generateNodeModuleMountAppGrade"],
    nodeModulesRoot: "./node_modules/",
    nodeModulesHandlerPrefix: "/node_modules/",
    generatedGradePrefix: "sjrk.storyTelling.server",
    invokers: {
        generateStaticMiddlewareComponentsGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateStaticMiddlewareComponentsGrade",
            args: ["{that}.options.nodeModulesToMount", "{that}.options.nodeModulesRoot", "{that}.options.generatedGradePrefix"]
        },
        generateNodeModuleMountAppGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateNodeModuleMountAppGrade",
            args: ["{that}.options.nodeModulesToMount", "{that}.options.nodeModulesHandlerPrefix", "{that}.options.generatedGradePrefix"]
        }
    }
});

sjrk.storyTelling.server.nodeModuleMounter.generateStaticMiddlewareComponentsGrade = function (nodeModulesToMount, nodeModulesHandlerPrefix, generatedGradePrefix) {
    var middlewareComponents = {};

    fluid.each(nodeModulesToMount, function (nodeModuleName) {
        var def = {
            type: "kettle.middleware.static",
            options: {
                "root": nodeModulesHandlerPrefix + nodeModuleName
            }
        };
        var key = nodeModuleName + "-NodeModules";
        middlewareComponents[key] = def;
    });

    var returnedGradeName = generatedGradePrefix + ".staticMiddlewareComponentsGrade." + fluid.allocateGuid() ;

    fluid.defaults(returnedGradeName, {
        components: {
            server: {
                options: {
                    components: middlewareComponents
                }
            }
        }
    });

    return returnedGradeName;

};

sjrk.storyTelling.server.nodeModuleMounter.generateNodeModuleMountAppGrade = function (nodeModulesToMount, nodeModulesHandlerPrefix, generatedGradePrefix) {
    // return "fluid.component";

    var nodeModulesRequestHandlers = {};
    fluid.each(nodeModulesToMount, function (nodeModuleName) {
        var suffix = nodeModuleName + "-NodeModulesHandler";
        var handler = {
            type: generatedGradePrefix + "." + suffix,
            "route": "/*",
            "method": "get",
            "prefix": nodeModulesHandlerPrefix + nodeModuleName
        };
        nodeModulesRequestHandlers[suffix] = handler;
    });

    var returnedGradeName = generatedGradePrefix + ".app.nodeModuleMountApp." + fluid.allocateGuid() ;

    fluid.defaults(returnedGradeName, {
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
        sjrk.storyTelling.server.nodeModuleMounter.createStaticHandlerGrade(generatedGradePrefix, gradeSuffix, middlewareIoCReference);
    });

    return returnedGradeName;
};

sjrk.storyTelling.server.nodeModuleMounter.createStaticHandlerGrade = function (gradePrefix, gradeSuffix, middlewareIoCReference) {
    fluid.defaults(gradePrefix + "." + gradeSuffix, {
        gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
        requestMiddleware: {
            "static": {
                middleware: middlewareIoCReference
            }
        }
    });
};
