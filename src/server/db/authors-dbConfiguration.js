/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

// These eslint directives prevent the linter from complaining about the use of
// globals or arguments that will be prevent in CouchDB design doc functions
// such as views or validate_doc_update

/* global emit */

"use strict";

require("infusion");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");
require("fluid-couch-config");

// sets up the Storytelling Tool database using fluid-couch-config
fluid.defaults("sjrk.storyTelling.server.authorsDb", {
    gradeNames: ["fluid.couchConfig.pipeline.retrying"],
    couchOptions: {
        dbName: "authors"
    },
    listeners: {
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)"
    },
    dbDesignDocuments: {
        lookup: {
            views: {
                "byUsernameOrEmail": {
                    "map": "sjrk.storyTelling.server.authorsDb.byUsernameOrEmail"
                }
            }
        }
    }
});

sjrk.storyTelling.server.authorsDb.byUsernameOrEmail = function (doc) {
    if (doc.type === "user") {
        emit(doc.username, doc);
        emit(doc.email, doc);
    }
};
