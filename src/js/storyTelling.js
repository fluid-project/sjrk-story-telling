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

    fluid.defaults("sjrk.storyTelling", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            onStoryTemplateAppended: null,
            onStorySubmitRequestedFromEditorNoView: null,
            onStorySubmitRequestedFromEditorViewExists: null
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor"
        },
        listeners: {
            "onCreate.appendStoryTemplate": {
                "this": "{that}.container",
                "method": "append",
                "args": ["<div class='sjrkc-storyTelling-storyEditor'></div><div class='sjrkc-storyTelling-storyViewer'></div>"]
            },
            "onCreate.fireOnStoryTemplateAppend": {
                "func": "{that}.events.onStoryTemplateAppended.fire",
                "priority": "after:appendStoryTemplate"
            }
        },
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.story.storyEditor",
                container: ".sjrkc-storyTelling-storyEditor",
                createOnEvent: "{storyTelling}.events.onStoryTemplateAppended",
                options: {
                    listeners: {
                        "onStorySubmitRequested.fireStoryViewerEvent": {
                            "func": "sjrk.storyTelling.fireStoryViewerEvent",
                            "args": "{storyTelling}"
                        }
                    }
                }
            },
            storyViewer: {
                type: "sjrk.storyTelling.story.storyViewer",
                container: ".sjrkc-storyTelling-storyViewer",
                createOnEvent: "{storyTelling}.events.onStorySubmitRequestedFromEditorNoView",
                options: {
                    model: {
                        title: "{storyEditor}.model.title",
                        content: "{storyEditor}.model.content",
                        author: "{storyEditor}.model.author",
                        tags: "{storyEditor}.model.tags"
                    },
                    listeners: {
                        "{storyTelling}.events.onStorySubmitRequestedFromEditorViewExists": {
                            func: "{that}.renderTemplateOnSelf"
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.fireStoryViewerEvent = function (storytellingComponent) {
        if (!storytellingComponent.storyViewer) {
            storytellingComponent.events.onStorySubmitRequestedFromEditorNoView.fire();
        } else {
            storytellingComponent.events.onStorySubmitRequestedFromEditorViewExists.fire();
        }
    };

})(jQuery, fluid);
