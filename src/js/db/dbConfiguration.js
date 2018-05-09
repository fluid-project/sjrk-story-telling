/*
Copyright 2017-2018 OCAD University
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
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)"
    },
    dbDocuments: {
        "storyExample": {
            "type": "story",
            "value": {
                "title": "Using This Site",
                "content": [
                  {
                    "id": null,
                    "language": null,
                    "heading": "Using This Site - Part One",
                    "blockType": "text",
                    "text": "Click the icons above to add blocks of various types, such as text and images, to the story.",
                    "simplifiedText": "",
                    "contentString": "Using This Site - Part One. Click the icons above to add blocks of various types, such as text and images, to the story.. ",
                    "languageFromSelect": "",
                    "languageFromInput": ""
                  },
                  {
                    "id": null,
                    "language": null,
                    "heading": "Using This Site - Part Two",
                    "blockType": "text",
                    "text": "When you've added all the blocks you want, \"Continue\" to give your story a title, an author and some tags.",
                    "simplifiedText": null,
                    "contentString": "Using This Site - Part Two. When you've added all the blocks you want, \"Continue\" to give your story a title, an author and some tags.. ",
                    "languageFromSelect": "",
                    "languageFromInput": ""
                  }
                ],
                "contentString": "Using This Site - Part One. Click the icons above to add blocks of various types, such as text and images, to the story.. . Using This Site - Part Two. When you've added all the blocks you want, \"Continue\" to give your story a title, an author and some tags.. . ",
                "author": "SJRK Team",
                "language": "",
                "images": [],
                "tags": [
                  "help",
                  "example"
                ],
                "keywordString": "help, example",
                "categories": [],
                "summary": "",
                "timestampCreated": null,
                "timestampModified": null,
                "requestedTranslations": [],
                "translationOf": null,
                "thumbnailUrl": "",
                "thumbnailAltText": "",
                "contentTypes": [],
                "languageFromSelect": "",
                "languageFromInput": ""
            }
        }
    },
    dbDesignDocuments: {
        stories: {
            views: {
                "storyTags": {
                    "map": "sjrk.storyTelling.server.storiesDb.storyTagsFunction"
                },
                "storiesById": {
                    "map": "sjrk.storyTelling.server.storiesDb.storiesByIdFunction"
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

sjrk.storyTelling.server.storiesDb.storiesByIdFunction = function (doc) {

  var browseDoc = {
      "title": doc.value.title,
      "author": doc.value.author,
      "tags": doc.value.tags,
      "content": doc.value.content
  };

  emit(doc._id, browseDoc);
};

sjrk.storyTelling.server.storiesDb.validateFunction = function (newDoc, oldDoc, userCtx, secObj) {
    // checking !newDoc_deleted is important because
    // otherwise validation can prevent deletion,
    // per https://stackoverflow.com/questions/34221859/couchdb-validation-prevents-delete    
    if (!newDoc._deleted && !newDoc.type) {
        throw ({forbidden: "doc.type is required"});
    }
};
