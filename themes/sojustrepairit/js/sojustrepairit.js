/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.sojustrepairit.page", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        distributeOptions: [{
            target: "{that > menu > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/sojustrepairit-menu.handlebars"
        },
        {
            target: "{that > masthead > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/sojustrepairitMessages.json",
                templatePath: "%resourcePrefix/templates/sojustrepairit-masthead.handlebars"
            }
        },
        {
            target: "{that > footer > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/sojustrepairitMessages.json",
                templatePath: "%resourcePrefix/templates/sojustrepairit-footer.handlebars"
            }
        }],
        components: {
            masthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container"
            },
            footer: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-footer-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        resourcePrefix: "{that}.options.templateConfig.resourcePrefix"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the sojustrepairit shell to the storyView page
    fluid.defaults("sjrk.storyTelling.sojustrepairit.page.storyView", {
        gradeNames: ["sjrk.storyTelling.sojustrepairit.page", "sjrk.storyTelling.base.page.storyView"],
        distributeOptions: {
            target: "{that > storyViewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/sojustrepairit-storyViewer.handlebars"
        }
    });

    // Applies the sojustrepairit shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.sojustrepairit.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.sojustrepairit.page", "sjrk.storyTelling.base.page.storyBrowse"],
        distributeOptions: {
            target: "{that > storyBrowser > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/sojustrepairit-storyBrowser.handlebars"
        },
        components: {
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "src/img/icons/Book.svg"
                    }
                }
            }
        }
    });

    // Applies the sojustrepairit shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.sojustrepairit.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.sojustrepairit.page", "sjrk.storyTelling.base.page.storyEdit"],
        distributeOptions: [{
            target: "{that > storyEditor > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/sojustrepairit-storyEditor.handlebars"
        },
        {
            target: "{that > storyPreviewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/sojustrepairit-storyViewer.handlebars"
        }]
    });

})(jQuery, fluid);
