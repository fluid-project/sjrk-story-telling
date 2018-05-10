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
                    author: "First Author",
                    tags: ["Heart","Book"],
                    contentTypes: ["text","image"]
                },
                story2: {
                    title: "Second story about other things",
                    author: "Second Author",
                    tags: ["Cats"]
                },
                story3: {
                    title: "Third story to try out a different thumbnail image",
                    tags: ["Dots","Yayoi Kusama"],
                    thumbnailUrl: "/tests/img/obliterationroom.jpg"
                },
                story4: {
                    title: "Fourth story",
                    author: "Fourth Author"
                },
                story5: {
                    title: "Fifth story",
                    tags: ["Dots"],
                    thumbnailUrl: "/tests/img/obliterationroom.jpg"
                }
            }
        },
        browserConfig: {
            placeholderThumbnailUrl: "../img/icons/icon-heartBook-thumbnail.png"
        },
        components: {
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{storyBrowser}.model", "{storyBrowser}.options.browserConfig"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBrowser.handlebars"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
