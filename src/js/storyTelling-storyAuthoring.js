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
            resourcePrefix: "."
        },
        distributeOptions: {
            source: "{that}.options.resourceLoaderConfig.resourcePrefix",
            target: "{that resourceLoader}.options.terms.resourcePrefix"
        },
        events: {
            onStorySubmitRequestedFromEditorNoView: null,
            onStorySubmitRequestedFromEditorViewExists: null,
            onStoryEditorReady: null,
            onStoryViewerReady: null
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor",
            storyViewer: ".sjrkc-storyTelling-storyViewer"
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
                        tags: "{storyEditor}.model.tags"
                    },
                    listeners: {
                        "{storyAuthoring}.events.onStorySubmitRequestedFromEditorViewExists": {
                            func: "{that}.renderTemplateOnSelf"
                        },
                        "onTemplateRendered.escalate": {
                            "func": "{storyAuthoring}.events.onStoryViewerReady.fire"
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

})(jQuery, fluid);
