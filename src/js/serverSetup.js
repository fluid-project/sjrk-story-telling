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
    nodeModulesToMount: ["infusion", "gpii-binder", "sjrk-story-telling", "handlebars", "pagedown", "gpii-handlebars"],
    invokers: {
        generateStaticMiddlewareComponentsGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateStaticMiddlewareComponentsGrade",
            args: ["{that}.options.nodeModulesToMount"]
        },
        generateNodeModulersHandlersGrade: {
            funcName: "sjrk.storyTelling.server.nodeModuleMounter.generateNodeModulersHandlersGrade",
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
    console.log(middlewareComponents);

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

sjrk.storyTelling.server.nodeModuleMounter.generateNodeModulersHandlersGrade = function (nodeModulesToMount) {
    return "fluid.component";
};

fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: ["fluid.component", "sjrk.storyTelling.server.nodeModuleMounter"],
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
                    },
                    ui: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./ui"
                        }
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
        "infusion-NodeModulesHandler": "/node_modules/infusion",
        "gpii-binder-NodeModulesHandler": "/node_modules/gpii-binder",
        "sjrk-story-telling-NodeModulesHandler": "/node_modules/sjrk-story-telling",
        "handlebars-NodeModulesHandler": "/node_modules/handlebars",
        "pagedown-NodeModulesHandler": "/node_modules/pagedown",
        "gpii-handlebars-NodeModulesHandler": "/node_modules/gpii-handlebars"
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
