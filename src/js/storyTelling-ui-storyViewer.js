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
            onStoryListenToRequested: null
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
            templateManager: {
                options: {
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
                        // TODO: pick a more accurate name for this listener
                        "onCreate.renderStoryContent": {
                            "funcName": "sjrk.storyTelling.ui.createBlocksFromData",
                            "args": ["{story}.model.content", "{storyViewer}.options.blockTypeLookup", "{blockManager}.events.viewComponentContainerRequested"]
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

    // TODO: rename this grade!!!
    // TODO: The purpose of this grade is to illustrate the similarities between
    //      it and the uiManager. Once "complete", we can pull the similar bits
    //      out into a "shell" grade that is then used by other new grades which
    //      will each represent a particular workflow/use case within the tool
    fluid.defaults("sjrk.storyTelling.uiHolder", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            uiLanguage: "en" //initial state is English (TODO: is there a better way?)
        },
        selectors: {
            menu: ".sjrkc-storyTelling-menu-links",
            storyViewer: ".sjrkc-storyTelling-story-viewer",
            learningReflectionsMasthead: ".sjrkc-learningReflections-pageHeading-container",
            learningReflectionsFooter: ".sjrkc-learningReflections-pageFooter-container"
        },
        events: {
            onStoryListenToRequested: null,
            onAllUiComponentsReady: {
                events: {
                    onViewerReady: "{storyViewer}.events.onControlsBound"
                }
            },
            onContextChangeRequested: null // TODO: think of a better name
        },
        listeners: {
            "{storyViewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            },
            "{menu}.events.onInterfaceLanguageChangeRequested": {
                func: "{that}.applier.change",
                args: ["uiLanguage", "{arguments}.0.data"]
            }
        },
        modelListeners: {
            uiLanguage: [
                {
                    funcName: "sjrk.storyTelling.uiManager.renderAllUiTemplates",
                    args: ["{that}"]
                },
                {
                    funcName: "{that}.events.onContextChangeRequested.fire"
                }
            ]
        },
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{menu}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{storyViewer}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsMasthead}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsFooter}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: "{uiHolder}.options.selectors.menu"
            },
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: "{uiHolder}.options.selectors.storyViewer",
                options: {
                    components: {
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
                                            imageUrl: "https://www.google.ca/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                                            alternativeText: "Google logo",
                                            description: "This is the logo for Google"
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
            },
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: "{uiHolder}.options.selectors.learningReflectionsMasthead",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-masthead.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // footer section
            learningReflectionsFooter: {
                type: "sjrk.storyTelling.ui",
                container: "{uiHolder}.options.selectors.learningReflectionsFooter",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-footer.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
