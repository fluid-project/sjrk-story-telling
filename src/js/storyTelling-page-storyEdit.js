/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
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
            onVisibilityChanged: null,
            onStoryShareRequested: "{storyPreviewer}.events.onShareRequested",
            onStoryShareComplete: "{storyPreviewer}.events.onShareComplete"
        },
        listeners: {
            "onContextChangeRequested.updateStoryFromBlocks": {
                func: "{storyEditor}.events.onUpdateStoryFromBlocksRequested.fire",
                priority: "first"
            },
            "{storyEditor}.events.onStorySubmitRequested": [{
                func: "{storyPreviewer}.templateManager.renderTemplate",
                args: ["{storyPreviewer}.story.model", {isEditorPreview: true}, "{storyPreviewer}.templateManager.options.templateConfig"],
                namespace: "previewerRenderTemplate"
            },
            {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [["{storyEditor}.container"], ["{storyPreviewer}.container"], "{that}.events.onVisibilityChanged"],
                namespace: "showPreviewerHideEditor"
            }],
            "{storyPreviewer}.events.onStoryViewerPreviousRequested": {
                funcName: "sjrk.storyTelling.ui.manageVisibility",
                args: [["{storyPreviewer}.container"], ["{storyEditor}.container"], "{that}.events.onVisibilityChanged"],
                namespace: "showEditorHidePreviewer"
            },
            "{storyPreviewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire",
                namespace: "escalate"
            }
        },
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
                container: ".sjrkc-st-story-editor",
                options: {
                    listeners: {
                        "onStorySubmitRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire",
                        "onEditorNextRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire",
                        "onEditorPreviousRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire"
                    }
                }
            },
            // the story safety and etiquette notice
            storyEtiquette: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-etiquette-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    templatePath: "%resourcePrefix/src/templates/etiquette.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // the story preview context
            storyPreviewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: ".sjrkc-st-story-previewer",
                options: {
                    selectors: {
                        progressArea: ".sjrkc-st-story-share-progress",
                        responseArea: ".sjrkc-st-story-share-response",
                        responseText: ".sjrkc-st-story-share-response-text"
                    },
                    listeners: {
                        "onStoryViewerPreviousRequested.requestContextChange": "{page}.events.onContextChangeRequested.fire",
                        "onShareRequested": [{
                            func: "{that}.showProgressArea",
                            namespace: "showProgressArea"
                        },{
                            func: "{that}.disableShareButton",
                            namespace: "disableShareButton"
                        },{
                            func: "{that}.hideServerResponse",
                            namespace: "hideServerResponse"
                        }],
                        "onShareComplete": [{
                            func: "{that}.hideProgressArea",
                            namespace: "hideProgressArea"
                        },{
                            func: "{that}.enableShareButton",
                            namespace: "enableShareButton"
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
                        setShareButtonDisabled: {
                            this: "{that}.dom.storyShare",
                            method: "prop",
                            args: ["disabled", "{arguments}.0"]
                        },
                        enableShareButton: {
                            func: "{that}.setShareButtonDisabled",
                            args: [false]
                        },
                        disableShareButton: {
                            func: "{that}.setShareButtonDisabled",
                            args: [true]
                        },
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
                        story: {
                            options: {
                                model: "{storyEditor}.story.model"
                            }
                        },
                        templateManager: {
                            options: {
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{story}.model", "{that}.options.templateConfig", {isEditorPreview: true}]
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
