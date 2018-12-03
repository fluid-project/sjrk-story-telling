/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */


(function ($, fluid) {

    "use strict";

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
        // Allows the browse link to be reconfigured
        menuConfig: {
            templateValues: {
                "menu_browseLinkUrl": "/src/html/storyBrowse.html"
            }
        },
        components: {
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplate": {
                            funcName: "{that}.renderTemplate",
                            args: ["{menu}.options.menuConfig.templateValues"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/menu.handlebars"
                    }
                }
            }
        }
    });
})(jQuery, fluid);
