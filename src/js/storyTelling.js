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

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            storyTitle: ".sjrkc-storytelling-storyTitle",
            storyAuthor: ".sjrkc-storytelling-storyAuthor",
            storyContent: ".sjrkc-storytelling-storyContent"
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
            storyTitleIdForLabel: "@expand:sjrk.storyTelling.story.getLabelId(title)",
            storyAuthorIdForLabel: "@expand:sjrk.storyTelling.story.getLabelId(author)",
            storyContentIdForLabel: "@expand:sjrk.storyTelling.story.getLabelId(content)",
            storyTitleClass:
            "@expand:sjrk.storyTelling.story.getClasses({that}.options.templateConfig.classPrefix, storyTelling-storyTitle)",
            storyAuthorClass:
            "@expand:sjrk.storyTelling.story.getClasses({that}.options.templateConfig.classPrefix, storyTelling-storyAuthor)",
            storyContentClass:
            "@expand:sjrk.storyTelling.story.getClasses({that}.options.templateConfig.classPrefix, storyTelling-storyContent)"
        },
        listeners: {
            "{templateLoader}.events.onResourcesLoaded": {
                funcName: "sjrk.storyTelling.story.renderTemplate",
                args: ["{that}.container", "{templateLoader}.resources.storyTemplate.resourceText", "{that}.options.templateTerms"]
            }
        },
        components: {
            templateLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        // May need to be specified at instantiation
                        storyTemplate: "src/html/story.html"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.story.getClasses = function (prefix, className) {
        return prefix + "c-" + className + " " + prefix + "-" + className;
    };

    sjrk.storyTelling.story.getLabelId = function (prefix) {
        return prefix + "-" + fluid.allocateGuid();
    };

    sjrk.storyTelling.story.renderTemplate = function (container, template, terms) {
        var renderedTemplate = fluid.stringTemplate(template, terms);
        container.append(renderedTemplate);
    };

})(jQuery, fluid);
