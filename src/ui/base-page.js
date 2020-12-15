/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // The page base grade. This is for coordinating UI's and represents an HTML page
    fluid.defaults("sjrk.storyTelling.base.page", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            // Only values in this colleciton will be persisted by the cookieStore.
            //
            // Currently, those values are the `uiLanguage` in this grade and
            // `storyBrowseDisplayPreference` in `sjrk.storyTelling.base.page.storyBrowse`.
            //
            // The goal of separating them is to allow the use of other model values
            // such as the view state values in `sjrk.storyTelling.base.page.storyEdit`
            // without saving them.
            persistedValues: {
                uiLanguage: "en" // initial locale set to match the initialModel below
            }
        },
        members: {
            initialModel: {
                // the Initial Model of the page only specifies the locale
                persistedValues: {
                    uiLanguage: "en" // default locale is set to English
                }
            }
        },
        pageSetup: {
            resourcePrefix: "",
            logOutUrl: "/authors/logout"
            // "authoringEnabled" is retrieved from sjrk.storyTelling.server.config.json5
            // via a request to "/clientConfig". It enables and disables the
            // authoring capabilities of the tool and must be present.
            //authoringEnabled: true
        },
        distributeOptions: {
            "ui.templateManager.authoringEnabled": {
                source: "{that}.options.pageSetup.authoringEnabled",
                target: "{that ui > templateManager}.options.model.dynamicValues.authoringEnabled"
            },
            "ui.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui templateManager}.options.templateConfig.resourcePrefix"
            },
            "ui.blockManager.templateManager.resourcePrefix": {
                source: "{that}.options.pageSetup.resourcePrefix",
                target: "{that ui blockManager templateManager}.options.templateConfig.resourcePrefix"
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
                        condition: "{page}.model.persistedValues.uiLanguage",
                        true: "{page}.model.persistedValues.uiLanguage",
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
            onRenderAllUiTemplates: null,
            beforePreferencesReset: null,
            onPreferencesReset: null,
            onLogOut: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.base.page.getStoredPreferences",
                args: ["{that}", "{cookieStore}"]
            },
            // SJRK-404 TODO: clear session-id cookie on logOut, too
            "onLogOut.logOut": {
                func: "sjrk.storyTelling.base.page.storyEdit.logOut",
                priority: "last"
            },
            "{authorControls}.events.onLogOutRequested": {
                func: "{that}.events.onLogOut.fire",
                namespace: "onLogOutRequested"
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": [{
                func: "{that}.applier.change",
                args: [["persistedValues", "uiLanguage"], "{arguments}.0.data"],
                namespace: "changeUiLanguage"
            },
            {
                func: "{that}.events.onContextChangeRequested.fire",
                namespace: "onContextChangeRequested",
                priority: "last"
            }]
        },
        modelListeners: {
            "persistedValues.uiLanguage": {
                funcName: "{that}.events.onRenderAllUiTemplates",
                namespace: "renderAllUiTemplates"
            },
            "": {
                func: "{cookieStore}.set",
                args: [null, "{page}.model.persistedValues"],
                excludeSource: "init",
                namespace: "setCookie"
            }
        },
        components: {
            // cookie storage
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
            // the "author controls" section of the page
            authorControls: {
                type: "sjrk.storyTelling.ui.authorControls",
                container: ".sjrkc-st-author-controls-container"
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: ".sjrkc-st-menu"
            },
            // the UIO component
            uio: {
                type: "fluid.uiOptions.multilingualDemo",
                container: ".flc-prefsEditor-separatedPanel",
                options: {
                    model: {
                        locale: "{page}.model.persistedValues.uiLanguage"
                    },
                    listeners: {
                        "onUioReady.escalate": "{page}.events.onUioReady"
                    }
                }
            }
        }
    });

    /**
     * Retrieves preferences stored in the cookie and applies them to the component
     *
     * @param {Component} pageComponent - the `sjrk.storyTelling.base.page` that will accept the preferences
     * @param {Component} cookieStore - a fluid.prefs.cookieStore containing the data to laod
     */
    sjrk.storyTelling.base.page.getStoredPreferences = function (pageComponent, cookieStore) {
        var promise = cookieStore.get();

        promise.then(function (response) {
            if (response !== undefined) {
                pageComponent.applier.change("persistedValues", response);
            }
            pageComponent.events.onPreferencesLoaded.fire();
        }, function (error) {
            pageComponent.events.onPreferenceLoadFailed.fire(error);
        });
    };

    /**
     * Resets the page preferences and clears the page model, with event hooks
     * before and after the reset
     *
     * @param {Component} pageComponent - the `sjrk.storyTelling.base.page` to be reset
     */
    sjrk.storyTelling.base.page.resetPreferences = function (pageComponent) {
        var transaction = pageComponent.applier.initiate();
        pageComponent.events.beforePreferencesReset.fire(pageComponent);
        transaction.fireChangeRequest({path: "", type: "DELETE"});
        transaction.change("", fluid.copy(pageComponent.initialModel));
        transaction.commit();
        // setting the cookie expiry to epoch in order to delete it
        document.cookie = pageComponent.cookieStore.options.cookie.name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        pageComponent.events.onPreferencesReset.fire(pageComponent);
    };

    /**
     * Logs the author out of their account by calling the appropriate endpoint
     *
     * @param {String} logOutUrl - the server URL to call to end the session
     *
     * @return {jqXHR} - the jqXHR for the server request
     */
    sjrk.storyTelling.base.page.logOut = function (logOutUrl) {
        return $.ajax({
            url: logOutUrl,
            type: "POST"
        });
    };

})(jQuery, fluid);
