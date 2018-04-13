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

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.learningReflections", {
        gradeNames: ["sjrk.storyTelling.uiManager"],
        selectors: {
            learningReflectionsMasthead: ".sjrkc-learningReflections-pageHeading-container",
            learningReflectionsIntro: ".sjrkc-learningReflections-introduction-container",
            learningReflectionsFooter: ".sjrkc-learningReflections-pageFooter-container"
        },
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsMasthead}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsIntro}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsFooter}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: "{learningReflections}.options.selectors.learningReflectionsMasthead",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-masthead.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // introductory content
            learningReflectionsIntro: {
                type: "sjrk.storyTelling.ui",
                container: "{learningReflections}.options.selectors.learningReflectionsIntro",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-introduction.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // footer section
            learningReflectionsFooter: {
                type: "sjrk.storyTelling.ui",
                container: "{learningReflections}.options.selectors.learningReflectionsFooter",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-footer.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
