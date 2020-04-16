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
                        "onTemplateRendered.escalate": "{ui}.events.onReadyToBind.fire"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/messages/storyMessages.json"
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
    sjrk.storyTelling.ui.getBlockGradeFromEventModelValues = function (modelValuesFromEvent) {
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
     *         "x": "the.full.x.block.grade.name",
     *         "y": "the.full.y.block.grade.name",
     *     }
     *
     * @param {Component[]} storyBlocks - a collection of story blocks (sjrk.storyTelling.block)
     * @param {Object.<String, String>} blockTypeLookup - the list of blockType names and associated grades
     * @param {Object} createEvent - the event that is to be fired in order to create the blocks
     */
    sjrk.storyTelling.ui.createBlocksFromData = function (storyBlocks, blockTypeLookup, createEvent) {
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
     * @param {Object} completionEvent - the event to be fired upon successful completion
     */
    sjrk.storyTelling.ui.updateStoryFromBlocks = function (story, blockUis, completionEvent) {
        var storyContent = [];

        fluid.each(blockUis, function (ui) {
            var blockData = ui.block.model;
            storyContent.push(blockData);
        });

        story.applier.change("content", storyContent);

        completionEvent.fire();
    };

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
            onStoryUpdatedFromBlocks: null
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
                type: "sjrk.dynamicViewComponentManager",
                createOnEvent: "{templateManager}.events.onTemplateRendered",
                options: {
                    blockTypeLookup: {
                        "audio": "sjrk.storyTelling.blockUi.audioBlockViewer",
                        "image": "sjrk.storyTelling.blockUi.imageBlockViewer",
                        "text": "sjrk.storyTelling.blockUi.textBlockViewer",
                        "video": "sjrk.storyTelling.blockUi.videoBlockViewer"
                    },
                    invokers: {
                        createBlocksFromData: {
                            funcName: "sjrk.storyTelling.ui.createBlocksFromData",
                            args: ["{arguments}.0", "{that}.options.blockTypeLookup", "{that}.events.viewComponentContainerRequested"]
                        },
                        updateStoryFromBlocks: {
                            funcName: "sjrk.storyTelling.ui.updateStoryFromBlocks",
                            args: [
                                "{ui}.story",
                                "{that}.managedViewComponentRegistry",
                                "{ui}.events.onStoryUpdatedFromBlocks"
                            ]
                        }
                    },
                    listeners: {
                        "onCreate.createBlocksFromData": {
                            func: "{that}.createBlocksFromData",
                            args: ["{story}.model.content"]
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
                                            },
                                            modelListeners: {
                                                "": {
                                                    func: "{blockManager}.updateStoryFromBlocks",
                                                    excludeSource: "init",
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

})(jQuery, fluid);
