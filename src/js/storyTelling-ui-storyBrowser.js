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
                    tags: ["story1tag1","story1tag2"]
                },
                story2: {
                    title: "Second story about other things",
                    author: "Second Author",
                    tags: ["story2tag1","story2tag2"]
                },
                story3: {
                    title: "Third story to try out a different thumbnail image",
                    tags: ["story3tag1"],
                    thumbnailUrl: "../../tests/img/obliterationroom.jpg"
                },
                story4: {
                    title: "Fourth story to complete the first row of the grid view",
                    author: "Fourth Author"
                },
                story5: {
                    title: "Fifth story to be the first in a new row in the grid view",
                    tags: ["story5tag1","story5tag2"],
                    thumbnailUrl: "../../tests/img/obliterationroom.jpg"
                },
                story6: {
                    title: "Six",
                    author: "Sixth Author",
                    tags: ["story6tag1","story6tag2"]
                },
                story7: {
                    title: "Seven",
                    tags: ["story7tag1","story7tag2"]
                },
                story8: {
                    title: "Eight",
                    tags: ["story8tag1","story8tag2"]
                },
                story9: {
                    title: "Nine",
                    author: "Ninth Author",
                    tags: ["story9tag1","story9tag2"],
                    thumbnailUrl: "../../tests/img/obliterationroom.jpg"
                },
                story0: {
                    title: "Ten Ten Ten Ten Ten Ten Ten Ten Ten",
                    author: "Tenth Author",
                    tags: ["story0tag1"]
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
