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
            classPrefix: "sjrk",
            interfaceLanguage: null
        },
        distributeOptions: {
            source: "{that}.options.interfaceConfig.templateLanguage",
            target: "{that templateManager}.options.templateConfig.locale"
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
        selectors: {
            storyTitle: ".sjrkc-storyTelling-storyTitle",
            storyAuthor: ".sjrkc-storyTelling-storyAuthor",
            storyContent: ".sjrkc-storyTelling-storyContent",
            storySummary: ".sjrkc-storyTelling-storySummary",
            storyLanguage: ".sjrkc-storyTelling-storyLanguage",
            storyTags: ".sjrkc-storyTelling-storyTags",
            storyListenTo: ".sjrkc-storyTelling-storyListenTo",
            storyCategories: ".sjrkc-storyTelling-storyCategories"
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
        // Specified by using grade to bind form markup to component model;
        // see https://github.com/GPII/gpii-binder
        bindings: {},
        events: {
            onReadyToBind: null,
            onBindingApplied: null
        },
        // TODO: what about UI's that don't need binding? unnecessary execution
        // Split the binder out into a mixin grade
        listeners: {
            "onReadyToBind.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}.binder"
            },
            "onReadyToBind.fireOnBindingApplied": {
                func: "{that}.events.onBindingApplied.fire",
                priority: "after:applyBinding"
            },
            "onReadyToBind.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"]
            },
            "onReadyToBind.fireOnControlsBound": {
                "func": "{that}.events.onControlsBound.fire",
                "priority": "last"
            }
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                options: {
                    listeners: {
                        "onTemplateRendered.escalate": "{ui}.events.onReadyToBind.fire"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyMessages.json"
                    }
                }
            },
            story: {
                type: "sjrk.storyTelling.story"
            },
            binder: {
                type: "gpii.binder"
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

})(jQuery, fluid);
