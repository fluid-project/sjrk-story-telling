/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI representing the "menu" part of the page
    fluid.defaults("sjrk.storyTelling.ui.menu", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            languageLinkEnglish: ".sjrkc-st-menu-languages-en",
            languageLinkSpanish: ".sjrkc-st-menu-languages-es"
        },
        events: {
            onInterfaceLanguageChangeRequested: null
        },
        listeners: {
            "onReadyToBind.bindLanguageLinkEnglish": {
                "this": "{that}.dom.languageLinkEnglish",
                "method": "click",
                "args": ["en", "{that}.events.onInterfaceLanguageChangeRequested.fire"]
            },
            "onReadyToBind.bindLanguageLinkSpanish": {
                "this": "{that}.dom.languageLinkSpanish",
                "method": "click",
                "args": ["es", "{that}.events.onInterfaceLanguageChangeRequested.fire"]
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/menu.hbs"
                    }
                }
            }
        }
    });
})(jQuery, fluid);
