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
                    app: {
                        type: "sjrk.storyTelling.server.app"
                    },
                    dataSource: {
                        type: "sjrk.storyTelling.server.dataSource"
                    }
                }
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.app", {
    gradeNames: ["kettle.app"],
    requestHandlers: {
        infusionNodeModulesHandler: {
            type: "sjrk.storyTelling.server.infusionNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/infusion"
        },
        binderNodeModulesHandler: {
            type: "sjrk.storyTelling.server.binderNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/gpii-binder"
        },
        storytellingNodeModulesHandler: {
            type: "sjrk.storyTelling.server.storytellingNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/sjrk-story-telling"
        },
        handlebarsNodeModulesHandler: {
            type: "sjrk.storyTelling.server.handlebarsNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/handlebars"
        },
        pagedownNodeModulesHandler: {
            type: "sjrk.storyTelling.server.pagedownNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/pagedown"
        },
        gpiiHBNodeModulesHandler: {
            type: "sjrk.storyTelling.server.gpiiHBNodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules/gpii-handlebars"
        },
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
            type: "sjrk.storyTelling.server.staticHandler",
            "route": "/*",
            "method": "get"
        }
    }
});
