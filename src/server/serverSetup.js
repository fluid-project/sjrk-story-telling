/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    sjrk = fluid.registerNamespace("sjrk"),
    kettle = require("kettle"),
    fs = require("fs"),
    MemoryStore = require("memorystore")(kettle.npm.expressSession);

require("fluid-express-user");

// The main Kettle server configuration grade
fluid.defaults("sjrk.storyTelling.server", {
    gradeNames: ["fluid.component"],
    components: {
        // the Kettle server proper
        server: {
            type: "kettle.server",
            options: {
                gradeNames: ["kettle.server.sessionAware"],
                globalConfig: {
                    // Config values are stored in the external config file
                    // named "sjrk.storyTelling.server.themed.json5"
                    // and are merged in on server startup
                    // port: "",
                    // theme: "",
                    // themeIndexFile": "",
                    // authoringEnabled: true
                },
                secureConfig: {
                    baseThemeName: "base",
                    themesPath: "./themes/%theme",
                    binaryUploadDirectory: "./uploads",
                    uploadedFilesHandlerPath: "/uploads",
                    deletedFilesRecoveryPath: "/deleted_uploads",
                    secretsConfigPath: "./secrets.json",
                    secrets: "@expand:sjrk.storyTelling.server.resolveJSONFile({that}.options.secureConfig.secretsConfigPath)"
                },
                port: "{that}.options.globalConfig.port",
                session: {
                    store: "@expand:sjrk.storyTelling.server.makeMemorySessionStore()",
                    middlewareOptions: {
                        secret: "{server}.options.secureConfig.secrets.session"
                    }
                },
                account: "{that}.options.secureConfig.secrets.account",
                distributeOptions: {
                    couchDBURL: {
                        record: "@expand:kettle.resolvers.env(COUCHDB_URL)",
                        target: "{that sjrk.storyTelling.server.dataSource.couch.core}.options.host"
                    },
                    couchDBAuthorsURL: {
                        record: "@expand:kettle.resolvers.env(COUCHDB_URL)",
                        target: "{that expressUserUtils}.options.dataSourceConfig.host"
                    },
                    sessionOptions: {
                        source: "{that}.options.session",
                        target: "{that > kettle.middlewareHolder > session}.options"
                    },
                    accountOptions: {
                        source: "{that}.options.account",
                        target: "{that > expressUserUtils}.options"
                    }
                },
                components: {
                    // user authentication
                    expressUserUtils: {
                        type: "fluid.express.user.utils",
                        options: {
                            iterations: 100,
                            digest: "blake2b512",
                            dataSourceConfig: {
                                host: "http://localhost:5984",
                                path: "authors"
                            },
                            rules: {
                                createUserWrite: {
                                    "_id": "userData.authorID",
                                    "authorID": "userData.authorID" // may only need _id in the document
                                }
                            },
                            couch: {
                                userDbUrl: {
                                    expander: {
                                        funcName: "fluid.stringTemplate",
                                        args: ["%host/%path", {
                                            host: "{expressUserUtils}.options.dataSourceConfig.host",
                                            path: "{expressUserUtils}.options.dataSourceConfig.path"
                                        }]
                                    }
                                }
                            }
                        }
                    },
                    // a DataSource to get a list of stories
                    viewDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.view"
                    },
                    // a DataSource to get a stories by author
                    storyByAuthorDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.authorStoriesView"
                    },
                    // a DataSource to get or save a single story
                    storyDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.story"
                    },
                    // a DataSource to delete a single story
                    deleteStoryDataSource: {
                        type: "sjrk.storyTelling.server.dataSource.couch.deleteStory"
                    },
                    // the Kettle app
                    app: {
                        type: "sjrk.storyTelling.server.app.storyTellingHandlers"
                    },
                    // middleware to save a block's file to the server filesystem
                    saveStoryFile: {
                        type: "sjrk.storyTelling.server.middleware.saveStoryFile",
                        options: {
                            components: {
                                storage: {
                                    options: {
                                        destination: "{server}.options.secureConfig.binaryUploadDirectory"
                                    }
                                }
                            }
                        }
                    },
                    // middleware to coordinate HTTP Basic Authentication
                    basicAuth: {
                        type: "kettle.middleware.basicAuth",
                        options: {
                            middlewareOptions: {
                                users: {
                                    "admin": "{server}.options.secureConfig.secrets.adminPass"
                                },
                                challenge: true
                            }
                        }
                    },
                    // middleware to restrict serving to only those directories listed
                    nodeModulesFilter: {
                        type: "sjrk.storyTelling.server.staticMiddlewareSubdirectoryFilter",
                        options: {
                            allowedSubdirectories: [
                                "fluid-binder",
                                "fluid-handlebars",
                                "fluid-location-bar-relay",
                                "handlebars",
                                "infusion",
                                "markdown-it",
                                "sinon"]
                        }
                    },
                    // static middleware for the node_modules directory
                    nodeModules: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./node_modules"
                        }
                    },
                    // static middleware for the uploads directory
                    uploads: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "{server}.options.secureConfig.binaryUploadDirectory"
                        }
                    },
                    // static middleware for the ui directory
                    ui: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./src/ui"
                        }
                    },
                    // static middleware for the static files directory
                    static: {
                        type: "kettle.middleware.static",
                        options: {
                            "root": "./src/static"
                        }
                    },
                    // the custom theme for the site, loaded in "on top" of base
                    currentTheme: {
                        type: "kettle.middleware.static",
                        options: {
                            root: "@expand:sjrk.storyTelling.server.getThemePath({server}.options.globalConfig.theme, {server}.options.secureConfig.themesPath)",
                            middlewareOptions: {
                                index: "{server}.options.globalConfig.themeIndexFile"
                            }
                        }
                    },
                    // the default theme and base pages for the site
                    baseTheme: {
                        type: "kettle.middleware.static",
                        options: {
                            root: "@expand:sjrk.storyTelling.server.getThemePath({server}.options.secureConfig.baseThemeName, {server}.options.secureConfig.themesPath)",
                            middlewareOptions: {
                                index: "storyBrowse.html"
                            }
                        }
                    }
                }
            }
        }
    }
});

