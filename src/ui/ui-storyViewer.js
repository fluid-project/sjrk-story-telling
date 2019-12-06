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
            onStoryViewerPreviousRequested: null,
            onStoryUpdatedFromBlocks: null
        },
        listeners: {
            "onReadyToBind.bindStoryViewerPreviousControl": {
                "this": "{that}.dom.storyViewerPrevious",
                "method": "click",
                "args": ["{that}.events.onStoryViewerPreviousRequested.fire"]
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
                    //             text: "Here are some story words that form a sentence"
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
                    //             description: "A small band led by a guitar playing a 'sting' sound, then ending"
                    //         },
                    //         {
                    //             blockType: "video",
                    //             language: "pt",
                    //             heading: "Fourth block",
                    //             mediaUrl: "/tests/video/shyguy_and_rootbeer.mp4",
                    //             alternativeText: "Two cats sitting in a window on a sunny day, one of them grooming the other",
                    //             description: "Shyguy and Rootbeer sitting in the window, Rootbeer grooming Shyguy, both seem happy"
                    //         }
                    //     ],
                    //     author: "The usual author",
                    //     language: "en",
                    //     tags: ["test", "story", "simple"]
                    // }
                }
            },
            orator: {
                type: "fluid.orator",
                container: "{that}.dom.storyContainer",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    selectors: {
                        content: ".sjrkc-st-story-details"
                    },
                    // Disabling the selectionReader due to issues with positioning of play button in the editor
                    // preview.
                    // see: https://issues.fluidproject.org/browse/SJRK-283
                    components: {
                        selectionReader: {
                            type: "fluid.emptySubcomponent"
                        }
                    }
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
                        templatePath: "%resourcePrefix/templates/storyViewer.handlebars"
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

    // a UI for previewing block-based stories within the Story Edit page
    fluid.defaults("sjrk.storyTelling.ui.storyPreviewer", {
        gradeNames: ["sjrk.storyTelling.ui.storyViewer"],
        model: {
            shareButtonDisabled: false
        },
        modelListeners: {
            shareButtonDisabled: [{
                this: "{that}.dom.storyShare",
                method: "prop",
                args: ["disabled", "{change}.value"]
            }]
        },
        selectors: {
            storyShare: ".sjrkc-st-story-share",
            storySaveNoShare: ".sjrkc-st-story-save-no-share",
            progressArea: ".sjrkc-st-story-share-progress",
            responseArea: ".sjrkc-st-story-share-response",
            responseText: ".sjrkc-st-story-share-response-text"
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
            onSaveNoShareRequested: null
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
            "onStoryViewerPreviousRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire",
            "onShareRequested": [{
                func: "{that}.applier.change",
                args: ["shareButtonDisabled", true],
                namespace: "showProgressArea"
            },{
                func: "{that}.hideServerResponse",
                namespace: "hideServerResponse"
            }],
            "onShareComplete": [{
                func: "{that}.hideProgressArea",
                namespace: "hideProgressArea"
            },{
                func: "{that}.setServerResponse",
                args: ["{arguments}.0"],
                namespace: "setServerResponse"
            },{
                func: "{that}.showServerResponse",
                namespace: "showServerResponse"
            }]
        },
        invokers: {
            showProgressArea: {
                this: "{that}.dom.progressArea",
                method: "show",
                args: [0]
            },
            hideProgressArea: {
                this: "{that}.dom.progressArea",
                method: "hide",
                args: [0]
            },
            showServerResponse: {
                this: "{that}.dom.responseArea",
                method: "show",
                args: [0]
            },
            hideServerResponse: {
                this: "{that}.dom.responseArea",
                method: "hide",
                args: [0]
            },
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        components: {
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            isEditorPreview: true
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
