/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    sjrk = fluid.registerNamespace("sjrk"),
    kettle = require("kettle");

fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: ["fluid.component"],
    components: {
        server: {
            type: "kettle.server",
            options: {
                // All globally configured elements go here
                // and are passed to the relevant components
                globalConfig: {
                    binaryUploadDirectory: "./uploads",
                    uploadedFilesHandlerPath: "/uploads",
                    secrets: "@expand:sjrk.storyTelling.server.resolveJSONFile(./secrets.json)"

                },
                port: 8081,
                components: {
                    viewDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.view",
                        options: {
                            distributeOptions: {
                                target: "{that}.options.host",
                                record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
                            }
                        }
                    },
                    storyDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.story",
                        options: {
                            distributeOptions: {
                                target: "{that}.options.host",
                                record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
                            }
                        }
                    },
                    deleteStoryDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.deleteStory",
                        options: {
                            distributeOptions: {
                                target: "{that}.options.host",
                                record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
                            }
                        }
                    },
                    saveStoryWithBinaries: {
                        type: "sjrk.storyTelling.server.middleware.saveStoryWithBinaries",
                        options: {
                            binaryUploadOptions: {
                                uploadDirectory: "{server}.options.globalConfig.binaryUploadDirectory"
                            }
                        }
                    },
                    app: {
                        type: "sjrk.storyTelling.server.app.storyTellingHandlers"
                    },
                    basicAuth: {
                        type: "kettle.middleware.basicAuth",
                        options: {
                            middlewareOptions: {
                                users: {
                                    "admin": "{server}.options.globalConfig.secrets.adminPass"
                                },
                                challenge: true
                            }
                        }
                    },
                    nodeModulesFilter: {
                        type: "sjrk.storyTelling.server.staticMiddlewareSubdirectoryFilter",
                        options: {
                            allowedSubdirectories: [
                                "infusion",
                                "gpii-binder",
                                "sjrk-story-telling",
                                "handlebars",
                                "pagedown",
                                "gpii-handlebars"]
                        }
                    },
                    nodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules"
                        }
                    },
                    uploads: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "{server}.options.globalConfig.binaryUploadDirectory"
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
        browseStoriesHandler: {
            type: "sjrk.storyTelling.server.browseStoriesHandler",
            "route": "/stories/",
            "method": "get"
        },
        getStoryHandler: {
            type: "sjrk.storyTelling.server.getStoryHandler",
            "route": "/stories/:id",
            "method": "get"
        },
        saveStoryWithBinariesHandler: {
            type: "sjrk.storyTelling.server.saveStoryWithBinariesHandler",
            "route": "/stories/",
            "method": "post"
        },
        deleteStoryHandler: {
            type: "sjrk.storyTelling.server.deleteStoryHandler",
            "route": "/admin/deleteStory/:id",
            "method": "get"
        },
        nodeModulesHandler: {
            type: "sjrk.storyTelling.server.nodeModulesHandler",
            "route": "/*",
            "method": "get",
            "prefix": "/node_modules"
        },
        uploadsHandler: {
            type: "sjrk.storyTelling.server.uploadsHandler",
            "route": "/*",
            "method": "get",
            "prefix": "{server}.options.globalConfig.uploadedFilesHandlerPath"
        },
        uiHandler: {
            type: "sjrk.storyTelling.server.uiHandler",
            "route": "/*",
            "method": "get"
        }
    }
});

// Resolves a JSON file and parses it before
// returning it
sjrk.storyTelling.server.resolveJSONFile = function (jsonFilePath) {
    var file = kettle.resolvers.file(jsonFilePath);
    return JSON.parse(file);
};
