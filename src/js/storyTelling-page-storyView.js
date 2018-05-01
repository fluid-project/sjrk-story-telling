/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.page.storyView", {
        gradeNames: ["sjrk.storyTelling.page"],
        events: {
            onAllUiComponentsReady: {
                events: {
                    onViewerReady: "{storyViewer}.events.onControlsBound"
                }
            }
        },
        listeners: {
            "{storyViewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            }
        },
        modelRelay: [{
            source: "{that}.model.uiLanguage",
            target: "{storyViewer}.templateManager.model.locale",
            singleTransform: {
                type: "fluid.transforms.identity"
            }
        }],
        components: {
            storySpeaker: {
                options: {
                    modelRelay: {
                        target: "{that}.model.ttsText",
                        singleTransform: {
                            type: "fluid.transforms.stringTemplate",
                            template: "{storyViewer}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
                            terms: "{storyViewer}.story.model"
                        }
                    }
                }
            },
            // the story view context
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: ".sjrkc-storyTelling-story-viewer",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../.."
                                }
                            }
                        },
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        templateConfig: {
                                                            resourcePrefix: "../.."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        // TODO: remove this section once tests have been added
                        story: {
                            options: {
                                model: {
                                    title: "A simple story",
                                    content:
                                    [
                                        {
                                            blockType: "text",
                                            language: "en",
                                            heading: "First block",
                                            text: "Here are some story words that form a sentence",
                                            simplifiedText: "Story words"
                                        },
                                        {
                                            blockType: "image",
                                            language: "de",
                                            heading: "Second block",
                                            imageUrl: "../../tests/img/obliterationroom.jpg",
                                            alternativeText: "The Obliteration Room at the Yayoi Kusama Infinity Rooms exhibit",
                                            description: "This is a photo of the Obliteration Room at the Art Gallery of Ontario"
                                        }
                                    ],
                                    author: "The usual author",
                                    language: "en",
                                    tags: ["test", "story", "simple"]
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
