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
                funcName: "{that}.renderTemplateOnSelf"
            }
        },
        templateStrings: {},
        components: {
            messageLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        // The messages file (JSON)
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
                                "options.templateStrings"]
                        },
                        "onResourcesLoaded.escalate": "{templateManager}.events.onMessagesLoaded.fire"
                    }
                }
            },
            templateLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        // The handlebars template file
                        componentTemplate: "{templateManager}.options.templateConfig.templatePath"
                    },
                    // This should be being handled by options distribution
                    terms: {
                        resourcePrefix: "{templateManager}.options.templateConfig.resourcePrefix"
                    },
                    listeners: {
                        "onResourcesLoaded.escalate": "{templateManager}.events.onTemplateLoaded.fire"
                    }
                }
            },
            templateRenderer: {
                type: "gpii.handlebars.renderer.standalone"
            }
        },
        invokers: {
            // Invoker used to render the component's template and fire
            // the onTemplateRendered event that the applyBinding's listener
            renderTemplateOnSelf: {
                funcName: "sjrk.storyTelling.templateManager.renderTemplate",
                args: ["{that}.events.onTemplateRendered",
                    "{that}.container",
                    "componentTemplate",
                    "{templateLoader}.resources.componentTemplate.resourceText",
                    "{that}.options.templateStrings",
                    "{that}.templateRenderer"]
            }
        }
    });

    /* Renders a template with gpii-handlebars into the
     * specified container, and fires completionEvent when done
     * - "completionEvent": component even to fire when complete
     * - "container": container to render the template into
     * - "templateName": a handlebars template name
     * - "templateContent": the raw content of the template to be loaded at templateName
     * - "termsCollection": terms to use in the handlebars template,
     *            they will be passed through the resolveTerms function to
     *            resolve and substitute references to dynamic values in other terms
     * - "renderer": the gpii-handlebars client-side renderer component
    */
    sjrk.storyTelling.templateManager.renderTemplate = function (completionEvent, container,
        templateName, templateContent, termsCollection, renderer) {
        renderer.templates.partials.componentTemplate = templateContent;

        var resolvedTerms = sjrk.storyTelling.templateManager.resolveTerms(termsCollection);
        var renderedTemplate = renderer.render(templateName, resolvedTerms);

        container.html(renderedTemplate);
        completionEvent.fire();
    };

    // Given a set of terms that may contain a mix of strings, fluid.stringTemplate
    // syntax and other objects, resolve only the strings using stringTemplate
    // against the set of terms.
    sjrk.storyTelling.templateManager.resolveTerms = function (terms) {
        return fluid.transform(terms, function (term) {
            // TODO: Make this functionality recursive
            // if (typeof term === "array" || typeof term === "object") {
            //     return sjrk.storyTelling.templatedComponent.resolveTerms(term);
            // } else {
            if (typeof term === "string") {
                return fluid.stringTemplate(term, terms);
            } else {
                return term;
            }
            // }
        });
    };

    sjrk.storyTelling.templateManager.loadLocalizedMessages = function (componentMessages, component, path) {
        var mergedEndpoint = componentMessages ? $.extend({}, fluid.get(component, path), JSON.parse(componentMessages)) : fluid.get(component, path);
        fluid.set(component, path, mergedEndpoint);
    };

})(jQuery, fluid);
