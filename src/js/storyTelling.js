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

    fluid.defaults("sjrk.storyTelling.componentTemplate", {
        gradeNames: ["gpii.binder", "fluid.viewComponent"],
        templateConfig: {
            // Specified by using grade
            // TODO: supply default
            // classPrefix: ""
        },
        // Specified by using grade
        templateTerms: {
        },
        // Specified by using grade; see https://github.com/GPII/gpii-binder
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
                        // componentTemplate: ""
                    }
                }
            }
        },
        invokers: {
            getClasses: {
                funcName: "sjrk.storyTelling.componentTemplate.getClasses",
                args: ["{that}.options.templateConfig.classPrefix", "{arguments}.0"]
            },
            getLabelId: {
                funcName: "sjrk.storyTelling.componentTemplate.getLabelId",
                args: ["{arguments}.0"]
            },
            renderTemplate: {
                funcName: "sjrk.storyTelling.componentTemplate.renderTemplate",
                args: ["{that}.events.onTemplateRendered", "{that}.container", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    sjrk.storyTelling.componentTemplate.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    sjrk.storyTelling.componentTemplate.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    sjrk.storyTelling.componentTemplate.renderTemplate = function (completionEvent, container, template, terms) {
        var renderedTemplate = fluid.stringTemplate(template, terms);
        container.append(renderedTemplate);
        completionEvent.fire();
    };

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["sjrk.storyTelling.componentTemplate"],
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
        templateConfig: {
            classPrefix: "sjrk"
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
