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
            hiddenEditorClass: "hidden"
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
                args: ["{that}.options.selectors.mainContainer", "{that}.options.selectors.pageContainer", "{that}.options.pageSetup.savingEnabled", "{that}.options.pageSetup.hiddenEditorClass"]
            }
        },
        /*
            TODO: Come up with a better name for this collection. Consider
            making these values a configuration option in each block grade,
            maybe even making the block contentString model relays based on it
        */
        requiredBlockValues: {
            "text": ["heading", "text", "simplifiedText"],
            "image": ["imageUrl"],
            "audio": ["mediaUrl"],
            "video": ["mediaUrl"]
        },
        modelRelay: {
            editorStoryToPreviewer: {
                source: "{storyEditor}.story.model",
                target: "{storyPreviewer}.story.model",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            excludeEmptyBlocks: {
                target: "{storyPreviewer}.story.model.content",
                singleTransform: {
                    type: "fluid.transforms.free",
                    func: "sjrk.storyTelling.page.storyEdit.removeEmptyBlocks",
                    args: ["{storyEditor}.story.model.content", "{that}.options.requiredBlockValues"]
                }
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
                            terms: "{storyPreviewer}.story.model"
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

    /* Removes all empty blocks from a given array of story blocks
     * - "blocks": an array of story blocks
     * - "requiredValuesLookup": a collection of arrays by block type which
     *      outlines the values that, if at least one is truthy, will mean a
     *      particular block is not empty
     */
    sjrk.storyTelling.page.storyEdit.removeEmptyBlocks = function (blocks, requiredValuesLookup) {
        var nonEmptyBlocks = fluid.remove_if(blocks, function (block) {
            return sjrk.storyTelling.page.storyEdit.isEmptyBlock(block, requiredValuesLookup[block.blockType]);
        });

        return nonEmptyBlocks;
    };

    /* Returns true if a block is determined to be empty. Which values determine
     * whether a block is emtpy depends on the particular block type, but if
     * they're all falsy then the block is considered empty. If at least one of
     * those values is truthy, the block is not empty.
     * - "block": a story block
     * - "requiredValues": an array of the "required" values of a block, according
     *                     to the definition above
     */
    sjrk.storyTelling.page.storyEdit.isEmptyBlock = function (block, requiredValues) {
        var isEmptyBlock = true; // assume the block is empty

        fluid.each(requiredValues, function (requiredValue) {
            if (block[requiredValue]) {
                isEmptyBlock = false;
            }
        });

        return isEmptyBlock;
    };

    sjrk.storyTelling.page.storyEdit.setEditorDisplay = function (mainContainer, pageContainer, savingEnabled, hiddenEditorClass) {
        $(mainContainer).prop("hidden", !savingEnabled);
        $(pageContainer).toggleClass(hiddenEditorClass, !savingEnabled);
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
