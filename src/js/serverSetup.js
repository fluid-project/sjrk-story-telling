/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: "fluid.component",
    components: {
        server: {
            type: "kettle.server",
            options: {
                port: 8081,
                components: {
                    ui: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./ui"
                        }
                    },
                    infusionNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/infusion"
                        }
                    },
                    binderNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/gpii-binder"
                        }
                    },
                    storytellingNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/sjrk-storytelling"
                        }
                    },
                    handlebarsNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/handlebars"
                        }
                    },
                    pagedownNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/pagedown"
                        }
                    },
                    gpiiHBNodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules/gpii-handlebars"
                        }
                    },
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
            "prefix": "/node_modules/sjrk-storytelling"
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
