/*
Copyright 2018-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English
        },
        pageSetup: {
            resourcePrefix: ""
            // "authoringEnabled" is retrieved from sjrk.storyTelling.server.config.json5
            // via a request to "/clientConfig". It enables and disables the
            // authoring capabilities of the tool and must be present.
            //authoringEnabled: true
        },
        distributeOptions: {
            "ui.templateManager.authoringEnabled": {
                source: "{that}.options.pageSetup.authoringEnabled",
                target: "{that ui templateManager}.options.model.dynamicValues.authoringEnabled"
            },
            "ui.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui}.options.components.templateManager.options.templateConfig.resourcePrefix"
            },
            "ui.blockManager.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui blockManager}.options.dynamicComponents.managedViewComponents.options.components.templateManager.options.templateConfig.resourcePrefix"
            },
            "timeBased.stopMediaPlayerOnContextChange": {
                record: { "{page}.events.onContextChangeRequested": "{that}.stopMediaPlayer" },
                target: "{that sjrk.storyTelling.blockUi.timeBased}.options.listeners"
            },
            "ui.requestResourceLoadOnRenderAllUiTemplates": {
                record: { "{sjrk.storyTelling.base.page}.events.onRenderAllUiTemplates": "{templateManager}.events.onResourceLoadRequested.fire" },
                target: "{that sjrk.storyTelling.ui}.options.listeners"
            },
            "templateManager.uiLanguageToTemplateManager": {
                record: {
                    target: "{that}.model.locale",
                    singleTransform: {
                        type: "fluid.transforms.condition",
                        condition: "{page}.model.uiLanguage",
                        true: "{page}.model.uiLanguage",
                        false: undefined
                    },
                    namespace: "uiLanguageToTemplateManager"
                },
                target: "{that sjrk.storyTelling.templateManager}.options.modelRelay"
            }
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onMenuReady: "{menu}.events.onControlsBound",
                    onUioReady: "onUioReady"
                }
            },
            onPreferencesLoaded: null,
            onPreferenceLoadFailed: null,
            onContextChangeRequested: null, // this includes changes in visibility, language, etc.
            onUioReady: null,
            onUioPanelsUpdated: null,
            onRenderAllUiTemplates: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.base.page.getStoredPreferences",
                args: ["{that}", "{cookieStore}"]
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": [{
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"],
                namespace: "changeUiLanguage"
            },
            {
                func: "{that}.events.onContextChangeRequested.fire",
                namespace: "onContextChangeRequested",
                priority: "last"
            }]
        },
        modelListeners: {
            uiLanguage: {
                funcName: "{that}.events.onRenderAllUiTemplates",
                namespace: "renderAllUiTemplates"
            },
            "": {
                func: "{cookieStore}.set",
                args: [null, "{page}.model"],
                excludeSource: "init",
                namespace: "setCookie"
            }
        },
        components: {
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    gradeNames: ["fluid.dataSource.writable"],
                    cookie: {
                        name: "sjrk-st-settings",
                        path: "/",
                        expires: ""
                    }
                }
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: ".sjrkc-st-menu"
            },
            uio: {
                type: "fluid.uiOptions.prefsEditor.multilingualDemo",
                container: ".flc-prefsEditor-separatedPanel",
                options: {
                    model: {
                        locale: "{page}.model.uiLanguage"
                    },
                    components: {
                        prefsEditorLoader: {
                            options: {
                                components: {
                                    messageLoader: {
                                        options: {
                                            model: {
                                                resourceLoader: {
                                                    locale: "{page}.model.uiLanguage"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    distributeOptions: {
                        target: "{that prefsEditorLoader}.options.components.prefsEditor.options.listeners",
                        record: {
                            "onCreate.escalate": "{page}.events.onUioReady.fire",
                            "{messageLoader}.events.onResourcesLoaded": [{
                                func: "{that}.events.onPrefsEditorRefresh",
                                namespace: "rerenderUIO"
                            },
                            {
                                func: "{page}.events.onUioReady.fire",
                                namespace: "escalate"
                            },
                            // TODO: this isn't right
                            {
                                func: "{separatedPanel}.events.onCreateSlidingPanelReady",
                                priority: "before:updateMessageBases",
                                namespace: "recreateSlidingPanel"
                            },
                            // TODO: ditto
                            {
                                funcName: "fluid.prefs.separatedPanel.bindEvents",
                                args: ["{separatedPanel}.prefsEditor", "{iframeRenderer}.iframeEnhancer", "{separatedPanel}"],
                                priority: "after:recreateSlidingPanel",
                                namespace: "slidingPanelBindEvents"
                            },
                            {
                                func: "{page}.events.onUioPanelsUpdated.fire",
                                priority: "before:rerenderUIO",
                                namespace: "updateMessageBases"
                            }]
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.base.page.getStoredPreferences = function (pageComponent, cookieStore) {
        var promise = cookieStore.get();

        promise.then(function (response) {
            if (response !== undefined) {
                pageComponent.applier.change("", response);
            }
            pageComponent.events.onPreferencesLoaded.fire();
        }, function (error) {
            pageComponent.events.onPreferenceLoadFailed.fire(error);
        });
    };

})(jQuery, fluid);
