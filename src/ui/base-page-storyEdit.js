/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    // The storyEdit page base grade
    fluid.defaults("sjrk.storyTelling.base.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        pageSetup: {
            hiddenEditorClass: "hidden"
        },
        model: {
            /* The initial page state is only the Edit Story Step showing.
             * In much the same way as within the editor grade, the visibility
             * of the editor and previewer are mutually exclusive, and the latter
             * is always set to the opposite of the former. The same is true for
             * editStoryStepVisible and metadataStepVisible within the editor UI.
             *
             * The individual steps of the editor (editStoryStep and metadataStep)
             * are controlled within the editor model, so hiding and showing of
             * each of the three steps in the editor is achieved by changing
             * both the editorVisible value in this grade as well as
             * editStoryStepVisible.
             *
             * The three steps and their relevant model states are, in order:
             * - Edit Story Step
             *      - editorVisible: true
             *      - editStoryStepVisible: true
             * - Metadata Step
             *      - editorVisible: true
             *      - editStoryStepVisible: false
             * - Preview Step
             *      - editorVisible: false
             *      - editStoryStepVisible: false
             */
            editorVisible: true,
            previewerVisible: false
        },
        modelRelay: {
            editPageVisibilityMutex: {
                source: "editorVisible",
                target: "previewerVisible",
                singleTransform: {
                    type: "sjrk.storyTelling.transforms.not"
                }
            }
        },
        modelListeners: {
            "editorVisible": [{
                this: "{storyEditor}.container",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "manageEditorVisibility"
            },
            {
                func: "{that}.events.onContextChangeRequested.fire",
                args: ["{change}.value"],
                priority: "last",
                namespace: "contextChangeOnEditorVisibilityChange"
            }],
            "previewerVisible": {
                this: "{storyPreviewer}.container",
                method: "toggle",
                args: ["{change}.value"],
                namespace: "managePreviewerVisibility"
            },
            "{storyEditor}.model.editStoryStepVisible": {
                func: "{that}.events.onContextChangeRequested.fire",
                args: ["{change}.value"],
                priority: "last",
                namespace: "contextChangeOnEditStoryStepVisibilityChange"
            }
        },
        selectors: {
            pageContainer: ".sjrkc-edit-page-container"
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onEditorReady: "{storyEditor}.events.onControlsBound",
                    onPreviewerReady: "{storyPreviewer}.events.onControlsBound"
                }
            },
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
                func: "{that}.showEditorHidePreviewer",
                args: [false],
                namespace: "hideEditorShowPreviewer"
            }],
            "{storyPreviewer}.events.onStoryViewerPreviousRequested": {
                func: "{that}.showEditorHidePreviewer",
                args: [true],
                namespace: "showEditorHidePreviewer"
            },
            "onStoryShareRequested.submitStory": {
                funcName: "sjrk.storyTelling.base.page.storyEdit.submitStory",
                args: ["{storyEditor}.dom.storyEditorForm", "{storyPreviewer}.story.model", "{that}.events.onStoryShareComplete"]
            },
            "onCreate.setAuthoringEnabledClass": {
                func: "{that}.setAuthoringEnabledClass"
            }
        },
        invokers: {
            setAuthoringEnabledClass: {
                funcName: "sjrk.storyTelling.base.page.storyEdit.showEditPageContainer",
                args: ["{that}.options.selectors.pageContainer", "{that}.options.pageSetup.authoringEnabled"]
            },
            showEditorHidePreviewer: {
                func: "{that}.applier.change",
                args: ["editorVisible", "{arguments}.0"]
            }
        },
        /*
         * For a block of a given type, a block is considered empty unless any
         * one of the fields listed in its corresponding array is truthy.
         *
         * E.g. for an image block, even if heading, altText and description
         * are truthy, if the imageUrl isn't provided then the block is empty.
         */
        blockFields: {
            "text": ["heading", "text"],
            "image": ["imageUrl"],
            "audio": ["mediaUrl"],
            "video": ["mediaUrl"]
        },
        components: {
            // manaages browser history for in-page forward-back support
            historian: {
                type: "gpii.locationBar",
                options: {
                    model: {
                        // because we have model relays that make sure metadataStepVisible
                        // and previewerVisible are always the opposite of editStoryStepVisible
                        // and editorVisible, respectively, we only need to track the latter two
                        editorVisible: "{storyEdit}.model.editorVisible",
                        editStoryStepVisible: "{storyEditor}.model.editStoryStepVisible"
                    },
                    modelToQuery: false,
                    queryToModel: false
                }
            },
            // the story editing context
            storyEditor: {
                type: "sjrk.storyTelling.ui.storyEditor",
                container: ".sjrkc-st-story-editor"
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
                                    templatePath: "%resourcePrefix/templates/etiquette.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // the story preview context
            storyPreviewer: {
                type: "sjrk.storyTelling.ui.storyPreviewer",
                container: ".sjrkc-st-story-previewer",
                options: {
                    components: {
                        story: {
                            options: {
                                model: "{storyEditor}.story.model",
                                modelRelay: {
                                    contentEmptyBlockFilter: {
                                        target: "content",
                                        singleTransform: {
                                            type: "fluid.transforms.free",
                                            func: "sjrk.storyTelling.base.page.storyEdit.removeEmptyBlocks",
                                            args: ["{storyPreviewer}.story.model.content", "{storyEdit}.options.blockFields"]
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

    /**
     * Removes all empty blocks from a given collection of story blocks
     *
     * @param {Component[]} blocks - a collection of story blocks (sjrk.storyTelling.block)
     * @param {Object.<String, String[]>} blockFields - a hash map of block types and the fields
     * that, if at least one is truthy, means that particular block is not empty
     *
     * @return {Object} - a collection of reliably non-empty story blocks
     */
    sjrk.storyTelling.base.page.storyEdit.removeEmptyBlocks = function (blocks, blockFields) {
        var filteredBlocks = [];

        fluid.each(blocks, function (block) {
            if (!sjrk.storyTelling.base.page.storyEdit.isEmptyBlock(block, blockFields[block.blockType])) {
                filteredBlocks.push(block);
            }
        });

        return filteredBlocks;
    };

    /**
     * Returns true if a block is determined to be empty, based on the values
     * listed in blockFieldsForType. If at least one of those values is
     * truthy, the block is not empty. If the values are empty or otherwise can't
     * be iterated over, then the block is also empty regardless of its contents.
     *
     * @param {Component} block - a single story block (sjrk.storyTelling.block)
     * @param {String[]} blockFieldsForType - a set of model values for this
     * particular block type that, if at least one is truthy, means the block is not empty
     *
     * @return {Boolean} - true if the block is considered empty
     */
    sjrk.storyTelling.base.page.storyEdit.isEmptyBlock = function (block, blockFieldsForType) {
        return !fluid.find_if(blockFieldsForType, function (blockContentValue) {
            return !!block[blockContentValue];
        });
    };

    /**
     * If authoring is not enabled, will hide the Edit page container
     *
     * @param {jQuery} pageContainer - the Edit page DOM container to show/hide
     * @param {Boolean} authoringEnabled - a flag indicating whether authoring is enabled
     */
    sjrk.storyTelling.base.page.storyEdit.showEditPageContainer = function (pageContainer, authoringEnabled) {
        $(pageContainer).prop("hidden", !authoringEnabled);
    };

    /**
     * Submits the editor form to the server
     *
     * @param {jQuery} storyEditorForm - the Editor UI's HTML form element
     * @param {Object} storyModel - the model of the story to save
     * @param {Object} errorEvent - an event to fire on errors
     */
    sjrk.storyTelling.base.page.storyEdit.submitStory = function (storyEditorForm, storyModel, errorEvent) {
        storyEditorForm.attr({
            action: "/stories/",
            method: "post",
            enctype: "multipart/form-data"
        });

        // This is the easiest way to be able to submit form
        // content in the background via ajax
        var formData = new FormData(storyEditorForm[0]);

        // Stores the entire model as a JSON string in one
        // field of the multipart form
        var modelAsJSON = JSON.stringify(storyModel);
        formData.append("model", modelAsJSON);

        // In the real implementation, this should have
        // proper handling of feedback on success / failure,
        // but currently it just logs to console
        $.ajax({
            url         : storyEditorForm.attr("action"),
            data        : formData || storyEditorForm.serialize(),
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

                errorEvent.fire(fluid.get(jqXHR, ["responseJSON", "message"]) || "Internal server error");
            }
        });
    };

})(jQuery, fluid);
