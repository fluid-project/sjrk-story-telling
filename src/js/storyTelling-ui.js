/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */


(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui", {
        gradeNames: ["fluid.viewComponent"],
        interfaceConfig: {
            // Used to supply both control and style classes
            // by the getClasses invoker
            classPrefix: "sjrk"
        },
        // common selectors for all UI's
        selectors: {
            storyTitle: ".sjrkc-storyTelling-storyTitle",
            storyAuthor: ".sjrkc-storyTelling-storyAuthor",
            storyContent: ".sjrkc-storyTelling-storyContent",
            storySummary: ".sjrkc-storyTelling-storySummary",
            storyLanguage: ".sjrkc-storyTelling-storyLanguage",
            storyLanguageList: ".sjrkc-storyTelling-storyLanguageList",
            storyCategories: ".sjrkc-storyTelling-storyCategories",
            storyTags: ".sjrkc-storyTelling-storyTags"
        },
        // TODO: at some point, css values will be hardcoded in the template(s)
        interfaceControlStrings: {
            storyListenToClasses: "@expand:{that}.getClasses(storyTelling-storyListenTo)",
            storyTitleClasses: "@expand:{that}.getClasses(storyTelling-storyTitle)",
            storyAuthorClasses: "@expand:{that}.getClasses(storyTelling-storyAuthor)",
            storyContentClasses: "@expand:{that}.getClasses(storyTelling-storyContent)",
            storySummaryClasses: "@expand:{that}.getClasses(storyTelling-storySummary)",
            storyLanguageClasses: "@expand:{that}.getClasses(storyTelling-storyLanguage)",
            storyCategoryClasses: "@expand:{that}.getClasses(storyTelling-storyCategories)"
        },
        invokers: {
            // Invoker used to create a control and style class for
            // insertion into the template; configured using the
            // templateConfig.classPrefix option
            getClasses: {
                funcName: "sjrk.storyTelling.ui.getClasses",
                args: ["{that}.options.interfaceConfig.classPrefix", "{arguments}.0"]
            },
            getLabelId: {
                funcName: "sjrk.storyTelling.ui.getLabelId",
                args: ["{arguments}.0"]
            }
        },
        events: {
            onReadyToBind: null,
            onControlsBound: null,
            onVisibilityChanged: null
        },
        listeners: {
            "onReadyToBind.fireOnControlsBound": {
                func: "{that}.events.onControlsBound.fire",
                priority: "last"
            }
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{ui}.container",
                options: {
                    listeners: {
                        // TODO: determine if there is a cleaner way to implement this
                        //       preferably using fluid functions instead of jQuery,
                        //       and in a way that maintains a link, not one-time
                        "onAllResourcesLoaded.injectStoryModel": {
                            funcName: "$.extend",
                            args: ["{that}.options.templateStrings", "{story}.model"],
                            priority: "before:renderTemplateOnSelf"
                        },
                        "onTemplateRendered.escalate": "{ui}.events.onReadyToBind.fire"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyMessages.json"
                    },
                    templateStrings: "{ui}.options.interfaceControlStrings"
                }
            },
            story: {
                type: "sjrk.storyTelling.story.base"
            }
        }
    });

    /* Returns a control and style class based on a prefix and classname
     * Used for templating
     * - "prefix": typically the first piece of the project namespace ("sjrk")
     * - "className": classname to follow after the prefixes
     */
    sjrk.storyTelling.ui.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    /* Generates a unique ID (GUID) for use in labeling form
     * elements in the component template
     * - "prefix": prefix to prepend before the GUID
     */
    sjrk.storyTelling.ui.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    /* Hides and shows DOM elements as specified, using jQuery hide() and show()
     * - "hideElements": the DOM elements to be hidden
     * - "showElements": the DOM elements to be shown
     * - "completionEvent": the event to be fired upon successful completion
     */
    sjrk.storyTelling.ui.manageVisibility = function (hideElements, showElements, completionEvent) {
        fluid.each(hideElements, function (el) {
            el.hide();
        });

        fluid.each(showElements, function (el) {
            el.show();
        });

        completionEvent.fire();
    };

})(jQuery, fluid);
