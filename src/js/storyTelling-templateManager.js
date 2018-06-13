/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // A grade which coordinates the loading of a handlebars template and
    // localized UI text, then uses a client-side gpii.handlebars renderer
    // to insert the resulting combined markup into the DOM
    fluid.defaults("sjrk.storyTelling.templateManager", {
        gradeNames: "fluid.viewComponent",
        model: {
            locale: "en"
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
                funcName: "{that}.renderTemplate",
                args: [{}]
            }
        },
        templateStrings: {
            localizedMessages: null // for localized interface messages
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
                    locale: "{templateManager}.model.locale",
                    defaultLocale: "en",
                    terms: {
                        resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                    },
                    listeners: {
                        "onResourcesLoaded.loadLocalizationMessages": {
                            "func": "sjrk.storyTelling.templateManager.loadLocalizedMessages",
                            "args": ["{that}.resources.componentMessages.resourceText",
                                "{templateManager}",
                                "options.templateStrings.localizedMessages"]
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
                    terms: {
                        resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                    },
                    listeners: {
                        "onResourcesLoaded.injectTemplate": {
                            funcName: "sjrk.storyTelling.templateManager.injectTemplate",
                            args: ["{templateRenderer}",
                                "{that}.resources.componentTemplate.resourceText",
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
                type: "gpii.handlebars.renderer.standalone",
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
                args: ["{that}", "{that}.options.templateStrings.localizedMessages", "{arguments}"]
            },
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templateManager.renderTemplateOnSelf",
                args: ["{that}", "{that}.options.templateConfig.templateName", "{that}.events.onTemplateRendered", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    /* Injects the provided template content to the partial templates collection of the template renderer
     * - "templateRenderer": the template renderer
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "templateName": the template's name
     */
    sjrk.storyTelling.templateManager.injectTemplate = function (templateRenderer, templateContent, templateName, completionEvent) {
        templateRenderer.templates.partials[templateName] = templateContent;

        completionEvent.fire();
    };

    /* Prepares the dynamic values and localized messages to be rendered into the
     * template and then calls the renderTemplateOnSelf invoker. The invoker
     * provides specifics about how to render the template.
     * Values in localizedMessages are resolved against those in dynamicValues.
     * E.g. given 'msg_auth:"%author"' in localizedMessages and 'author:"Someone"' in
     * dynamicValues, the result is 'msg_auth:"Someone"'.
     * - "templateManagerComponent": the templateManager component
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "dynamicValues": other values which are likely to change often.
     * - "completionEvent": component even to fire when complete
    */
    sjrk.storyTelling.templateManager.renderTemplate = function (templateManager, localizedMessages, dynamicValues) {
        var combinedDynamicValues = sjrk.storyTelling.templateManager.combineDynamicValues(dynamicValues, localizedMessages);
        localizedMessages = sjrk.storyTelling.templateManager.resolveTerms(localizedMessages, combinedDynamicValues);

        templateManager.renderTemplateOnSelf(localizedMessages, combinedDynamicValues);
    };

    /* Renders a template into the templateManager's container with a gpii.handlebars
     * client-side renderer, and fires completionEvent when done.
     * Values in localizedMessages are resolved against those in dynamicValues.
     * E.g. given 'msg_auth:"%author"' in localizedMessages and 'author:"Someone"' in
     * dynamicValues, the result is 'msg_auth:"Someone"'.
     * - "templateManagerComponent": the templateManager component
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "dynamicValues": other values which are likely to change often.
     * - "completionEvent": component even to fire when complete
    */
    sjrk.storyTelling.templateManager.renderTemplateOnSelf = function (templateManager, templateName, completionEvent, localizedMessages, dynamicValues) {
        templateManager.templateRenderer.html(templateManager.container, templateName, {
            localizedMessages: localizedMessages,
            dynamicValues: dynamicValues
        });

        completionEvent.fire();
    };

    /* Given a collection of values or objects, `dynamicValues`, combines them into
     * a single endpoint. If dynamicValues is not truthy, then it returns undefined
     * - "dynamicValues": a collection of objects/values to be combined. Every item
     *   in this collection should have a key by which it may be addressed. Strings
     *   passed directly in without being in a collection will be split up.
     */
    sjrk.storyTelling.templateManager.combineDynamicValues = function (dynamicValues) {
        var combinedDynamicValues = undefined;

        if (dynamicValues) {
            fluid.each(dynamicValues, function (dynamicValue) {
                combinedDynamicValues = $.extend(combinedDynamicValues, dynamicValue);
            });
        }

        return combinedDynamicValues;
    };

    /* Given a set of terms that may contain a mix of strings and references in
     * the fluid.stringTemplate syntax, resolves the stringTemplate referenecs
     * against another set of terms.
     * - "termsToResolve": the terms that will be resolved
     * - "toResolveAgainst": the terms the first set will be resolved against
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

    /* Merges localized UI messages into a component at a given path. Any values
     * already extant at the path in question are preserved. If there are any
     * keys which are duplicated, they will be overwritten by the new value.
     * - "componentMessages": a collection of messages to be merged in
     * - "component": the infusion component to be affected
     * - "path": the EL path on the component where messages will be merged
     */
    sjrk.storyTelling.templateManager.loadLocalizedMessages = function (componentMessages, component, path) {
        var mergedEndpoint = componentMessages ? $.extend({}, fluid.get(component, path), JSON.parse(componentMessages)) : fluid.get(component, path);
        fluid.set(component, path, mergedEndpoint);
    };

    /* A gpii.handlebars.helper grade which registers a helper function */
    fluid.defaults("sjrk.storyTelling.templateManager.getIdsHelper", {
        gradeNames: ["gpii.handlebars.helper"],
        helperName: "getIds",
        invokers: {
            "getHelper": {
                funcName: "sjrk.storyTelling.templateManager.getIdsHelper.getLabelIds",
                args: ["{that}"]
            }
        }
    });

    /* Handlebars block helper function to generate a unique ID (GUID) for
     * use in labeling form elements in the component template. Any
     * instances of the value "$id" in the block will be replaced with this ID.
     * - "prefixForId": prefix to prepend before the GUID
     */
    sjrk.storyTelling.templateManager.getIdsHelper.getLabelIds = function () {
        return function (prefixForId, options) {
            if (prefixForId && typeof prefixForId === "string") {
                prefixForId = prefixForId + "-" + fluid.allocateGuid();
            } else {
                prefixForId = fluid.allocateGuid();
            }

            return options.fn().replace(/\$id/g, prefixForId);
        };
    };

    /* A gpii.handlebars.helper grade which replaces one string with another */
    fluid.defaults("sjrk.storyTelling.templateManager.replaceHelper", {
        gradeNames: ["gpii.handlebars.helper"],
        helperName: "replace",
        invokers: {
            "getHelper": {
                funcName: "sjrk.storyTelling.templateManager.replaceHelper.replace",
                args: ["{that}"]
            }
        }
    });

    /* Handlebars block helper function to replace all instances of one value
     * within a given string with another new value.
     * - "source": the source string to be modified
     * - "originalValue": the value to be replaced
     * - "newValue": the new value to use instead of originalValue
     */
    sjrk.storyTelling.templateManager.replaceHelper.replace = function () {
        return function (source, originalValue, newValue) {
            var modifiedSource = source;
            return modifiedSource.replace(new RegExp(originalValue, "g"), newValue);
        };
    };

})(jQuery, fluid);
