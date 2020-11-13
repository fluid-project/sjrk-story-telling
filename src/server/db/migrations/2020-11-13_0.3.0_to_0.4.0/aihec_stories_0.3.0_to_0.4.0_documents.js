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

"use strict";

require("infusion");
require("kettle");

require("fluid-couch-config");

// sets up the Storytelling Tool database migration using fluid-couch-config
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
        "8ddcf990-8e18-11ea-820b-c9772cf8ea15":
        {
            "type": "story",
            "value":
            {
                "id": "8ddcf990-8e18-11ea-820b-c9772cf8ea15",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "title":"Taking Care of Others",
                "content":
                [
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"text",
                        "text":"When the people were still getting around in wagons, there was a family who needed food before a snowstorm. The husband told his wife he would make a trip to the store to get food. The husband told his wife and children to stay home and she agreed. The husband left. "
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/8dd29950-8e18-11ea-820b-c9772cf8ea15.jpg",
                        "description":null,
                        "fileDetails":
                        {
                            "lastModified":1588604206480,
                            "lastModifiedDate":"2020-05-04T14:56:46.480Z",
                            "name":"oregon-trail-4217528_1920.jpg",
                            "size":3294364,
                            "type":"image/png"
                        },
                        "alternativeText":"Covered wagons"
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"text",
                        "text":"It was getting later and later the wife was getting worried. The husband got caught in the snowstorm on his way home. The snow was blowing hard and it was getting cold; he was losing feelings in his legs. He was trying to keep warm by the wagon when he heard someone singing. "
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/8dd44700-8e18-11ea-820b-c9772cf8ea15.jpg",
                        "alternativeText":null,
                        "description":null,
                        "fileDetails":
                        {
                            "lastModified":1588604260320,
                            "lastModifiedDate":"2020-05-04T14:57:40.320Z",
                            "name":"pine-tree-4666369_1920.jpg",
                            "size":3490136,
                            "type":"image/png"
                        }
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"text",
                        "text":"He saw a light on the top of the hill, so he went that way. When he got on top of the hill, he saw rabbits singing and dancing. He watched them all night and before he knew it the weather cleared up and he was able to get home. "
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/8dd75440-8e18-11ea-820b-c9772cf8ea15.jpg",
                        "description":null,
                        "fileDetails":
                        {
                            "lastModified":1588604294661,
                            "lastModifiedDate":"2020-05-04T14:58:14.661Z",
                            "name":"rabbit-2910054_1920.jpg",
                            "size":3790498,
                            "type":"image/png"
                        },
                        "alternativeText":"rabbit in snow"
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"text",
                        "text":"Before he left, he was told by the rabbits that they took pity on him and saved his life. When he returned home, he told what he saw and how the rabbits saved his life."
                    },
                    {
                        "id":null,
                        "language":null,
                        "heading":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/8dd901f0-8e18-11ea-820b-c9772cf8ea15.jpg",
                        "alternativeText":null,
                        "description":null,
                        "fileDetails":
                        {
                            "lastModified":1588604338333,
                            "lastModifiedDate":"2020-05-04T14:58:58.333Z",
                            "name":"snow-3704236_1920.jpg",
                            "size":4023021,"type":"image/png"
                        }
                    }
                ],
                "author":"Melody Hill told to her by her father, Ephraim Hill",
                "tags":[]
            }
        },
        "96f85d00-8a74-11ea-820b-c9772cf8ea15":
        {
            "type": "story",
            "value":
            {
                "id": "96f85d00-8a74-11ea-820b-c9772cf8ea15",
                "published": true,
                "timestampCreated": "2020-11-13T00:00:00.000Z",
                "timestampPublished": "2020-11-13T00:00:00.000Z",
                "content":
                [
                    {
                        "id":null,
                        "language":null,
                        "blockType":"text",
                        "heading":"Dagot'éé! (Hello! How's it going?)",
                        "text":"Here at San Carlos Apache College, we recognize and celebrate the unique opportunities that we offer to our students here at this Tribal College. Among these are the Apache language, history, and art classes that we are quite certain are not offered in any other institute of higher learning in the world! One of the initiatives that the College kickstarted in Spring 2019 was the encouragement and support of ALL staff to take one of these unique classes, as a way to more deeply connect with our local community and culture. It was an honor for me to be among the first to take Apache Language 101 as an employee!"
                    },
                    {
                        "id":null,
                        "language":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/95669970-8a74-11ea-820b-c9772cf8ea15.jpg",
                        "fileDetails":
                        {
                            "lastModified":1547658304550,
                            "lastModifiedDate":"2019-01-16T17:05:04.550Z",
                            "name":"20190116_0855_9198.jpg",
                            "size":2145749,"type":"image/png"
                        },
                        "heading":"Getting Ready for Class",
                        "description":"Armed with a notebook, voice recorder, video camera, and one of the few Apache-English dictionaries in existence, I took my task as a language learner seriously. I stayed up many long nights reviewing my recordings and immersing myself in the language.",
                        "alternativeText":"Photo of a tabletop with a notebook full of notes in the Apache language, Apache language flash cards, a voice recorder, a USB flash drive, and a pen."
                    },
                    {
                        "id":null,
                        "language":null,
                        "blockType":"image",
                        "mediaUrl":"./uploads/95686e30-8a74-11ea-820b-c9772cf8ea15.png",
                        "fileDetails":
                        {
                            "lastModified":1588135604350,
                            "lastModifiedDate":"2020-04-29T04:46:44.350Z",
                            "name":"Screen Shot 2020-04-28 at 9.46.38 PM.png",
                            "size":452443,
                            "type":"image/png"
                        },
                        "heading":"Learning about Family",
                        "description":"It is impossible to learn the Apache language without also learning about Apache culture. For example, I got to study the many kinship terms that are essential in Apache culture. I also learned about traditional Apache foods, animals, and songs.","alternativeText":"Family tree diagram with Apache kinship terms."
                    },
                    {
                        "id":null,
                        "language":null,
                        "mediaUrl":"./uploads/9569cdc0-8a74-11ea-820b-c9772cf8ea15.mov",
                        "alternativeText":null,
                        "blockType":"video",
                        "fileDetails":
                        {
                            "lastModified":1554949908168,
                            "lastModifiedDate":"2019-04-11T02:31:48.168Z",
                            "name":"20190408 Lily Apache Animals Book-YouTube Optimized.mov",
                            "size":460548106,
                            "type":"video/quicktime"
                        },
                        "heading":"Teaching Apache to My Daughter",
                        "description":"By the end of the semester, I wrote and illustrated a children's book using what I had learned in my Apache language class. I dedicated this labor of love to her and I was thrilled to see that she enjoyed it. In this video, I'm reading a draft of it to my 2-year-old daughter for the first time, and you can actually see us switch between English, Cantonese, Apache, and American Sign Language as we discuss the story! "
                    },
                    {
                        "id":null,
                        "language":null,
                        "blockType":"text",
                        "text":"I had no background in any Native American languages prior to this experience, so this class provided many difficult challenges. I did what I could to fully engage in the course, and reaped many rewards through this venture. To this day, I continue to learn new things in the Apache language, and it allows me to more richly connect with the people of the San Carlos Apache Tribe. Among the Tribe, I have been blessed with many friends, who have helped me along the way. Ahíyi’e! (Thank you!)","heading":"Continuing the Journey"
                    }
                ],
                "title":"Taking a Class in Apache Language (Nṉee Biyáti’)",
                "author":"Kenneth Chan",
                "tags":
                [
                    "apache",
                    "language",
                    "personal",
                    "learning",
                    "reflection"
                ]
            }
        },
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
    }
});
