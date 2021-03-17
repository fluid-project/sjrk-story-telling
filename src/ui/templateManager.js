/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // A grade which coordinates the loading of a handlebars template and
    // localized UI text, then uses a client-side fluid.handlebars renderer
    // to insert the resulting combined markup into the DOM
    fluid.defaults("sjrk.storyTelling.templateManager", {
        gradeNames: "fluid.viewComponent",
        model: {
            locale: "en",
            dynamicValues: {} // to be merged into the template
        },
        templateConfig: {
            templateName: "templateName", // arbitrary value
            templatePath: null,
            messagesPath: null,
            resourcePrefix: "."
        },
        events: {
            onAllResourcesLoaded: {
                events: {
                    onMessagesLoaded: "onMessagesLoaded",
                    onTemplateLoaded: "onTemplateLoaded"
                }
            },
            onMessagesLoaded: null,
            onTemplateRendered: null,
            onTemplateLoaded: null,
            onTemplateInjected: null,
            onResourceLoadRequested: null
        },
        listeners: {
            "onCreate.loadResources": {
                func: "{that}.events.onResourceLoadRequested.fire"
            },
            "onAllResourcesLoaded.renderTemplate": {
                funcName: "{that}.renderTemplate"
            }
        },
        members: {
            templateStrings: {
                localizedMessages: null // for localized interface messages
            }
        },
        components: {
            // For loading localized message values
            messageLoader: {
                type: "fluid.resourceLoader",
                createOnEvent: "onResourceLoadRequested",
                options: {
                    resources: {
                        componentMessages: "{templateManager}.options.templateConfig.messagesPath"
                    },
                    resourceOptions: {
                        locale: "{templateManager}.model.locale",
                        defaultLocale: "en",
                        terms: {
                            resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                        }
                    },
                    listeners: {
                        "onResourcesLoaded.loadLocalizationMessages": {
                            "func": "sjrk.storyTelling.templateManager.loadLocalizedMessages",
                            "args": ["{that}.resources.componentMessages.parsed",
                                "{templateManager}",
                                ["templateStrings", "localizedMessages"]],
                            "priority": "before:escalate"
                        },
                        "onResourcesLoaded.escalate": "{templateManager}.events.onMessagesLoaded.fire"
                    }
                }
            },
            // For loading the handlebars template
            templateLoader: {
                type: "fluid.resourceLoader",
                createOnEvent: "onResourceLoadRequested",
                options: {
                    resources: {
                        componentTemplate: "{templateManager}.options.templateConfig.templatePath"
                    },
                    resourceOptions: {
                        terms: {
                            resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                        }
                    },
                    listeners: {
                        "onResourcesLoaded.injectTemplate": {
                            funcName: "sjrk.storyTelling.templateManager.injectTemplate",
                            args: ["{templateRenderer}",
                                "{that}.resources.componentTemplate.parsed",
                                "{templateManager}.options.templateConfig.templateName",
                                "{templateManager}.events.onTemplateInjected"],
                            priority: "before:escalate"
                        },
                        "onResourcesLoaded.escalate": "{templateManager}.events.onTemplateLoaded.fire"
                    }
                }
            },
            // For rendering the handlebars template with all applicable values
            templateRenderer: {
                type: "fluid.handlebars.renderer",
                options: {
                    components: {
                        getIds: {
                            type: "sjrk.storyTelling.templateManager.getIdsHelper"
                        },
                        replace: {
                            type: "sjrk.storyTelling.templateManager.replaceHelper"
                        }
                    }
                }
            }
        },
        invokers: {
            renderTemplate: {
                funcName: "sjrk.storyTelling.templateManager.renderTemplate",
                args: ["{that}", "{that}.templateStrings.localizedMessages", "{that}.model.dynamicValues"]
            },
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templateManager.renderTemplateOnSelf",
                args: ["{that}", "{that}.options.templateConfig.templateName", "{that}.events.onTemplateRendered", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    /**
     * Injects the provided template content to the partial templates collection of the template renderer
     *
     * @param {Component} templateRenderer - an instance of fluid.handlebars.renderer
     * @param {String} templateContent - the raw content of the template to be loaded at templateName
     * @param {String} templateName - the template's name
     * @param {Object} completionEvent - an event to fire upon completion
     */
    sjrk.storyTelling.templateManager.injectTemplate = function (templateRenderer, templateContent, templateName, completionEvent) {
        templateRenderer.applier.change(["templates", "pages", templateName], templateContent);

        completionEvent.fire();
    };

    /**
     * Prepares the dynamic values and localized messages to be rendered into the
     * template and then calls the renderTemplateOnSelf invoker. The invoker
     * provides specifics about how to render the template.
     * Values in localizedMessages are resolved against those in dynamicValues.
     * E.g. given 'msg_auth:"%author"' in localizedMessages and 'author:"Someone"' in
     * dynamicValues, the result is 'msg_auth:"Someone"'.
     *
     * @param {Component} templateManager - an instance of sjrk.storyTelling.templateManager
     * @param {Object.<String, String>} localizedMessages - collection of localized message strings
     * @param {Object} dynamicValues - other values to include in the rendering
     */
    sjrk.storyTelling.templateManager.renderTemplate = function (templateManager, localizedMessages, dynamicValues) {
        localizedMessages = sjrk.storyTelling.templateManager.resolveTerms(localizedMessages, dynamicValues.story);
        templateManager.renderTemplateOnSelf(localizedMessages, dynamicValues);
    };

    /**
     * Renders a template into the templateManager's container with a fluid.handlebars
     * client-side renderer, and fires completionEvent when done.
     * Values in localizedMessages are resolved against those in dynamicValues.
     * E.g. given 'msg_auth:"%author"' in localizedMessages and 'author:"Someone"' in
     * dynamicValues, the result is 'msg_auth:"Someone"'.
     *
     * @param {Component} templateManager - an instance of sjrk.storyTelling.templateManager
     * @param {String} templateName - the name of the template to render
     * @param {Object} completionEvent - an event to fire upon completion
     * @param {Object.<String, String>} localizedMessages - collection of localized message strings
     * @param {Object} dynamicValues - other values which are likely to change often.
     */
    sjrk.storyTelling.templateManager.renderTemplateOnSelf = function (templateManager, templateName, completionEvent, localizedMessages, dynamicValues) {
        templateManager.templateRenderer.html(templateManager.container, templateName, {
            localizedMessages: localizedMessages,
            dynamicValues: dynamicValues
        });

        completionEvent.fire();
    };

    /**
     * Given a set of terms that may contain a mix of strings and references in
     * the fluid.stringTemplate syntax, resolves the stringTemplate referenecs
     * against another set of terms.
     *
     * @param {Object} termsToResolve - the terms that will be resolved
     * @param {Object} toResolveAgainst - the terms the first set will be resolved against
     *
     * @return {Object} - a collection of resolved terms
     */
    sjrk.storyTelling.templateManager.resolveTerms = function (termsToResolve, toResolveAgainst) {
        return fluid.transform(termsToResolve, function (term) {
            if (Array.isArray(term) || typeof term === "object") {
                return sjrk.storyTelling.templateManager.resolveTerms(term, toResolveAgainst);
            } else {
                if (typeof term === "string") {
                    return fluid.stringTemplate(term, toResolveAgainst);
                } else {
                    return term;
                }
            }
        });
    };

    /**
     * Merges localized UI messages into a templateManager at a given path. Any values
     * already extant at the path in question are preserved. If there are any
     * keys which are duplicated, they will be overwritten by the new value.
     *
     * @param {Object.<String, String>} componentMessages - a collection of messages to be merged in
     * @param {Component} templateManager - an instance of sjrk.storyTelling.templateManager
     * @param {String} path - the EL path on the component where messages will be merged
     */
    sjrk.storyTelling.templateManager.loadLocalizedMessages = function (componentMessages, templateManager, path) {
        var mergedEndpoint = componentMessages ? $.extend({}, fluid.get(templateManager, path), JSON.parse(componentMessages)) : fluid.get(templateManager, path);
        fluid.set(templateManager, path, mergedEndpoint);
    };

    // A fluid.handlebars.helper grade which registers a helper function
    fluid.defaults("sjrk.storyTelling.templateManager.getIdsHelper", {
        gradeNames: ["fluid.handlebars.helper"],
        helperName: "getIds",
        invokers: {
            "getHelper": {
                funcName: "sjrk.storyTelling.templateManager.getIdsHelper.getLabelIds",
                args: ["{that}"]
            }
        }
    });

    /**
     * Handlebars block helper function to generate a unique ID (GUID) for
     * use in labeling form elements in the component template. Any
     * instances of the value "$id" in the block will be replaced with this ID.
     *
     * @return {Function} - A function returning the freshly fully-formed ID
     */
    sjrk.storyTelling.templateManager.getIdsHelper.getLabelIds = function () {
        /**
         * Handlebars block helper function to generate a unique ID (GUID) for
         * use in labeling form elements in the component template. Any
         * instances of the value "$id" in the block will be replaced with this ID.
         *
         * @param {String} prefixForId - prefix to prepend before the GUID
         * @param {Object} options - configure the function for sourcing the string to modify
         *
         * @return {String} - the freshly fully-formed ID
         */
        return function (prefixForId, options) {
            if (prefixForId && typeof prefixForId === "string") {
                prefixForId = prefixForId + "-" + fluid.allocateGuid();
            } else {
                prefixForId = fluid.allocateGuid();
            }

            return options.fn().replace(/\$id/g, prefixForId);
        };
    };

    // A fluid.handlebars.helper grade which replaces one string with another
    fluid.defaults("sjrk.storyTelling.templateManager.replaceHelper", {
        gradeNames: ["fluid.handlebars.helper"],
        helperName: "replace",
        invokers: {
            "getHelper": {
                funcName: "sjrk.storyTelling.templateManager.replaceHelper.replace",
                args: ["{that}"]
            }
        }
    });

    /**
     * Handlebars block helper function to replace all instances of one value
     * within a given string with another new value.
     *
     * @return {Function} - A function for performing the string replacement
     */
    sjrk.storyTelling.templateManager.replaceHelper.replace = function () {
        /**
         * Handlebars block helper function to replace all instances of one value
         * within a given string with another new value.
         *
         * @param {String} source - the source string to be modified
         * @param {String} originalValue - the value to be replaced
         * @param {String} newValue - the new value to use instead of originalValue
         *
         * @return {String} - The resulting string content
         */
        return function (source, originalValue, newValue) {
            var modifiedSource = source;
            return modifiedSource.replace(new RegExp(originalValue, "g"), newValue);
        };
    };

})(jQuery, fluid);
