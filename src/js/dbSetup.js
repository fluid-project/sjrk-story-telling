// These eslint directives prevent the linter from complaining about the use of
// globals or arguments that will be prevent in CouchDB design doc functions
// such as views or validate_doc_update

/* global sjrk, emit, newDoc, oldDoc, userCtx, secObj */
/*eslint no-unused-vars: ["error", { "vars": "local", "argsIgnorePattern": "newDoc|oldDoc|userCtx|secObj" }]*/

"use strict";

require("infusion");

var sjrk = fluid.registerNamespace("sjrk");
require("sjrk-couch-config");

fluid.defaults("sjrk.storyTelling.server.storiesDb", {
    gradeNames: ["sjrk.server.couchConfig.auto"],
    dbConfig: {
        dbName: "stories",
        designDocName: "views"
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
    dbViews: {
        "storyTags": {
            "map": "sjrk.storyTelling.server.storiesDb.storyTagsFunction"
        }
    },
    dbValidate: {
        validateFunction: "sjrk.storyTelling.server.storiesDb.validateFunction"
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

sjrk.storyTelling.server.storiesDb();
