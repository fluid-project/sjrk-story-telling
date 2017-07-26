/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, floe */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            onStoryTemplateAppended: null
        },
        selectors: {
            story: ".sjrkc-storyTelling-story"
        },
        listeners: {
            "onCreate.appendStoryTemplate": {
                "this": "{that}.container",
                "method": "append",
                "args": ["<div class='sjrkc-storyTelling-story'></div>"]
            },
            "onCreate.fireOnStoryTemplateAppend": {
                "func": "{that}.events.onStoryTemplateAppended.fire",
                "priority": "after:appendStoryTemplate"
            }
        },
        components: {
            story: {
                type: "sjrk.storyTelling.story",
                container: ".sjrkc-storyTelling-story",
                createOnEvent: "{storyTelling}.events.onStoryTemplateAppended"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponent", {
        gradeNames: ["gpii.binder", "fluid.viewComponent"],
        templateConfig: {
            // Used to supply both control and style classes
            // by the getClasses invoker
            classPrefix: "sjrk"
        },
        // Specified by using grade
        // These will be passed as the second argument of
        // fluid.stringTemplate when rendering the page
        // template
        templateTerms: {
        },
        // Specified by using grade to bind form markup
        // to component model;
        // see https://github.com/GPII/gpii-binder
        bindings: {
        },
        events: {
            "onTemplateRendered": null
        },
        listeners: {
            "{templateLoader}.events.onResourcesLoaded": {
                funcName: "{that}.renderTemplate",
                args: ["{templateLoader}.resources.componentTemplate.resourceText", "{that}.options.templateTerms"]
            },
            // Applies bindings from gpii-binder after
            // the template is loaded
            "onTemplateRendered.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}"
            }

        },
        components: {
            templateLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        // Specified by using grade
                        // The template file using the
                        // fluid.stringTemplate syntax
                        // componentTemplate: ""
                    }
                }
            }
        },
        invokers: {
            // Invoker used to create a control and style class for
            // insertion into the template; configured using the
            // templateConfig.classPrefix option
            getClasses: {
                funcName: "sjrk.storyTelling.templatedComponent.getClasses",
                args: ["{that}.options.templateConfig.classPrefix", "{arguments}.0"]
            },
            getLabelId: {
                funcName: "sjrk.storyTelling.templatedComponent.getLabelId",
                args: ["{arguments}.0"]
            },
            // Invoker used to render the component's template and fire
            // the onTemplateRendered event that the applyBinding's listener
            // waits on
            renderTemplate: {
                funcName: "sjrk.storyTelling.templatedComponent.renderTemplate",
                args: ["{that}.events.onTemplateRendered", "{that}.container", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    /* Returns a control and style class based on a prefix and classname
     * Used for templating
     * - "prefix": typically the first piece of the project namespace ("sjrk")
     * - "className": classname to follow after the prefixes
    */
    sjrk.storyTelling.templatedComponent.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    /* Generates a unique ID (GUID) for use in labeling form
     * elements in the component template
     * - "prefix": prefix to prepend before the GUID
    */
    sjrk.storyTelling.templatedComponent.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    /* Renders a template with fluid.stringTemplate into the
     * specified container, and fires completionEvent when done
     * - "completionEvent": component even to fire when complete
     * - "container": container to render the template into
     * - "template": a template string in the fluid.stringTemplate style
     * - "terms": terms to use in fluid.stringTemplate
    */
    sjrk.storyTelling.templatedComponent.renderTemplate = function (completionEvent, container, template, terms) {
        var renderedTemplate = fluid.stringTemplate(template, terms);
        container.append(renderedTemplate);
        completionEvent.fire();
    };

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent"
        },
        bindings: {
            storyTitle: "title",
            storyAuthor: "author",
            storyContent: "content"
        },
        model: {
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            summary: "",
            translations: []
        },
        templateTerms: {
            storyTitleIdForLabel: "@expand:{that}.getLabelId(title)",
            storyAuthorIdForLabel: "@expand:{that}.getLabelId(author)",
            storyContentIdForLabel: "@expand:{that}.getLabelId(content)",
            storyTitleClass:
            "@expand:{that}.getClasses(storyTelling-storyTitle)",
            storyAuthorClass:
            "@expand:{that}.getClasses(storyTelling-storyAuthor)",
            storyContentClass:
            "@expand:{that}.getClasses(storyTelling-storyContent)",
            storySubmitButtonClass: "@expand:{that}.getClasses(storyTelling-submit)"
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "src/html/story.html"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
