/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.base", {
    gradeNames: ["kettle.dataSource.URL"],
    host: "http://localhost:5984",
    url: "@expand:{that}.getURL()",
    invokers: {
        getURL: {
            funcName: "sjrk.storyTelling.server.dataSource.couch.base.getURL",
            args: ["{that}.options.host", "{that}.options.path"]
        }
    }
});

sjrk.storyTelling.server.dataSource.couch.base.getURL = function (host, path) {
    return host + path;
};

fluid.defaults("sjrk.storyTelling.server.dataSource.couch.view", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.base"],
    // TODO: this should be more configurable, using termMap
    // and the available URL-based configurations of a view, along
    // with sensible defaults
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
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.base", "kettle.dataSource.CouchDB"],
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

// TODO: This is arguably an abuse of the dataSource, but
// it works in the case of Couch
fluid.defaults("sjrk.storyTelling.server.dataSource.couch.deleteStory", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.base"],
    // TODO: this should be more configurable, using termMap
    // and the available URL-based configurations of a view, along
    // with sensible defaults
    path: "/stories/%storyId?rev=%revisionId",
    termMap: {
        storyId: "%directStoryId",
        revisionId: "%directRevisionId"
    },
    writeMethod: "DELETE",
    writable: true
});
