"use strict";

(function ($, fluid) {

    fluid.defaults("fluid.uiOptions.prefsEditor.multilingualDemo", {
        gradeNames: ["fluid.uiOptions.prefsEditor"],
        terms: {
            "messagePrefix": "node_modules/infusion/src/framework/preferences/messages",
            // We need to add some additional CSS to the
            // 'SeparatedPanelPrefsEditorFrame' template,
            // but since we can't specify multiple template
            // directories, we need to copy them all to our
            // own directory
            "templatePrefix": "node_modules/infusion/src/framework/preferences/html"
        },
        model: {
            locale: "en",
            direction: "ltr"
        },
        events: {
            onInterfaceLanguageChangeRequested: null
        },
        "tocTemplate": "node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
        "tocMessage": "node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json",
        "ignoreForToC": {
            "overviewPanel": ".flc-overviewPanel"
        },
        listeners: {
            "onPrefsEditorReady.addLanguageAttributesToBody": {
                func: "fluid.uiOptions.prefsEditor.multilingualDemo.addLanguageAttributesToBody",
                args: ["{that}.prefsEditorLoader.prefsEditor.container", "{that}.model.locale", "{that}.model.direction"]
            }
        },
        // TODO: file a Jira for this bit since it's not right
        distributeOptions: [{
            target: "{that uiEnhancer > tableOfContents > messageLoader}.options.model",
            record: {
                resourceLoader: {
                    locale: "{multilingualDemo}.model.locale"
                }
            },
            namespace: "tocLocale"
        },{
            target: "{that prefsEditorLoader > messageLoader}.options.model",
            record: {
                resourceLoader: {
                    locale: "{multilingualDemo}.model.locale"
                }
            },
            namespace: "aUniqueName"
        },{
            target: "{that uiEnhancer > tableOfContents}.options.modelListeners",
            record: {
                "{messageLoader}.model.resourceLoader.locale": {
                    func: "{that}.events.onCreateTOC.fire",
                    // TODO: new name
                    namespace: "relayOnCreateTocWithAnotherUniqueName"
                }
            },
            // TODO: new name
            namespace: "relayOnCreateToc"
        }]
    });

    // Adds the locale and direction to the BODY in the IFRAME to enable CSS
    // based on the locale and direction
    fluid.uiOptions.prefsEditor.multilingualDemo.addLanguageAttributesToBody = function (prefsEditorContainer, locale, direction) {
        prefsEditorContainer.attr("lang", locale);
        prefsEditorContainer.attr("dir", direction);
    };

})(jQuery, fluid);
