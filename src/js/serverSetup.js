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

fluid.defaults("sjrk.storyTelling.server.staticMiddlewareComponents", {
    gradeNames: ["fluid.component", "{that}.generateStaticMiddlewareComponentsGrade"],
    invokers: {
        generateStaticMiddlewareComponentsGrade: {
            funcName: "sjrk.storyTelling.server.generateStaticMiddlewareComponentsGrade",
            args: ["{that}.options.staticMiddlewareComponents"]
        }
    },
    staticMiddlewareComponents: {
        "ui": "./ui",
        "infusionNodeModules": "./node_modules/infusion",
        "binderNodeModules": "./node_modules/gpii-binder",
        "storytellingNodeModules": "./node_modules/sjrk-story-telling",
        "handlebarsNodeModules": "./node_modules/handlebars",
        "pagedownNodeModules": "./node_modules/pagedown",
        "gpiiHBNodeModules": "./node_modules/gpii-handlebars"
    }
});

sjrk.storyTelling.server.generateStaticMiddlewareComponentsGrade = function (staticMiddlewareComponents) {
    var components = {};
    fluid.each(staticMiddlewareComponents, function (staticRoot, componentKey) {
        var def = {
            type: "kettle.middleware.static",
            options: {
                "root": staticRoot
            }
        };
        components[componentKey] = def;
    });

    fluid.defaults("sjrk.storyTelling.server.staticMiddlewareComponentsGrade", {
        components: {
            server: {
                options: {
                    components: components
                }
            }
        }
    });

    return "sjrk.storyTelling.server.staticMiddlewareComponentsGrade";

};

fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: ["fluid.component", "sjrk.storyTelling.server.staticMiddlewareComponents"],
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8081,
                components: {
                    dataSource: {
                        type: "sjrk.storyTelling.server.dataSource"
                    },
                    nodeModulesHandlersApp: {
                        type: "sjrk.storyTelling.server.app.nodeModulersHandlers"
                    },
                    app: {
                        type: "sjrk.storyTelling.server.app.storyTellingHandlers"
                    }
                }
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.app.nodeModulersHandlers", {
    gradeNames: ["kettle.app", "{that}.generateNodeModulersHandlersGrade"],
    invokers: {
        generateNodeModulersHandlersGrade: {
            funcName: "sjrk.storyTelling.server.app.nodeModulersHandlers.generateNodeModulesHandlersGrade",
            args: ["{that}.options.nodeModulesHandlerDefs"]
        }
    },
    nodeModulesHandlerDefs: {
        "infusionNodeModulesHandler": "/node_modules/infusion",
        "binderNodeModulesHandler": "/node_modules/gpii-binder",
        "storytellingNodeModulesHandler": "/node_modules/sjrk-story-telling",
        "handlebarsNodeModulesHandler": "/node_modules/handlebars",
        "pagedownNodeModulesHandler": "/node_modules/pagedown",
        "gpiiHBNodeModulesHandler": "/node_modules/gpii-handlebars"
    }
});

sjrk.storyTelling.server.app.nodeModulersHandlers.generateNodeModulesHandlersGrade = function (nodeModulesHandlerDefs) {
    var requestHandlers = {};
    fluid.each(nodeModulesHandlerDefs, function (prefix, key) {
        var handler = {
            type: "sjrk.storyTelling.server." + key,
            "route": "/*",
            "method": "get",
            "prefix": prefix
        };
        requestHandlers[key] = handler;
    });

    fluid.defaults("sjrk.storyTelling.server.app.nodeModulersHandlersGrade", {
        requestHandlers: requestHandlers
    });

    return "sjrk.storyTelling.server.app.nodeModulersHandlersGrade";
};

fluid.defaults("sjrk.storyTelling.server.app.storyTellingHandlers", {
    gradeNames: ["kettle.app"],
    requestHandlers: {
        getStoryHandler: {
            type: "sjrk.storyTelling.server.getStoryHandler",
            "route": "/story/:id",
            "method": "get"
        },
        saveStoryHandler: {
            type: "sjrk.storyTelling.server.saveStoryHandler",
            "route": "/story/:id",
            "method": "post"
        },
        saveNewStoryHandler: {
            type: "sjrk.storyTelling.server.saveStoryHandler",
            "route": "/story/",
            "method": "post"
        },
        uiHandler: {
            type: "sjrk.storyTelling.server.uiHandler",
            "route": "/*",
            "method": "get"
        }
    }
});
