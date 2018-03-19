/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // To be used for binding the story editor model to the UI
    fluid.defaults("sjrk.storyTelling.binder", {
        gradeNames: ["gpii.binder"],
        model: {
            languageFromSelect: "",
            languageFromInput: ""
        },
        events: {
            onUiReadyToBind: null,
            onBindingApplied: null
        },
        listeners: {
            "onUiReadyToBind.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}"
            },
            "onUiReadyToBind.fireOnBindingApplied": {
                func: "{that}.events.onBindingApplied.fire",
                priority: "after:applyBinding"
            }
        }
    });

})(jQuery, fluid);
