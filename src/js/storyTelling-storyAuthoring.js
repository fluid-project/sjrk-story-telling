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
        invokers: {
            showPage: {
                "funcName": "sjrk.storyTelling.storyAuthoring.manageVisibility",
                "args": [
                    "@expand:fluid.censorKeys({storyAuthoring}.options.visibilityManagedSelectors, {arguments}.0)",
                    "{arguments}.0",
                    "{storyAuthoring}"]
            }
        },
        selectors: {
            storyEditor: ".sjrkc-storyTelling-storyEditor",
            storyViewer: ".sjrkc-storyTelling-storyViewer",
            storyEditorPage1: ".sjrkc-storyTelling-storyEditorPage1",
            storyEditorPage2: ".sjrkc-storyTelling-storyEditorPage2",
            storyEditorHeading: ".sjrkc-storyTelling-storyEditor-headingContainer"
        },
        visibilityManagedSelectors: {
            expander: {
                funcName: "sjrk.storyTelling.storyAuthoring.getVisibilityManagedSelectors",
                args: ["{that}.options.pageVisibilityStates"]
            }
        },
        pageVisibilityStates: {
            storyEditorPage1: ["storyEditorHeading", "storyEditorPage1"],
            storyEditorPage2: ["storyEditorHeading", "storyEditorPage2"],
            storyViewer: ["storyViewer"]
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
                            "func": "{storyAuthoring}.showPage",
                            "args": ["{storyAuthoring}.options.pageVisibilityStates.storyEditorPage2"]
                        },
                        "onEditorPreviousRequested.showEditorPrevious": {
                            "func": "{storyAuthoring}.showPage",
                            "args": ["{storyAuthoring}.options.pageVisibilityStates.storyEditorPage1"]
                        },
                        "onStorySubmitRequested.showViewer": {
                            "func": "{storyAuthoring}.showPage",
                            "args": ["{storyAuthoring}.options.pageVisibilityStates.storyViewer"]
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
                            "func": "{storyAuthoring}.showPage",
                            "args": ["{storyAuthoring}.options.pageVisibilityStates.storyEditorPage2"]
                        }
                    }
                }
            },
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyAuthoring.html"
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

    sjrk.storyTelling.storyAuthoring.getVisibilityManagedSelectors = function (pageVisibilityStates) {
        var combined = [];

        fluid.each(pageVisibilityStates, function (visibilityState) {
            combined = combined.concat(visibilityState);
        });

        // Approach via https://stackoverflow.com/a/14438954
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        combined = combined.filter(onlyUnique);

        return combined;
    };

    // hideSelectors: array of DOM selectors to hide
    // showSelectors: array of DOM selectors to show
    // component: viewComponent to manage visibility of selectors
    sjrk.storyTelling.storyAuthoring.manageVisibility = function (hideSelectors, showSelectors, component) {
        fluid.each(hideSelectors, function (selector) {
            component.locate(selector).hide();
        });

        fluid.each(showSelectors, function (selector) {
            component.locate(selector).show();
        });

        component.events.onVisibilityChanged.fire();
    };

})(jQuery, fluid);
