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
        listeners: {
            "onPrefsEditorReady.addLanguageAttributesToBody": {
                func: "fluid.uiOptions.prefsEditor.multilingualDemo.addLanguageAttributesToBody",
                args: ["{that}.prefsEditorLoader.prefsEditor.container", "{that}.model.locale", "{that}.model.direction"]
            }
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
                        namespace: "relayOnCreateTocListener"
                    }
                }
            },
            "prefsEditorLoader.prefsEditor.listeners": {
                target: "{that prefsEditorLoader > prefsEditor}.options.listeners",
                record: {
                    "{messageLoader}.events.onResourcesLoaded": [{
                        func: "{separatedPanel}.events.onCreateSlidingPanelReady",
                        priority: "before:updateMessageBases",
                        namespace: "recreateSlidingPanel"
                    },
                    {
                        func: "{prefsEditorLoader}.events.onReady.fire",
                        priority: "after:recreateSlidingPanel",
                        namespace: "onslidingPanelReady"
                    },
                    {
                        func: "{that}.events.onPrefsEditorRefresh",
                        priority: "after:onslidingPanelReady",
                        namespace: "rerenderUIO"
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
