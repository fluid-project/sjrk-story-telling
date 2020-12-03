/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.storyTelling.server.dataSource.couch.story");

// This is the data schema version for the project.
// All new stories will have their version set to this value.
sjrk.storyTelling.server.dataSource.couch.story.schemaVersion = "0.0.1";

// A CouchDB-compatible Kettle DataSource, providing core functionality
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

/**
 * Builds a URL from the given hostname and path
 *
 * @param {String} host - the host URL
 * @param {String} path - the path to the dataSource relative to the root
 *
 * @return {String} - the fully-formed URL
 */
sjrk.storyTelling.server.dataSource.couch.core.getURL = function (host, path) {
    return host + path;
};

// A CouchDB DataSource for views, for use on the storyBrowse page
fluid.defaults("sjrk.storyTelling.server.dataSource.couch.view", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.core"],
    path: "/%db/_design/%designDoc/_view/%viewId?limit=%limit&reduce=%reduce&skip=%skip",
    termMap: {
        viewId: "%directViewId",
        limit: "500",
        reduce: "false",
        db: "stories",
        designDoc: "stories",
        skip: "0"
    }
});

// A CouchDB DataSource for retrieving a story by authorID and storyId
fluid.defaults("sjrk.storyTelling.server.dataSource.couch.authorStoriesView", {
    gradeNames: ["sjrk.storyTelling.server.dataSource.couch.core"],
    // TODO: investigate overriding the resolveUrl invoker to all for providing the query paramters via
    // the directModel completely. In that way the view can be used for different filtering on the same view.
    // Note: the pre-uriEncoding for the `"` and `,` characters in the `key` query parameter
    path: "/%db/_design/%designDoc/_view/%viewId?key=[%22%authorID%22%2C%22%storyId%22]",
    termMap: {
        viewId: "storiesByAuthor",
        authorID: "%authorID",
        storyId: "%storyId",
        db: "stories",
        designDoc: "stories"
    }
});

// A CouchDB DataSource for a single story, for use on the storyView and storyEdit pages
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
            authorID: "authorID",
            value: "value",
            schemaVersion: {
                transform: {
                    type: "fluid.transforms.literalValue",
                    input: sjrk.storyTelling.server.dataSource.couch.story.schemaVersion
                }
            }
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

// A CouchDB dataSource for deleting a single story
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
