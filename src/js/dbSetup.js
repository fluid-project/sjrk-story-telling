/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

// These eslint directives prevent the linter from complaining about the use of
// globals or arguments that will be prevent in CouchDB design doc functions
// such as views or validate_doc_update

/* global sjrk, emit, newDoc, oldDoc, userCtx, secObj */
/*eslint no-unused-vars: ["error", { "vars": "local", "argsIgnorePattern": "newDoc|oldDoc|userCtx|secObj" }]*/

"use strict";

require("infusion");
require("kettle");
fluid.setLogging(true);

var sjrk = fluid.registerNamespace("sjrk");
require("fluid-couch-config");

// TODO: the examples should be removed
// TODO: what additional views are needed?
fluid.defaults("sjrk.storyTelling.server.storiesDb", {
    gradeNames: ["fluid.couchConfig.pipeline.retrying"],
    couchOptions: {
        dbName: "stories"
    },
    listeners: {
        "onCreate.configureCouch": "{that}.configureCouch",
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)",
    },
    dbDocuments: {
        "storyExample": {
            "type": "story",
            "value": {
                "title": "Test title",
                "content": "This is the test story's content.",
                "author": "Test Author",
                "language": "English",
                "tags": ["tag1", "tag2"],
                "summary": "This is a summary of the test story."
            }
        },
        "03040e30-8371-11e7-96f2-1fe98400f32b": {
            "type": "story",
            "value": {
                "title": "This is a test",
                "content": "test story modified from front end a second time, this time it's a little longer so the text-to-speech synthesizer voice can keep reading this run-on sentence and make a lot of noise, and we know it's working properly, and why are you still reading this anyway?",
                "author": "Testauthor",
                "language": "English",
                "tags": ["test", "story"],
                "summary": ""
            }
        }
    },
    dbDesignDocuments: {
        stories: {
            views: {
                "storyTags": {
                    "map": "sjrk.storyTelling.server.storiesDb.storyTagsFunction"
                }
            },
            validate_doc_update: "sjrk.storyTelling.server.storiesDb.validateFunction"
        }
    }
});

sjrk.storyTelling.server.storiesDb.storyTagsFunction = function (doc) {
    if (doc.value.tags.length > 0) {
        for (var idx in doc.value.tags) {
            emit(doc.value.tags[idx], doc.value.title);
        }
    }
};

sjrk.storyTelling.server.storiesDb.validateFunction = function (newDoc, oldDoc, userCtx, secObj) {
    if (!newDoc.type) {
        throw ({forbidden: "doc.type is required"});
    }
};

sjrk.storyTelling.server.storiesDb({
    distributeOptions: {
        target: "{that}.options.couchOptions.couchUrl",
        record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
    }
});
