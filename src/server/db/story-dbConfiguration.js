/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
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
                "title": "The Story Builder how-to",
                "content": [{
                    "heading": "Add Content Blocks",
                    "blockType": "text",
                    "text": "The Story Builder is designed based on building blocks. There are four types of blocks you can use to build your story:\n\n1. Written content—type directly in the tool\n2. Images (photos of items, drawings, diagrams, etc.)—capture photos or upload files\n3. Audio (sound)—record audio or upload files\n4. Video (audio and visual)—record video or upload files\n\nTo add content blocks and start creating your story, click on an icon at the top of the Story Builder to add a block. You can add as many blocks as you like.\n\nYou won’t be able to reorder the blocks once you have added them, thus, it may be helpful to outline your story blocks before you add them in the Story Builder Tool."
                },
                {
                    "heading": "Remove Content Blocks",
                    "blockType": "text",
                    "text": "To remove a content block from your story, first select the checkbox at the top right corner of each block and then click on the trash can icon on the top right corner of the Story Builder Tool. Note that deleted blocks cannot be retrieved."
                },
                {
                    "heading": "Add Descriptions (Metadata) to Content Blocks",
                    "blockType": "text",
                    "text": "Each block you add to your story includes a few extra text fields where you can enter additional information about the content of that block. This information is called ‘Metadata’ and it helps screen readers, search engines and other assistive technologies find and access the content of each block."
                },
                {
                    "heading": "Add Story Title, Author Name and Keywords",
                    "blockType": "text",
                    "text": "When you've added all the blocks to your story, select \"Continue\" to give your story a title, author name and some keywords. This information helps others find your story and attribute it to you when they are reusing it. If you plan to enter several keywords, make sure they are separated by a comma."
                },
                {
                    "heading": "Preview Story",
                    "blockType": "text",
                    "text": "Selecting the “Preview My Story” button will display how your story will look like when it is published. You can always select the “Back” button to go to the previous section and edit your story."
                },
                {
                    "heading": "Publish Story",
                    "blockType": "text",
                    "text": "Once you are ready to publish your story on The Storytelling Project website, you can select the “Publish My Story” button. Please note that published stories are licensed under Creative Commons Attribution BY 4.0. This means others can reuse the content, make modifications, and attribute to the original author. Published stories are not editable and you cannot remove them from the site.\n\nIf you wish to remove your story from the website, please send an email to the address listed on the footer to request removal of your story."
                },
                {
                    "heading": "Browse Stories",
                    "blockType": "text",
                    "text": "Select the “Browse Stories” button on the main page to browse through a collection of published stories by various contributors."
                }],
                "author": "IDRC",
                "tags": [
                    "Help",
                    "Example",
                    "How-to"
                ]
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

/**
 * This function is used as a "view" design doc once it's migrated to CouchDB
 *
 * @param {Object} doc - a document to evaluate in the view
 */
sjrk.storyTelling.server.storiesDb.storyTagsFunction = function (doc) {
    if (doc.value.tags.length > 0) {
        for (var idx in doc.value.tags) {
            emit(doc.value.tags[idx], doc.value.title);
        }
    }
};

/**
 * This function is used as a "view" design doc once it's migrated to CouchDB
 *
 * @param {Object} doc - a document to evaluate in the view
 */
sjrk.storyTelling.server.storiesDb.storiesByIdFunction = function (doc) {

    var browseDoc = {
        "title": doc.value.title,
        "author": doc.value.author,
        "tags": doc.value.tags,
        "content": doc.value.content
    };

    emit(doc._id, browseDoc);
};

/**
* This function is used to validate new documents once it's migrated to CouchDB
* For more info on this process, please see the CouchDB guide:
* {@link https://docs.couchdb.org/en/1.6.1/couchapp/ddocs.html#validate-document-update-functions}
*
* @throws - If newDoc doesn't have a type defined, an error will be thrown
*
* @param {Object} newDoc - the incoming doc
*/
sjrk.storyTelling.server.storiesDb.validateFunction = function (newDoc) {
    // checking !newDoc._deleted is important because
    // otherwise validation can prevent deletion,
    // per https://stackoverflow.com/questions/34221859/couchdb-validation-prevents-delete
    if (!newDoc._deleted && !newDoc.type) {
        throw ({forbidden: "doc.type is required"});
    }
};
