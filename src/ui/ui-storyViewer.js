/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI for viewing/previewing block-based stories
    fluid.defaults("sjrk.storyTelling.ui.storyViewer", {
        gradeNames: ["sjrk.storyTelling.ui.storyUi"],
        selectors: {
            storyTags: ".sjrkc-st-story-list-tags",
            storyViewerPrevious: ".sjrkc-st-story-viewer-previous"
        },
        events: {
            onStoryViewerPreviousRequested: null
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
                    //             mediaUrl: "/tests/img/obliterationroom.jpg",
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
            // a text-to-speech component for reading the story content aloud
            orator: {
                type: "fluid.orator",
                container: "{that}.dom.storyContainer",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    selectors: {
                        content: ".sjrkc-st-story-details"
                    }
                }
            },
            // the templateManager for this UI
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyViewer.hbs"
                    }
                }
            },
            // for dynamically rendering the story block by block
            blockManager: {
                container: "{storyViewer}.options.selectors.storyContent",
                options: {
                    blockTypeLookup: {
                        "audio": "sjrk.storyTelling.blockUi.audioBlockViewer",
                        "image": "sjrk.storyTelling.blockUi.imageBlockViewer",
                        "text": "sjrk.storyTelling.blockUi.textBlockViewer",
                        "video": "sjrk.storyTelling.blockUi.videoBlockViewer"
                    },
                    listeners: {
                        "onCreate.createBlocksFromData": {
                            func: "{that}.createBlocksFromData",
                            args: ["{story}.model.content"]
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
            shareButtonDisabled: false,
            progressAreaVisible: false,
            responseAreaVisible: false,
            // publishingState can be one of the following values:
            // "unpublished" (the initial state), "publishing", "responseReceived"
            publishingState: "unpublished"
        },
        modelRelay: {
            "publishingState": {
                target: "",
                source: "publishingState",
                singleTransform: {
                    type: "fluid.transforms.valueMapper",
                    defaultInputPath: "",
                    match: {
                        "unpublished": {
                            outputValue: {
                                shareButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: false
                            }
                        },
                        "publishing": {
                            outputValue: {
                                shareButtonDisabled: true,
                                progressAreaVisible: true,
                                responseAreaVisible: false
                            }
                        },
                        "responseReceived": {
                            outputValue: {
                                shareButtonDisabled: false,
                                progressAreaVisible: false,
                                responseAreaVisible: true
                            }
                        }
                    }
                }
            }
        },
        modelListeners: {
            shareButtonDisabled: {
                this: "{that}.dom.storyShare",
                method: "prop",
                args: ["disabled", "{change}.value"]
            },
            progressAreaVisible: {
                this: "{that}.dom.progressArea",
                method: "toggle",
                args: ["{change}.value"]
            },
            responseAreaVisible: {
                this: "{that}.dom.responseArea",
                method: "toggle",
                args: ["{change}.value"]
            }
        },
        selectors: {
            storyShare: ".sjrkc-st-story-share",
            progressArea: ".sjrkc-st-story-share-progress",
            responseArea: ".sjrkc-st-story-share-response",
            responseText: ".sjrkc-st-story-share-response-text"
        },
        events: {
            onShareRequested: null,
            onShareComplete: null
        },
        listeners: {
            "onReadyToBind.bindShareControl": {
                "this": "{that}.dom.storyShare",
                "method": "click",
                "args": ["{that}.events.onShareRequested.fire"]
            },
            "onShareRequested.setStatePublishing": {
                func: "{that}.applier.change",
                args: ["publishingState", "publishing"]
            },
            "onShareComplete": [{
                func: "{that}.applier.change",
                args: ["publishingState", "responseReceived"],
                namespace: "setStateResponseReceived"
            },{
                func: "{that}.setServerResponse",
                args: ["{arguments}.0.message"],
                namespace: "setServerResponse"
            }]
        },
        invokers: {
            setServerResponse: {
                this: "{that}.dom.responseText",
                method: "text",
                args: ["{arguments}.0"]
            }
        },
        components: {
            // the templateManager for this UI
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
