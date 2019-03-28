/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.page"],
        pageSetup: {
            editorCssRules: {
                hide: {
                    "padding-top": "0",
                    "grid-template": "none"
                },
                show: {
                    "padding-top": "1rem",
                    "grid-template-columns": "2fr 3fr"
                }
            },
            hideProperty: "hidden"
        },
        selectors: {
            mainContainer: ".sjrkc-main-container",
            pageContainer: ".sjrk-edit-page-container"
        },
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
            },
            "onStoryShareRequested.submitStory": {
                funcName: "sjrk.storyTelling.page.storyEdit.submitStory",
                args: ["{storyEditor}", "{that}.events.onStoryShareComplete"]
            },
            "onCreate.setEditorDisplay": {
                func: "{that}.setEditorDisplay"
            }
        },
        invokers: {
            setEditorDisplay: {
                funcName: "sjrk.storyTelling.page.storyEdit.setEditorDisplay",
                args: ["{that}.options.selectors.mainContainer", "{that}.options.selectors.pageContainer", "{that}.options.pageSetup.savingEnabled", "{that}.options.pageSetup.editorCssRules", "{that}.options.pageSetup.hideProperty"]
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
                                model: {
                                    dynamicValues: {
                                        isEditorPreview: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    sjrk.storyTelling.page.storyEdit.setEditorDisplay = function (mainContainer, pageContainer, savingEnabled, editorCssRules, hideProperty) {
        $(mainContainer).prop(hideProperty, !savingEnabled);
        $(pageContainer).css(savingEnabled ? editorCssRules.show : editorCssRules.hide);
    };

    sjrk.storyTelling.page.storyEdit.submitStory = function (that, errorEvent) {
        var form = that.container.find("form");

        form.attr("action", "/stories/");
        form.attr("method", "post");
        form.attr("enctype", "multipart/form-data");

        // This is the easiest way to be able to submit form
        // content in the background via ajax
        var formData = new FormData(form[0]);

        // Stores the entire model as a JSON string in one
        // field of the multipart form
        var modelAsJSON = JSON.stringify(that.story.model);
        formData.append("model", modelAsJSON);

        // In the real implementation, this should have
        // proper handling of feedback on success / failure,
        // but currently it just logs to console
        $.ajax({
            url         : form.attr("action"),
            data        : formData ? formData : form.serialize(),
            cache       : false,
            contentType : false,
            processData : false,
            type        : "POST",
            success     : function (data, textStatus, jqXHR) {
                fluid.log(jqXHR, textStatus);
                var successResponse = JSON.parse(data);
                var storyUrl = "/storyView.html?id=" + successResponse.id;
                window.location.assign(storyUrl);
            },
            error       : function (jqXHR, textStatus, errorThrown) {
                fluid.log("Something went wrong");
                fluid.log(jqXHR, textStatus, errorThrown);
                var errorMessage = "Internal server error";
                if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    errorMessage = jqXHR.responseJSON.message;
                }
                errorEvent.fire(errorMessage);
            }
        });
    };

})(jQuery, fluid);
