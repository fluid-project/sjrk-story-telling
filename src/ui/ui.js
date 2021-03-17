/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Represents a context or view of a UI.
    // Includes a templateManager to handle DOM interaction.
    fluid.defaults("sjrk.storyTelling.ui", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            onReadyToBind: null,
            onControlsBound: null
        },
        listeners: {
            "onReadyToBind.fireOnControlsBound": {
                func: "{that}.events.onControlsBound.fire",
                priority: "last"
            }
        },
        components: {
            // Manages template loading and rendering
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{ui}.container",
                options: {
                    listeners: {
                        "onTemplateRendered.escalate": "{ui}.events.onReadyToBind"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/messages/storyMessages.json"
                    }
                }
            }
        }
    });

    // Represents a UI with a story (sjrk.storyTelling.story), and adds
    // management of dynamically-created block UIs for each story block
    fluid.defaults("sjrk.storyTelling.ui.storyUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
        // common selectors for all UI's that have stories
        selectors: {
            storyContainer: ".sjrkc-st-story-viewer-main-container",
            storyTitle: ".sjrkc-st-story-title",
            storyAuthor: ".sjrkc-st-story-author",
            storyContent: ".sjrkc-st-story-content",
            storyTags: ".sjrkc-st-story-tags"
        },
        events: {
            onStoryUiReady: null
        },
        components: {
            // represents the story data
            story: {
                type: "sjrk.storyTelling.story"
            },
            // the templateManager for this UI
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            story: "{story}.model"
                        }
                    }
                }
            },
            // for dynamically rendering the story block by block
            blockManager: {
                // TODO: Considering the size of this component, it should be split into
                // its own Grade. This work is captured in SJRK-126:
                //
                // https://issues.fluidproject.org/browse/SJRK-126
                type: "sjrk.dynamicViewComponentManager",
                container: "{ui}.container",
                createOnEvent: "{ui}.events.onReadyToBind",
                options: {
                    // blockTypeLookup will be supplied by implementing grades
                    // It is a lookup list for dynamically-created block view components.
                    // The format of the lookup list is:
                    //     {
                    //         "blockTypeX": "the.full.x.block.grade.name",
                    //         "blockTypeY": "the.full.y.block.grade.name",
                    //     }
                    blockTypeLookup: null,
                    invokers: {
                        createBlocksFromData: {
                            funcName: "sjrk.storyTelling.ui.storyUi.createBlocksFromData",
                            args: ["{arguments}.0", "{that}.options.blockTypeLookup", "{that}.events.viewComponentContainerRequested"]
                        },
                        updateStoryFromBlocks: {
                            funcName: "sjrk.storyTelling.ui.storyUi.updateStoryFromBlocks",
                            args: ["{ui}.story", "{that}.managedViewComponentRegistry"]
                        }
                    },
                    listeners: {
                        "onCreate.escalate": "{ui}.events.onStoryUiReady"
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
                                            // TODO: This factoring is not ideal and should be
                                            // revised. This is detailed in SJRK-115.
                                            // Also relevant are SJRK-61 and SJRK-262:
                                            //
                                            // https://issues.fluidproject.org/browse/SJRK-115
                                            // https://issues.fluidproject.org/browse/SJRK-61
                                            // https://issues.fluidproject.org/browse/SJRK-262
                                            gradeNames: ["{that}.getBlockGrade"],
                                            invokers: {
                                                "getBlockGrade": {
                                                    funcName: "sjrk.storyTelling.ui.storyUi.getBlockGradeFromEventModelValues",
                                                    args: ["{blockUi}.options.additionalConfiguration.modelValues"]
                                                }
                                            },
                                            modelListeners: {
                                                "": {
                                                    func: "{blockManager}.updateStoryFromBlocks",
                                                    excludeSource: ["init"],
                                                    namespace: "singleBlockToStory"
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

    /**
     * Fabricates a grade based on the model values passed in from the event
     * This roundabout approach is necessary to ensure that we can have
     * model values from the event merged successfully with the base values
     * of the block
     *
     * @param {Object} modelValuesFromEvent - the model values to use
     *
     * @return {String} - the new grade's name
     */
    sjrk.storyTelling.ui.storyUi.getBlockGradeFromEventModelValues = function (modelValuesFromEvent) {
        var gradeName = "sjrk.storyTelling.block-" + fluid.allocateGuid();
        fluid.defaults(gradeName, {
            // TODO: this should test that modelValuesFromEvent is a legitimate
            // model object, rather than simply existing
            model: modelValuesFromEvent ? modelValuesFromEvent : {}
        });
        return gradeName;
    };

    /**
     * Given a collection of story block data, will fire a creation event for each,
     * specifying a grade name based on a lookup list. The format of the lookup list is:
     *     {
     *         "blockTypeX": "the.full.x.block.grade.name",
     *         "blockTypeY": "the.full.y.block.grade.name",
     *     }
     *
     * @param {Component[]} storyBlocks - a collection of story blocks (sjrk.storyTelling.block)
     * @param {Object.<String, String>} blockTypeLookup - the list of blockType names and associated grades
     * @param {Object} createEvent - the event that is to be fired in order to create the blocks
     */
    sjrk.storyTelling.ui.storyUi.createBlocksFromData = function (storyBlocks, blockTypeLookup, createEvent) {
        fluid.each(storyBlocks, function (blockData) {
            var gradeNames = blockTypeLookup[blockData.blockType];
            createEvent.fire(gradeNames, {modelValues: blockData});
        });
    };

    /**
     * Updates a story's model based on the individual models of all blocks,
     * in the order in which they're stored.
     *
     * @param {Component} story - an instance of sjrk.storyTelling.story
     * @param {Component[]} blockUis - a collection of sjrk.storyTelling.blockUI components
     */
    sjrk.storyTelling.ui.storyUi.updateStoryFromBlocks = function (story, blockUis) {
        var storyContent = [];

        fluid.each(blockUis, function (ui) {
            var blockData = ui.block.model;
            storyContent.push(blockData);
        });

        var storyUpdateTransaction = story.applier.initiate();
        storyUpdateTransaction.fireChangeRequest({path: "content", type: "DELETE"});
        storyUpdateTransaction.fireChangeRequest({path: "content", value: storyContent});
        storyUpdateTransaction.commit();
    };

})(jQuery, fluid);
