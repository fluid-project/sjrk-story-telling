/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // a UI for viewing/previewing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyViewer", {
        gradeNames: ["sjrk.storyTelling.ui"],
        selectors: {
            storyShare: ".sjrkc-st-story-share",
            storySaveNoShare: ".sjrkc-st-story-save-no-share",
            storyTags: ".sjrkc-st-story-list-tags",
            storyViewerPrevious: ".sjrkc-st-story-viewer-previous"
        },
        blockTypeLookup: {
            "audio": "sjrk.storyTelling.blockUi.audioBlockViewer",
            "image": "sjrk.storyTelling.blockUi.imageBlockViewer",
            "text": "sjrk.storyTelling.blockUi.textBlockViewer",
            "video": "sjrk.storyTelling.blockUi.videoBlockViewer"
        },
        events: {
            onShareRequested: null,
            onShareComplete: null,
            onSaveNoShareRequested: null,
            onStoryViewerPreviousRequested: null,
            onStoryListenToRequested: null,
            onStoryUpdatedFromBlocks: null
        },
        listeners: {
            "onReadyToBind.bindShareControl": {
                "this": "{that}.dom.storyShare",
                "method": "click",
                "args": ["{that}.events.onShareRequested.fire"]
            },
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
                type: "sjrk.storyTelling.story",
                options: {
                    model: null
                    // This content is here to aid in work on styling/aesthetics
                    // model: {
                    //     title: "A simple story",
                    //     content:
                    //     [
                    //         {
                    //             blockType: "text",
                    //             language: "en",
                    //             heading: "First block",
                    //             text: "Here are some story words that form a sentence",
                    //             simplifiedText: "Story words"
                    //         },
                    //         {
                    //             blockType: "image",
                    //             language: "de",
                    //             heading: "Second block",
                    //             imageUrl: "/tests/img/obliterationroom.jpg",
                    //             alternativeText: "The Obliteration Room at the Yayoi Kusama Infinity Rooms exhibit",
                    //             description: "This is a photo of the Obliteration Room at the Art Gallery of Ontario"
                    //         },
                    //         {
                    //             blockType: "audio",
                    //             language: "es",
                    //             heading: "Third block",
                    //             mediaUrl: "/tests/audio/Leslie_s_Strut_Sting.mp3",
                    //             alternativeText: "Leslie's Strut Sting from the YouTube Audio Library",
                    //             description: "A small band led by a guitar playing a 'sting' sound, then ending",
                    //             transcript: "Musical notes"
                    //         },
                    //         {
                    //             blockType: "video",
                    //             language: "pt",
                    //             heading: "Fourth block",
                    //             mediaUrl: "/tests/video/shyguy_and_rootbeer.mp4",
                    //             alternativeText: "Two cats sitting in a window on a sunny day, one of them grooming the other",
                    //             description: "Shyguy and Rootbeer sitting in the window, Rootbeer grooming Shyguy, both seem happy",
                    //             transcript: "Background noise"
                    //         }
                    //     ],
                    //     author: "The usual author",
                    //     language: "en",
                    //     tags: ["test", "story", "simple"]
                    // }
                }
            },
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            story: "{story}.model"
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
