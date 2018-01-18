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
//
// fluid.defaults("sjrk.storyTelling.server.mountedNodeModules", {
//     gradeNames: ["sjrk.storyTelling.server.nodeModuleMounter"],
//     nodeModulesToMount: [
//         "infusion",
//         "gpii-binder",
//         "sjrk-story-telling",
//         "handlebars",
//         "pagedown",
//         "gpii-handlebars"],
// });

fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: ["fluid.component"],
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8081,
                components: {
                    storyDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.story"
                    },
                    app: {
                        type: "sjrk.storyTelling.server.app.storyTellingHandlers"
                    },
                    nodeModulesFilter: {
                        type: "sjrk.storyTelling.server.staticMiddlewareFilter"
                    },
                    nodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules"
                        }
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
        nodeModulesHandler: {
            type: "sjrk.storyTelling.server.nodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules"
        },
        uiHandler: {
            type: "sjrk.storyTelling.server.uiHandler",
            "route": "/*",
            "method": "get"
        }
    }
});
