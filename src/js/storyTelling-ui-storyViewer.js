/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // a UI for viewing/previewing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyViewer", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            storySaveNoShare: ".sjrkc-storyTelling-storySaveNoShare",
            storyTags: ".sjrkc-storyTelling-storyListTags",
            storyViewerPrevious: ".sjrkc-storyTelling-storyViewerPrevious"
        },
        blockTypeLookup: {
            "text": "sjrk.storyTelling.blockUi.textBlockViewer",
            "image": "sjrk.storyTelling.blockUi.imageBlockViewer"
        },
        events: {
            onSaveNoShareRequested: null,
            onStoryViewerPreviousRequested: null,
            onStoryListenToRequested: null,
            onStoryUpdatedFromBlocks: null
        },
        listeners: {
            "onReadyToBind.bindSaveNoShareControl": {
                "this": "{that}.dom.storySaveNoShare",
                "method": "click",
                "args": ["{that}.events.onSaveNoShareRequested.fire"]
            },
            "onReadyToBind.bindStoryViewerPreviousControl": {
                "this": "{that}.dom.storyViewerPrevious",
                "method": "click",
                "args": ["{that}.events.onStoryViewerPreviousRequested.fire"]
            },
            "onReadyToBind.bindListenToControl": {
                "this": "{that}.dom.storyListenTo",
                "method": "click",
                "args": ["{that}.events.onStoryListenToRequested.fire"]
            }
        },
        components: {
            // represents the story data
            story: {
                type: "sjrk.storyTelling.story"
                // This content is here to aid in work on styling/aesthetics
                // ,options: {
                //     model: {
                //         title: "A simple story",
                //         content:
                //         [
                //             {
                //                 blockType: "text",
                //                 language: "en",
                //                 heading: "First block",
                //                 text: "Here are some story words that form a sentence",
                //                 simplifiedText: "Story words"
                //             },
                //             {
                //                 blockType: "image",
                //                 language: "de",
                //                 heading: "Second block",
                //                 imageUrl: "/tests/img/obliterationroom.jpg",
                //                 alternativeText: "The Obliteration Room at the Yayoi Kusama Infinity Rooms exhibit",
                //                 description: "This is a photo of the Obliteration Room at the Art Gallery of Ontario"
                //             }
                //         ],
                //         author: "The usual author",
                //         language: "en",
                //         tags: ["test", "story", "simple"]
                //     }
                // }
            },
            templateManager: {
                options: {
                    listeners: {
                        "onAllResourcesLoaded.renderTemplate": {
                            funcName: "{that}.renderTemplate",
                            args: ["{story}.model"]
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyViewer.handlebars"
                    }
                }
            },
            // for dynamically rendering the story block by block
            blockManager: {
                type: "sjrk.dynamicViewComponentManager",
                container: "{ui}.options.selectors.storyContent",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    listeners: {
                        "onCreate.createBlocksFromData": {
                            "funcName": "sjrk.storyTelling.ui.createBlocksFromData",
                            "args": ["{story}.model.content", "{storyViewer}.options.blockTypeLookup", "{blockManager}.events.viewComponentContainerRequested"]
                        },
                        "onCreate.updateStoryFromBlocks": {
                            "funcName": "sjrk.storyTelling.ui.updateStoryFromBlocks",
                            "args": ["{storyViewer}.story", "{that}.managedViewComponentRegistry", "{storyViewer}.events.onStoryUpdatedFromBlocks"],
                            "priority": "last"
                        }
                    },
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                components: {
                                    templateManager: {
                                        options: {
                                            model: {
                                                locale: "{ui}.templateManager.model.locale"
                                            }
                                        }
                                    },
                                    block: {
                                        options: {
                                            gradeNames: ["{that}.getBlockGrade"],
                                            invokers: {
                                                "getBlockGrade": {
                                                    funcName: "sjrk.storyTelling.ui.getBlockGradeFromEventModelValues",
                                                    args: ["{blockUi}.options.additionalConfiguration.modelValues"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
