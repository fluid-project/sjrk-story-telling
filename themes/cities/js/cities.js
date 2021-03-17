/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.cities.page", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        distributeOptions: [{
            target: "{that > menu > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/cities-menu.hbs"
        },
        {
            target: "{that > masthead > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/citiesMessages.json",
                templatePath: "%resourcePrefix/templates/cities-masthead.hbs"
            }
        },
        {
            target: "{that > footer > templateManager}.options.templateConfig",
            record: {
                messagesPath: "%resourcePrefix/messages/citiesMessages.json",
                templatePath: "%resourcePrefix/templates/cities-footer.hbs"
            }
        }],
        components: {
            // the masthead of the site
            masthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container"
            },
            // the footer of the site
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

    // Applies the Cities shell to the storyView page
    fluid.defaults("sjrk.storyTelling.cities.page.storyView", {
        gradeNames: ["sjrk.storyTelling.cities.page", "sjrk.storyTelling.base.page.storyView"],
        distributeOptions: {
            target: "{that > storyViewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/cities-storyViewer.hbs"
        }
    });

    // Applies the Cities shell to the storyNotFound page
    fluid.defaults("sjrk.storyTelling.cities.page.storyNotFound", {
        gradeNames: ["sjrk.storyTelling.cities.page", "sjrk.storyTelling.base.page.storyNotFound"]
    });

    // Applies the Cities shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.cities.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.cities.page", "sjrk.storyTelling.base.page.storyBrowse"],
        distributeOptions: {
            target: "{that > storyBrowser > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/cities-storyBrowser.hbs"
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

    // Applies the Cities shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.cities.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.cities.page", "sjrk.storyTelling.base.page.storyEdit"],
        distributeOptions: [{
            target: "{that > storyEditor > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/cities-storyEditor.hbs"
        },
        {
            target: "{that > storyPreviewer > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/cities-storyViewer.hbs"
        }]
    });

})(jQuery, fluid);
