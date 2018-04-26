/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // a UI for listing and browsing stories
    fluid.defaults("sjrk.storyTelling.ui.storyBrowser", {
        gradeNames: ["sjrk.storyTelling.ui"],
        model: {
            // the list of stories to be browsed (actually just models)
            /* we need:
                - the title
                - the different types of block which are present
                - tags
                - one image (for the thumbnail)
            */
            // TODO: remove this sample content when tests have been added
            stories: {
                story1: {
                    title: "First story about something",
                    content:
                    [
                        {
                            blockType: "text",
                            id: "id-123",
                            language: "en-CA",
                            heading: "An appropriate header",
                            text: "This is the main text of this block",
                            simplifiedText: "Main text."
                        }
                    ],
                    contentString: "", // a string representation of the story content
                    author: "",
                    language: "",
                    images: [],
                    tags: ["story1tag1","story1tag2"],
                    keywordString: "", // a string representation of the tags
                    categories: [],
                    summary: "",
                    timestampCreated: null,
                    timestampModified: null,
                    requestedTranslations: [
                        //"es": 2, // a list of language codes as keys with
                        //"fr": 5  // the number of requests for that language
                    ],
                    translationOf: null
                },
                story2: {
                    title: "Second story about other things",
                    content:
                    [
                        {
                            blockType: "text",
                            language: "en",
                            heading: "First block",
                            text: "Here are some story words that form a sentence",
                            simplifiedText: "Story words"
                        },
                        {
                            blockType: "image",
                            language: "de",
                            heading: "Second block",
                            imageUrl: "https://www.google.ca/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                            alternativeText: "Google logo",
                            description: "This is the logo for Google"
                        }
                    ],
                    contentString: "", // a string representation of the story content
                    author: "",
                    language: "",
                    images: [],
                    tags: ["story2tag1","story2tag2"],
                    keywordString: "", // a string representation of the tags
                    categories: [],
                    summary: "",
                    timestampCreated: null,
                    timestampModified: null,
                    requestedTranslations: [
                        //"es": 2, // a list of language codes as keys with
                        //"fr": 5  // the number of requests for that language
                    ],
                    translationOf: null
                }
            }
        },
        components: {
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{storyBrowser}.model"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBrowser.handlebars"
                    }
                }
            }
        }
        // a place to hold multiple stories which will be listed, along with links to them
        // that's it? do we need a dynamicViewComponentManager? handlebars can probably render them
    });

})(jQuery, fluid);
