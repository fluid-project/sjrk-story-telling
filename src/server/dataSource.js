/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.core", {
    gradeNames: ["kettle.dataSource.URL"],
    host: "http://localhost:5984",
    url: "@expand:{that}.getURL()",
    invokers: {
        getURL: {
            funcName: "sjrk.storyTelling.server.dataSource.couch.core.getURL",
            args: ["{that}.options.host", "{that}.options.path"]
        }
    },
    listeners: {
        "onError.logDataSourceError": {
            funcName: "fluid.log",
            args: [fluid.logLevel.WARN, "Couch DataSource error: ", "{arguments}.0"]
        }
    }
});

sjrk.storyTelling.server.dataSource.couch.core.getURL = function (host, path) {
    return host + path;
};

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.view", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.core"],
    path: "/%db/_design/%designDoc/_view/%viewId?limit=%limit&reduce=%reduce&skip=%skip",
    termMap: {
        viewId: "%directViewId",
        limit: "100",
        reduce: "false",
        db: "stories",
        designDoc: "stories",
        skip: "0"
    }
});

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.story", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.core", "kettle.dataSource.CouchDB"],
    rules: {
        writePayload: {
            type: {
                transform: {
                    type: "fluid.transforms.literalValue",
                    input: "story"
                }
            },
            value: ""
        },
        readPayload: {
            "_rev": "_rev",
            "": "value"
        }
    },
    path: "/stories/%storyId",
    termMap: {
        storyId: "%directStoryId"
    },
    writable: true
});

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.deleteStory", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.core"],
    path: "/stories/%storyId?rev=%revisionId",
    termMap: {
        storyId: "%directStoryId",
        revisionId: "%directRevisionId"
    },
    writeMethod: "DELETE",
    writable: true
});
