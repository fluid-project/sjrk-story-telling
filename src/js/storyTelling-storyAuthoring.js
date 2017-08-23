/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.storyAuthoring", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        resourceLoaderConfig: {
            resourcePrefix: ".",
            locale: "en"
        },
        distributeOptions: [{
            source: "{that}.options.resourceLoaderConfig.resourcePrefix",
            target: "{that resourceLoader}.options.terms.resourcePrefix"
        },
        {
            source: "{that}.options.resourceLoaderConfig.locale",
            target: "{that resourceLoader}.options.locale"
        }],
        events: {
            onStorySubmitRequestedFromEditorNoView: null,
            onStorySubmitRequestedFromEditorViewExists: null,
            onStoryEditorReady: null,
            onStoryViewerReady: null,
            onVisibilityChanged: null
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor",
            storyViewer: ".sjrkc-storyTelling-storyViewer",
            storyEditorPage1: ".sjrk-storyTelling-storyEditorPage1",
            storyEditorPage2: ".sjrk-storyTelling-storyEditorPage2"
        },
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.story.storyEditor",
                container: "{that}.options.selectors.storyEditor",
                createOnEvent: "{storyAuthoring}.events.onTemplateRendered",
                options: {
                    listeners: {
                        "onStorySubmitRequested.fireStoryViewerEvent": {
                            "func": "sjrk.storyTelling.storyAuthoring.fireStoryViewerEvent",
                            "args": "{storyAuthoring}"
                        },
                        "onControlsBound.escalate": {
                            "func": "{storyAuthoring}.events.onStoryEditorReady.fire"
                        },
                        "onEditorNextRequested.showEditorNext": {
                            "func": "sjrk.storyTelling.storyAuthoring.showPage",
                            "args": ["{storyAuthoring}","storyEditorPage2"]
                        },
                        "onEditorPreviousRequested.showEditorPrevious": {
                            "func": "sjrk.storyTelling.storyAuthoring.showPage",
                            "args": ["{storyAuthoring}","storyEditorPage1"]
                        },
                        "onStorySubmitRequested.showViewer": {
                            "func": "sjrk.storyTelling.storyAuthoring.showPage",
                            "args": ["{storyAuthoring}","storyViewer"]
                        }
                    }
                }
            },
            storyViewer: {
                type: "sjrk.storyTelling.story.storyViewer",
                container: "{that}.options.selectors.storyViewer",
                createOnEvent: "{storyAuthoring}.events.onStorySubmitRequestedFromEditorNoView",
                options: {
                    model: {
                        title: "{storyEditor}.model.title",
                        content: "{storyEditor}.model.content",
                        author: "{storyEditor}.model.author",
                        tags: "{storyEditor}.model.tags",
                        language: "{storyEditor}.model.language"
                    },
                    listeners: {
                        "{storyAuthoring}.events.onStorySubmitRequestedFromEditorViewExists": {
                            func: "{that}.renderTemplateOnSelf"
                        },
                        "onTemplateRendered.escalate": {
                            "func": "{storyAuthoring}.events.onStoryViewerReady.fire"
                        },
                        "onViewerPreviousRequested.showEditorPrevious": {
                            "func": "sjrk.storyTelling.storyAuthoring.showPage",
                            "args": ["{storyAuthoring}","storyEditorPage2"]
                        }
                    }
                }
            },
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyTelling.html"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.storyAuthoring.fireStoryViewerEvent = function (storytellingComponent) {
        if (!storytellingComponent.storyViewer) {
            storytellingComponent.events.onStorySubmitRequestedFromEditorNoView.fire();
        } else {
            storytellingComponent.events.onStorySubmitRequestedFromEditorViewExists.fire();
        }
    };

    sjrk.storyTelling.storyAuthoring.hideAllPages = function (component) {
        component.locate("storyEditorPage1").hide();
        component.locate("storyEditorPage2").hide();
        component.locate("storyViewer").hide();
    };

    sjrk.storyTelling.storyAuthoring.showPage = function (component, pageSelector) {
        sjrk.storyTelling.storyAuthoring.hideAllPages(component);
        component.locate(pageSelector).show();
        component.events.onVisibilityChanged.fire();
    };

})(jQuery, fluid);
