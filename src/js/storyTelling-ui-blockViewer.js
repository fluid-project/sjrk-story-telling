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
        // TODO: think of a better name for this key
        blockGrades: {
            "text": "sjrk.storyTelling.block.textBlock",
            "image": "sjrk.storyTelling.block.imageBlock"
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
                            "funcName": "sjrk.storyTelling.ui.blockViewer.createBlocksFromData",
                            "args": ["{story}.model.content", "{blockViewer}.options.blockGrades", "{blockManager}.events.viewComponentContainerRequested"]
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

    // TODO: Consider moving this somewhere that it may be accessed by the editor as well
    /* Given a collection of story block data, will fire a creation event for each,
     * specifying a grade name based on a lookup list. The format of the lookup list is:
     *     {
     *         "x": "the.full.x.block.grade.name",
     *         "y": "the.full.y.block.grade.name",
     *     }
     * - "storyBlocks": a collection of story block data, the format of the data
     *                  is as laid out in sjrk.storyTelling.story
     * - "gradeLookup": the list of blockType names and associated grades
     * - "createEvent": the event that is to be fired in order to create the blocks
     */
    sjrk.storyTelling.ui.blockViewer.createBlocksFromData = function (storyBlocks, gradeLookup, createEvent) {
        fluid.each(storyBlocks, function (blockData) {
            var gradeNames = gradeLookup[blockData.blockType];
            createEvent.fire(gradeNames, {modelValues: blockData});
        });
    };

})(jQuery, fluid);
