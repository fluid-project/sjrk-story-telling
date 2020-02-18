/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    fluid.defaults("fluid.uiOptions.prefsEditor.multilingualDemo", {
        gradeNames: ["fluid.uiOptions.prefsEditor"],
        terms: {
            "messagePrefix": "node_modules/infusion/src/framework/preferences/messages",
            "templatePrefix": "node_modules/infusion/src/framework/preferences/html"
        },
        "tocTemplate": "node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
        "tocMessage": "node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json",
        "ignoreForToC": {
            "overviewPanel": ".flc-overviewPanel"
        },
        model: {
            locale: "en",
            direction: "ltr"
        },
        events: {
            onUioReady: null
        },
        listeners: {
            "onPrefsEditorReady.addLanguageAttributesToBody": {
                func: "fluid.uiOptions.prefsEditor.multilingualDemo.addLanguageAttributesToBody",
                args: ["{that}.prefsEditorLoader.prefsEditor.container", "{that}.model.locale", "{that}.model.direction"]
            },
            "onPrefsEditorReady.escalate": "{that}.events.onUioReady"
        },
        distributeOptions: {
            "messageLoaderLocale": {
                target: "{that messageLoader}.options.model",
                record: {
                    resourceLoader: {
                        locale: "{multilingualDemo}.model.locale"
                    }
                }
            },
            "relayOnCreateToc": {
                target: "{that uiEnhancer > tableOfContents}.options.modelListeners",
                record: {
                    "{messageLoader}.model.resourceLoader.locale": {
                        func: "{that}.events.onCreateTOC.fire",
                        excludeSource: "init",
                        namespace: "relayOnCreateTocListener"
                    }
                }
            },
            "prefsEditorLoader.prefsEditor.listeners": {
                target: "{that prefsEditorLoader > prefsEditor}.options.listeners",
                record: {
                    "{messageLoader}.events.onResourcesLoaded": [{
                        func: "{separatedPanel}.events.onCreateSlidingPanelReady",
                        namespace: "recreateSlidingPanel"
                    },
                    {
                        func: "{prefsEditorLoader}.events.onReady.fire",
                        priority: "after:recreateSlidingPanel",
                        namespace: "onSlidingPanelReady"
                    },
                    {
                        func: "{that}.events.onPrefsEditorRefresh",
                        priority: "after:onSlidingPanelReady",
                        namespace: "rerenderUIO"
                    },
                    {
                        func: "{fluid.uiOptions.prefsEditor.multilingualDemo}.events.onUioReady.fire",
                        priority: "after:rerenderUIO",
                        namespace: "escalate"
                    }]
                }
            }
        }
    });

    // Adds the locale and direction to the BODY in the IFRAME to enable CSS
    // based on the locale and direction
    fluid.uiOptions.prefsEditor.multilingualDemo.addLanguageAttributesToBody = function (prefsEditorContainer, locale, direction) {
        prefsEditorContainer.attr("lang", locale);
        prefsEditorContainer.attr("dir", direction);
    };

})(jQuery, fluid);
