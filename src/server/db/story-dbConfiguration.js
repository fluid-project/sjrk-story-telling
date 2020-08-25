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
                "published": true,
                "id": "storyExample",
                "title": "The Story Builder how-to",
                "content": [{
                    "heading": "Add Content Blocks",
                    "blockType": "text",
                    "text": "The Story Builder is designed based on building blocks. There are four types of blocks you can use to build your story:\n\n1. Written content—type directly in the tool\n2. Images (photos of items, drawings, diagrams, etc.)—capture photos or upload files\n3. Audio (sound)—record audio or upload files\n4. Video (audio and visual)—record video or upload files\n\nTo add content blocks and start creating your story, click on an icon at the top of the Story Builder to add a block. You can add as many blocks as you like."
                },
                {
                    "heading": "Reorder Content Blocks",
                    "blockType": "text",
                    "text": "You can reorder your content blocks using the mouse or keyboard as follows.\n#### Mouse/Touch\n* Select and drag the block handle to move a block. You will see an insertion line appear at the position where the block will be relocated. To leave the block in the same position, move it until the insertion line is immediately above or below the block you’re moving.\n* Select the up/down buttons to move a block one position up or down.\n#### Keyboard\n* With focus on the up/down buttons, select enter or spacebar to move a block one position up or down, or\n* Use keyboard shortcuts to move a block up or down as follows:\n  * With focus on the whole block, use the up/down arrow keys on your keyboard together with Shift-Control (Mac) or Control/Ctrl (Windows) to move the block up or down."
                },
                {
                    "heading": "Navigating through Content Blocks",
                    "blockType": "text",
                    "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block.\n\n**Note:** focus must be on the whole block in order to use this keyboard control (rather than on any one element within the block). We are working on fixing a bug in the tool that limits the ability to move focus from block to block with the keyboard. See Current Bugs section for more detail."
                },
                {
                    "heading": "Remove Content Blocks",
                    "blockType": "text",
                    "text": "To remove a content block from your story, first select the checkbox at the top right corner of each block and then click on the trash can icon on the top right corner of the Story Builder Tool. Note that deleted blocks cannot be retrieved."
                },
                {
                    "heading": "Add Descriptions (Metadata) to Content Blocks",
                    "blockType": "text",
                    "text": "Each block you add to your story includes a few extra text fields where you can enter additional information about the content of that block. This optional information is called ‘Metadata’ and it helps screen readers, search engines and other assistive technologies find and access the content of each block."
                },
                {
                    "heading": "Embedding links with markdown",
                    "blockType": "text",
                    "text": "The Story Tool supports the use of markdown (for example, refer to the [Github Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links)). Markdown can be used in the text content of a text block, or in the heading or description fields of any story block (i.e. text, image, video, audio). You are free to use it in any way you wish, in any of these fields.\n\n\nFor our purposes here, we describe how to embed a link into text content using markdown, since this is currently the only way to embed a link in your story. We are working on more user-friendly ways of adding links, and your feedback and ideas are welcome!\n\n\nTo create a link, the **link text** (what the reader will see and select) is put in square brackets, followed by the **link address** in round brackets, with no space between them, like so:\n\n\n`[Learn more about the IDRC](https://idrc.ocadu.ca/)`\n\n\nWhich will appear as:\n[Learn more about the IDRC](https://idrc.ocadu.ca/)\n\n\nAdditionally, you can add a **link title** in quotes following the link address, which in some browsers will appear on hover, and will be read by screen readers. This can help give your readers a better idea of where the link is going to take them. In this example, “IDRC Website” is the title. Be sure to include a space between the link address and the title, like so:\n\n\n`[Learn more about the IDRC](https://idrc.ocadu.ca/ \"IDRC Website\")`\n\n\nWhich will appear in your story as:\n[Learn more about the IDRC](https://idrc.ocadu.ca/ \"IDRC Website\")\n\n\n[This article by the Nielsen Norman Group](https://www.nngroup.com/articles/title-attribute/ \"Using the Title Attribute to Help Users Predict Where They Are Going\") describes the use of link titles in detail."
                },
                {
                    "heading": "Add Story Title, Author Name and Keywords",
                    "blockType": "text",
                    "text": "When you've added all the blocks to your story, select “Continue” to give your story a title, author name and some keywords. This information helps others find your story and attribute it to you when they are reusing it. If you plan to enter several keywords, make sure they are separated by a comma."
                },
                {
                    "heading": "Preview Story",
                    "blockType": "text",
                    "text": "Selecting the “Preview My Story” button will display your story as it will appear when published. You can always select the “Back” button to go back to the previous section and continue editing your story."
                },
                {
                    "heading": "Publish Story",
                    "blockType": "text",
                    "text": "Once you are ready to publish your story on The Storytelling Project website, you can select the “Publish My Story” button. Please note that published stories are licensed under Creative Commons Attribution BY 4.0. This means others can reuse the content, make modifications, and attribute to the original author. Published stories are not editable and you cannot remove them from the site.\n\nIf you wish to remove your story from the website, please send an email to the address listed on the footer to request removal of your story."
                },
                {
                    "heading": "Saving Your Story",
                    "blockType": "text",
                    "text": "A draft of your story is saved automatically as you work. Text entered into an active text field will not be saved until you navigate out of that text field.\n\nIf you close the Story Tool browser window without publishing your story, your draft will be loaded the next time you open the story tool, as long as you are using the same browser on the same device. At the moment, files (such as videos, images or audio clips) will not be saved with your story, so you will have to add them back in again after loading your story (see Currently Known Bugs section)."
                },
                {
                    "heading": "Browse Stories",
                    "blockType": "text",
                    "text": "Select the “Browse Stories” button to browse through a collection of published stories by various contributors."
                },
                {
                    "heading": "Currently Known Bugs",
                    "blockType": "text",
                    "text": "Thank you for your patience as we work on improving the Story Tool! Any feedback you can provide is very helpful. You can contact us at stories@idrc.ocadu.ca.\n#### Keyboard focus\n* Using the keyboard to navigate through the Story Builder, you will notice that when focus lands on the first block it encompasses all the buttons as well as the editable block fields.\n* This allows you to navigate from block to block using your keyboard up/down arrow keys, and to reorder your blocks using keyboard shortcuts (see Reorder Content Blocks section for more details).\n* At the moment, however, tabbing from one block to another will not move focus to the whole block, rather it will move focus to the first element within the block.\n* In addition, Shift-tab will not move focus to the whole block.\n* Currently, to focus the whole block, the author must use the keyboard to navigate back to the delete key and then back into the story edit area, or select the desired block using the mouse (mouse click in the upper bar of the block, or on the reorder handle).\n#### Up/down reorder buttons activation\n* The up/down reorder buttons on a newly added block will remain inactive until focus lands on any story block. To focus on a block, you can click/touch anywhere within the block or navigate to it with the keyboard.\n#### Auto-saving\n* At the moment, files (such as videos, images or audio clips) will not be saved with your story. If you close the Story Tool and return, only the text content of your story will be reloaded. You will have to add them back in again after loading your story.\n* Text entered into an active text field will not be saved until you navigate out of that text field.\n"
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
    if (doc.value.published) {
        var browseDoc = {
            "title": doc.value.title,
            "author": doc.value.author,
            "tags": doc.value.tags,
            "content": doc.value.content
        };

        emit(doc._id, browseDoc);
    }
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
