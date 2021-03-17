/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {
    // To be used for binding the story editor model to the UI
    fluid.defaults("sjrk.storyTelling.binder", {
        gradeNames: ["fluid.binder"],
        events: {
            onUiReadyToBind: null,
            onBindingApplied: null
        },
        listeners: {
            "onUiReadyToBind.applyBinding": {
                funcName: "fluid.binder.applyBinding",
                args: "{that}"
            },
            "onUiReadyToBind.fireOnBindingApplied": {
                func: "{that}.events.onBindingApplied.fire",
                priority: "after:applyBinding"
            }
        }
    });

})(jQuery, fluid);