// the Kettle app
fluid.defaults("sjrk.storyTelling.server.app.storyTellingHandlers", {
    gradeNames: ["kettle.app"],
    components: {
        loginValidator: {
            type: "sjrk.storyTelling.server.loginValidator"
        },
        signupValidator: {
            type: "sjrk.storyTelling.server.signupValidator"
        }
    },
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
        getEditStoryHandler: {
            type: "sjrk.storyTelling.server.getEditStoryHandler",
            "route": "/stories/:id/edit",
            "method": "get"
        },
        saveStoryHandler: {
            type: "sjrk.storyTelling.server.saveStoryHandler",
            "route": "/stories/",
            "method": "post"
        },
        saveStoryFileHandler: {
            type: "sjrk.storyTelling.server.saveStoryFileHandler",
            "route": "/stories/:id",
            "method": "post"
        },
        deleteStoryHandler: {
            type: "sjrk.storyTelling.server.deleteStoryHandler",
            "route": "/admin/deleteStory/:id",
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
            "prefix": "{server}.options.secureConfig.uploadedFilesHandlerPath"
        },
        clientConfigHandler: {
            type: "sjrk.storyTelling.server.clientConfigHandler",
            route: "/clientConfig",
            method: "get"
        },
        signupHandler: {
            type: "sjrk.storyTelling.server.signupHandler",
            "route": "/authors/signup",
            method: "post"
        },
        loginHandler: {
            type: "sjrk.storyTelling.server.loginHandler",
            "route": "/authors/login",
            method: "post"
        },
        logoutHandler: {
            type: "sjrk.storyTelling.server.logoutHandler",
            "route": "/authors/logout",
            method: "post"
        },
        themeHandler: {
            type: "sjrk.storyTelling.server.themeHandler",
            "route": "/*",
            "method": "get"
        }
    }
});

/**
 * Resolves a JSON file and parses it before returning it
 *
 * @param {String} jsonFilePath - the path to the JSON file to parse
 *
 * @return {Object} - the parsed file contents
 */
sjrk.storyTelling.server.resolveJSONFile = function (jsonFilePath) {
    var file = kettle.resolvers.file(jsonFilePath);
    return JSON.parse(file);
};

/**
 * Returns the path to the custom theme folder. The theme folder's name is
 * expected to match the theme name being passed in. If the theme is not
 * specified, the path returend will be the current directory ("."). If the
 * theme is specified but the resolved folder doesn't exist within themeFolder,
 * an error will be reported.
 *
 * @param {String} theme - The name of the theme for which to find the path
 * @param {String} themeFolder - The folder/path that contains the theme being retrieved
 *
 * @return {String} - the custom theme directory's path
 */
sjrk.storyTelling.server.getThemePath = function (theme, themeFolder) {
    var themePath = ".";

    if (theme) {
        themePath = fluid.stringTemplate(themeFolder, { theme: theme });

        if (!fs.existsSync(themePath)) {
            fluid.fail("The custom theme folder " + themePath + " does not exist. Please verify that the theme name is configured properly.");
        }
    }

    return themePath;
};

/**
 * Creates an in memory session store for use by the session middleware. Configured for sessions to expire after 24hrs.
 *
 * @return {Object} - a MemoryStore instance
 */
sjrk.storyTelling.server.makeMemorySessionStore = function () {
    // TODO: Currently using https://www.npmjs.com/package/memorystore as it is a production ready memory store;
    //       however, the session should eventually be stored in a database to prevent clearing on server restart.
    //       https://issues.fluidproject.org/browse/SJRK-444
    return new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
    });
};
