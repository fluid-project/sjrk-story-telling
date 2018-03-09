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

    fluid.defaults("sjrk.storyTelling.ui.blockViewer", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            storySaveNoShare: ".sjrkc-storyTelling-storySaveNoShare",
            storyTags: ".sjrkc-storyTelling-storyListTags",
            storyPreviewerPrevious: ".sjrkc-storyTelling-storyPreviewerPrevious"
        },
        interfaceControlStrings: {
        },
        events: {
            onSaveNoShareRequested: null,
            onPreviewerPreviousRequested: null,
            onStoryListenToRequested: null
        },
        listeners: {
            "onReadyToBind.bindSaveNoShareControl": {
                "this": "{that}.dom.storySaveNoShare",
                "method": "click",
                "args": ["{that}.events.onSaveNoShareRequested.fire"]
            },
            "onReadyToBind.bindPreviewerPreviousControl": {
                "this": "{that}.dom.storyPreviewerPrevious",
                "method": "click",
                "args": ["{that}.events.onPreviewerPreviousRequested.fire"]
            },
            "onReadyToBind.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"]
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockViewer.handlebars"
                    }
                }
            },
            blockManager: {
                type: "sjrk.dynamicViewComponentManager",
                container: "{ui}.options.selectors.storyContent",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    listeners: {
                        "onCreate.renderStoryContent": {
                            "funcName": "sjrk.storyTelling.ui.blockViewer.renderStoryContent",
                            "args": ["{story}.model.content", "{blockManager}.events.viewComponentContainerRequested"]
                        }
                    },
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                model: "{that}.options.additionalConfiguration.modelValues"
                            }
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.ui.blockViewer.renderStoryContent = function (storyBlocks, createEvent) {
        fluid.each(storyBlocks, function (blockData) {
            createEvent.fire(blockData.blockType, {modelValues: blockData});
        });
    };

})(jQuery, fluid);
