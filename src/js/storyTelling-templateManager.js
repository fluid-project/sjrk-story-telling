/*
Copyright 2017 OCAD University
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
    // to insert it into the DOM
    fluid.defaults("sjrk.storyTelling.templateManager", {
        gradeNames: "fluid.viewComponent",
        templateConfig: {
            templatePath: null,
            messagesPath: null,
            resourcePrefix: ".",
            locale: "en"
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
            onTemplateLoaded: null
        },
        listeners: {
            "onAllResourcesLoaded.renderTemplateOnSelf": {
                funcName: "{that}.renderTemplateOnSelf",
                args: [{}]
            }
        },
        templateStrings: {
            uiStrings: null, // for things like CSS classes and ID's
            localizedMessages: null // for localized interface messages
        },
        components: {
            // For loading localized message values
            messageLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        componentMessages: "{templateManager}.options.templateConfig.messagesPath"
                    },
                    locale: "{templateManager}.options.templateConfig.locale",
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
                options: {
                    resources: {
                        componentTemplate: "{templateManager}.options.templateConfig.templatePath"
                    },
                    terms: {
                        resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                    },
                    listeners: {
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
                        }
                    }
                }
            }
        },
        invokers: {
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templateManager.renderTemplate",
                args: ["{that}.events.onTemplateRendered",
                    "{that}.container",
                    "componentTemplate",
                    "{templateLoader}.resources.componentTemplate.resourceText",
                    "{that}.templateRenderer",
                    "{that}.options.templateStrings.uiStrings",
                    "{that}.options.templateStrings.localizedMessages",
                    "{arguments}.0"
                    ]
            }
        }
    });

    /* Renders a template into the specified container with a gpii.handlebars
     * client-side renderer, and fires completionEvent when done.
     * Values in localizedMessages are resolved against those in dynamicValues.
     * E.g. given 'msg_auth:"%author"' in localizedMessages and 'author:"Someone"' in
     * dynamicValues, the result is 'msg_auth:"Someone"'.
     * - "completionEvent": component even to fire when complete
     * - "container": container to render the template into
     * - "templateName": a handlebars template name
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "renderer": the gpii-handlebars client-side renderer component
     * - "uiStrings": CSS classes, ID's and other DOM-related values
     * - "localizedMessages": localized UI strings
     * - "dynamicValues": other values which are likely to change often.
     * TODO: this should be further decoupled from the specifics of gpii-handlebars at some point
    */
    sjrk.storyTelling.templateManager.renderTemplate = function (completionEvent, container,
        templateName, templateContent, renderer, uiStrings, localizedMessages, dynamicValues) {
        renderer.templates.partials[templateName] = templateContent;

        if (dynamicValues) {
            localizedMessages = sjrk.storyTelling.templateManager.resolveTerms(localizedMessages, dynamicValues);
        }

        var renderedTemplate = renderer.render(templateName, {
            uiStrings: uiStrings,
            localizedMessages: localizedMessages,
            dynamicValues: dynamicValues
        });

        container.html(renderedTemplate);
        completionEvent.fire();
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

})(jQuery, fluid);
