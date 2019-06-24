/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
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
                globalConfig: {
                    // Config values, except the secrets file, are stored in the
                    // external config file sjrk.storyTelling.server.themed.json5
                    // and are merged in on server startup
                    // ip: "",
                    // port: "",
                    // theme: "",
                    // binaryUploadDirectory: "",
                    // uploadedFilesHandlerPath: "",
                    // deletedFilesRecoveryPath: "",
                    // savingEnabled: true
                    secrets: "@expand:sjrk.storyTelling.server.resolveJSONFile(./secrets.json)"
                },
                port: "{that}.options.globalConfig.port",
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
                            components: {
                                storage: {
                                    options: {
                                        destination: "{server}.options.globalConfig.binaryUploadDirectory"
                                    }
                                }
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
                                "markdown-it",
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
                    tests: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./tests/ui",
                            middlewareOptions: {
                                index: "all-tests.html"
                            }
                        }
                    },
                    testData: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./tests/testData"
                        }
                    },
                    ui: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./src/ui"
                        }
                    },
                    // the default theme and base pages for the site
                    baseTheme: {
                        type: "kettle.middleware.static",
                        options: {
                            root: "./themes/base"
                        }
                    },
                    // the "Storytelling Project" theme for the site
                    learningReflections: {
                        type: "kettle.middleware.static",
                        options: {
                            root: "./themes/learningReflections",
                            middlewareOptions: {
                                index: "introduction.html"
                            }
                        }
                    },
                    // the Karisma "El planeta es la escuela" theme for the site
                    karisma: {
                        type: "kettle.middleware.static",
                        options: {
                            root: "./themes/karisma"
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
        testDataHandler: {
            type: "sjrk.storyTelling.server.testDataHandler",
            "route": "/*",
            "prefix": "/testData",
            "method": "get"
        },
        uiHandler: {
            type: "sjrk.storyTelling.server.uiHandler",
            "route": "/*",
            "prefix": "/src",
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
        testsHandler: {
            type: "sjrk.storyTelling.server.testsHandler",
            "route": "/*",
            "prefix": "/tests",
            "method": "get"
        },
        themeHandler: {
            type: "sjrk.storyTelling.server.themeHandler",
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
