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

    // Represents a context or view of a story UI. Contains a story component
    // to represent the data and a templateManager to handle DOM interaction
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
            storyListenTo: ".sjrkc-storyTelling-storyListenTo",
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
            // Manages template loading and rendering
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{ui}.container",
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{story}.model"]
                        },
                        "onTemplateRendered.escalate": "{ui}.events.onReadyToBind.fire"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyMessages.json"
                    },
                    templateStrings: {
                        uiStrings: "{ui}.options.interfaceControlStrings"
                    }
                }
            },
            // represents the story data
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

    /* Given a collection of story block data, will fire a creation event for each,
     * specifying a grade name based on a lookup list. The format of the lookup list is:
     *     {
     *         "x": "the.full.x.block.grade.name",
     *         "y": "the.full.y.block.grade.name",
     *     }
     * - "storyBlocks": a collection of story block data, the format of the data
     *                  is as laid out in sjrk.storyTelling.story
     * - "gradeLookup": the list of blockType names and associated grades
     * - "createEvent": the event that is to be fired in order to create the blocks
     */
    sjrk.storyTelling.ui.createBlocksFromData = function (storyBlocks, gradeLookup, createEvent) {
        fluid.each(storyBlocks, function (blockData) {
            var gradeNames = gradeLookup[blockData.blockType];
            createEvent.fire(gradeNames, {modelValues: blockData});
        });
    };

})(jQuery, fluid);
