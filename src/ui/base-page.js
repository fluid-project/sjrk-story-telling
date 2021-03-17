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
            resourcePrefix: ""
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
            "ui.templateManager.currentPage": {
                record: "{page}.model.persistedValues.currentPage",
                target: "{that ui > templateManager}.options.model.dynamicValues.currentPage"
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
                record: {
                    "{page}.events.onContextChangeRequested": {
                        listener: "{sjrk.storyTelling.blockUi.timeBased}.stopMediaPlayer",
                        namespace: "stopMediaPlayer"
                    }
                },
                target: "{that sjrk.storyTelling.blockUi.timeBased}.options.listeners"
            },
            "ui.requestResourceLoadOnRenderAllUiTemplates": {
                record: {
                    "{sjrk.storyTelling.base.page}.events.onRenderAllUiTemplates": {
                        listener: "{templateManager}.events.onResourceLoadRequested.fire"
                    }
                },
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
            onPreferencesReset: null
        },
        listeners: {
            "onCreate.getStoredPreferences": {
                funcName: "sjrk.storyTelling.base.page.getStoredPreferences",
                args: ["{that}", "{cookieStore}"]
            },
            "onCreate.setCurrentPage": {
                changePath: "persistedValues.currentPage",
                value: window.location.pathname + window.location.search
            },
            "onRenderAllUiTemplates.onContextChangeRequested": "{that}.events.onContextChangeRequested"
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
                    writable: true,
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
                container: ".sjrkc-st-menu",
                options: {
                    listeners: {
                        "onInterfaceLanguageChangeRequested.changeUiLanguage": {
                            func: "{page}.applier.change",
                            args: [["persistedValues", "uiLanguage"], "{arguments}.0.data"]
                        }
                    }
                }
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

    // Mix-in grade to include login/logout controls on the page
    //
    // This grade is designed as a mix-in in order to make optional the
    // inclusion of logout functionality on a given page (or, if combined with
    // the base-page grade, on every page), along with the user greeting and
    // sign up & login page links, as not all themes have user accounts enabled.
    fluid.defaults("sjrk.storyTelling.base.page.withAuthorControls", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        pageSetup: {
            logOutUrl: "/logout"
        },
        members: {
            initialModel: {
                // the Initial Model of the page only specifies the locale
                persistedValues: {
                    // The authorAccountName is set on account login and is used
                    // to display the greeting in the Author Controls section
                    authorAccountName: null,
                    // Tracks what page the author is currently viewing, mainly
                    // used for redirecting during the login or sign up process
                    currentPage: null
                }
            }
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onAuthorControlsReady: "{authorControls}.events.onControlsBound"
                }
            },
            onLogOutRequested: "{authorControls}.events.onLogOutRequested",
            onLogOutSuccess: null,
            onLogOutError: null
        },
        listeners: {
            // SJRK-404 TODO: clear session-id cookie on logOut, too
            "onLogOutRequested.initiateLogout": "{that}.initiateLogout",
            "onLogOutSuccess.clearAuthorAccountName": {
                changePath: "persistedValues.authorAccountName",
                value: null,
                source: "logout",
                priority: "before:redirectToLogin"
            },
            // refresh the page to reflect the change in authorization
            "onLogOutSuccess.redirectToLogin": {
                func: "{that}.redirectToUrl",
                args: ["/login.html"]
            }
        },
        invokers: {
            // initiates the log out process/logs the user out and reloads
            initiateLogout: {
                funcName: "sjrk.storyTelling.base.page.initiateLogout",
                args: ["{that}.options.pageSetup.logOutUrl", "{that}.events.onLogOutSuccess", "{that}.events.onLogOutError"]
            },
            // redirects the user to the specified URL
            redirectToUrl: {
                funcName: "sjrk.storyTelling.base.page.redirectToUrl",
                args: ["{arguments}.0"]
            }
        },
        components: {
            // the "author controls" section of the page
            authorControls: {
                type: "sjrk.storyTelling.ui.authorControls",
                container: ".sjrkc-st-author-controls-container",
                options: {
                    model: {
                        authorAccountName: "{page}.model.persistedValues.authorAccountName"
                    }
                }
            }
        }
    });

    /**
     * Redirects the author to the specified URL, or to the site root if the URL
     * is falsy
     *
     * @param {String} redirectUrl - the URL to redirect to
     */
    sjrk.storyTelling.base.page.redirectToUrl = function (redirectUrl) {
        window.location.href = redirectUrl || "/";
    };

    /**
     * Retrieves preferences stored in the cookie and applies them to the component
     *
     * @param {Component} pageComponent - the `sjrk.storyTelling.base.page` that will accept the preferences
     * @param {Component} cookieStore - a fluid.prefs.cookieStore containing the data to laod
     * @return {Promise} - the promise returned for getting the cookie data.
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

        return promise;
    };

    /**
     * Given error details from a jQuery.ajax server call,
     * extracts and returns a meaningful error message.
     *
     * @see {@link https://api.jquery.com/jquery.ajax/} under "error" for more details
     *
     * @param {jqXHR} jqXHR - the jqXHR from the server request
     * @param {String} textStatus - indicates the status of the request
     * @param {String} errorThrown - a general error message
     *
     * @return {String} - a string describing the error
     */
    sjrk.storyTelling.base.page.getErrorMessageFromXhr = function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseJSON && jqXHR.responseJSON.errors) {
            var message = "";

            fluid.each(jqXHR.responseJSON.errors, function (error) {
                message += error.dataPath[0] + " - " + error.message + " ";
            });

            return message;
        } else {
            return fluid.get(jqXHR, ["responseJSON", "message"]) || errorThrown || "Unknown server error";
        }
    };

    /**
     * Calls the logout function and fires a success or error
     * event depending on the outcome. Success event returns the email address,
     * error event returns error details
     *
     * @param {String} logOutUrl - the server URL to call to start a new session
     * @param {Object} successEvent - an infusion event to fire upon successful completion
     * @param {Object} failureEvent - an infusion event to fire on failure
     */
    sjrk.storyTelling.base.page.initiateLogout = function (logOutUrl, successEvent, failureEvent) {
        sjrk.storyTelling.base.page.logOut(logOutUrl).then(function () {
            successEvent.fire(logOutUrl);
        }, function (jqXHR, textStatus, errorThrown) {
            failureEvent.fire({
                isError: true,
                message: sjrk.storyTelling.base.page.getErrorMessageFromXhr(jqXHR, textStatus, errorThrown)
            });
        });
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
