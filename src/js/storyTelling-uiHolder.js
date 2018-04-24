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
            // handles text to speech requests globally for the whole site
            storySpeaker: {
                type: "fluid.textToSpeech",
                createOnEvent: "{uiHolder}.events.onAllUiComponentsReady",
                options: {
                    model:{
                        ttsText: null,
                        utteranceOpts: {
                            lang: "{uiHolder}.model.uiLanguage"
                        }
                    },
                    modelRelay: {
                        ttsTextFromStory: {
                            target: "{that}.model.ttsText",
                            singleTransform: {
                                type: "fluid.transforms.stringTemplate",
                                template: "{storyViewer}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
                                terms: "{storyViewer}.story.model"
                            }
                        }
                    },
                    listeners: {
                        "{uiHolder}.events.onStoryListenToRequested": {
                            func: "{that}.queueSpeech",
                            args: ["{that}.model.ttsText", true]
                        }
                    }
                }
            },
            // the storytelling tool "main" menu
            menu: {
                type: "sjrk.storyTelling.ui.menu",
                container: "{uiHolder}.options.selectors.menu",
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
            },
            // the story view context
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: "{uiHolder}.options.selectors.storyViewer",
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
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-masthead.handlebars",
                                    resourcePrefix: "../.."
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
                                    templatePath: "%resourcePrefix/src/templates/learningReflections-footer.handlebars",
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
