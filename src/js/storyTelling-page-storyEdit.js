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

    fluid.defaults("sjrk.storyTelling.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.page"],
        events: {
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "{storyEditor}.events.onControlsBound",
                    onPreviewerReady: "{storyPreviewer}.events.onControlsBound"
                }
            },
            onVisibilityChanged: null
        },
        listeners: {
            "onContextChangeRequested.updateStoryFromBlocks": {
                func: "{storyEditor}.events.onUpdateStoryFromBlocksRequested.fire",
                priority: "first"
            },
            // TODO: add namespaces for each event from a component?
            "{storyEditor}.events.onStorySubmitRequested": [{
                func: "{storyPreviewer}.templateManager.renderTemplateOnSelf",
                args: ["{storyPreviewer}.story.model", {showFooter: true}]
            },
            {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyEditor}.container"],
                    ["{storyPreviewer}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            }],
            "{storyPreviewer}.events.onStoryViewerPreviousRequested": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [
                    ["{storyPreviewer}.container"],
                    ["{storyEditor}.container"],
                    "{that}.events.onVisibilityChanged"
                ]
            },
            "{storyPreviewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire"
            }
        },
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{storyEditor}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{storyPreviewer}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            storySpeaker: {
                options: {
                    modelRelay: {
                        target: "{that}.model.ttsText",
                        singleTransform: {
                            type: "fluid.transforms.stringTemplate",
                            template: "{storyEditor}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
                            terms: "{storyEditor}.story.model"
                        }
                    }
                }
            },
            // the story editing context
            storyEditor: {
                type: "sjrk.storyTelling.ui.storyEditor",
                container: ".sjrkc-storyTelling-story-editor",
                options: {
                    listeners: {
                        // TODO: determine if there is a better way to "register" these
                        onStorySubmitRequested: "{page}.events.onContextChangeRequested.fire",
                        onEditorNextRequested: "{page}.events.onContextChangeRequested.fire",
                        onEditorPreviousRequested: "{page}.events.onContextChangeRequested.fire"
                    },
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
                        }
                    }
                }
            },
            // the story preview context
            storyPreviewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: ".sjrkc-storyTelling-story-previewer",
                options: {
                    listeners: {
                        onStoryViewerPreviousRequested: "{page}.events.onContextChangeRequested.fire"
                    },
                    components: {
                        story: {
                            options: {
                                model: "{storyEditor}.story.model"
                            }
                        },
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
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
