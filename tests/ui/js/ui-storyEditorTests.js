/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Test component for the storyEditor grade
    fluid.defaults("sjrk.storyTelling.ui.testStoryEditor", {
        gradeNames: ["sjrk.storyTelling.ui.storyEditor"],
        events: {
            onNewBlockTemplateRendered: null
        },
        model: {
            lastAddedBlock: null
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
                                            },
                                            listeners: {
                                                "onTemplateRendered.notifyTestStoryEditor": {
                                                    func: "{testStoryEditor}.events.onNewBlockTemplateRendered.fire",
                                                    args: ["{editor}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
                                                },
                                                "onTemplateRendered.setLastAddedBlock": {
                                                    funcName: "{testStoryEditor}.applier.change",
                                                    args: ["lastAddedBlock", "{editor}"]
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

    // Test cases and sequences for the storyEditor
    fluid.defaults("sjrk.storyTelling.ui.storyEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 17,
                sequence: [{
                    event: "{storyEditorTest storyEditor}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["Story editor's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorNext"
                },
                {
                    "event": "{storyEditor}.events.onEditorNextRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorNextRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storySubmit"
                },
                {
                    "event": "{storyEditor}.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEditor}.events.onEditorPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorPreviousRequested event fired."
                },
                {
                    // Click to add a text block
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEditor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                {
                    // Wait for block to fully render
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                {
                    // Click to add an image block
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyAddImageBlock"
                },
                {
                    "event": "{storyEditor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                {
                    // Wait for block to fully render
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                {
                    // Add a second text block
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEditor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                {
                    // Wait for block to fully render because it doesn't have a
                    // checkbox for the next item in the sequence until then.
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                {
                    // Select the checkbox of the first block
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEditor}.blockManager", true]
                },
                {
                    // Click the "remove selected blocks" button
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyRemoveSelectedBlocks"
                },
                {
                    // Verify removal
                    "event": "{storyEditor}.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEditor}.blockManager", 2]
                }]
            },
            {
                name: "Test block reorderer",
                expect: 10,
                sequence: [{
                    // add a first block
                    jQueryTrigger: "click",
                    element: "{storyEditor}.dom.storyAddTextBlock"
                },
                {
                    event: "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    // add a second block
                    jQueryTrigger: "click",
                    element: "{storyEditor}.dom.storyAddTextBlock"
                },
                {
                    event: "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    // Mock focusin event, listen for reorderer onRefresh
                    jQueryTrigger: "focusin",
                    element: "{storyEditor}.reorderer.container"
                },
                {
                    event: "{storyEditor}.reorderer.events.onRefresh",
                    listener: "jqUnit.assert",
                    args: ["Reorderer onRefresh fired on focusin event"]
                },
                {
                    // Click its reorder button up, listen for reorderer onMove
                    jQueryTrigger: "click",
                    element: "{storyEditor}.model.lastAddedBlock.dom.moveBlockUpButton"
                },
                {
                    event: "{storyEditor}.reorderer.events.onMove",
                    listener: "jqUnit.assert",
                    args: ["Reorderer onMove fired on moveBlockUp button clicked"]
                },
                {
                    // Click its reorder button down, listen for reorderer onMove
                    jQueryTrigger: "click",
                    element: "{storyEditor}.model.lastAddedBlock.dom.moveBlockDownButton"
                },
                {
                    event: "{storyEditor}.reorderer.events.onMove",
                    listener: "jqUnit.assert",
                    args: ["Reorderer onMove fired on moveBlockDown button clicked"]
                },
                {
                    // Refresh the reorderer, listen for onBlockOrderUpdated after it's done
                    func: "{storyEditor}.reorderer.refresh"
                },
                {
                    event: "{storyEditor}.events.onBlockOrderUpdated",
                    listener: "jqUnit.assert",
                    args: ["onBlockOrderUpdated fired on reorderer refresh, as expected"]
                }]
            },
            {
                name: "Test tags model relay",
                expect: 1,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEditor}", "storyTags", "testTag1, testTag2"]
                },
                {
                    changeEvent: "{storyEditor}.story.applier.modelChanged",
                    path: "tags",
                    listener: "jqUnit.assertDeepEq",
                    args: ["DOM to Model: Stored tags are equal to the expected value", ["testTag1", "testTag2"], "{storyEditor}.story.model.tags"]
                }]
            },
            {
                name: "Test step visibility",
                expect: 6,
                sequence: [{
                    "funcName": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyMetadataStep"],
                        ["{storyEditor}.dom.storyEditStoryStep"],
                        "{storyEditor}.model"
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorNext"
                },
                {
                    "changeEvent": "{storyEditor}.applier.modelChanged",
                    "path": "metadataStepVisible",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyEditStoryStep"],
                        ["{storyEditor}.dom.storyMetadataStep"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorPrevious"
                },
                {
                    "changeEvent": "{storyEditor}.applier.modelChanged",
                    "path": "metadataStepVisible",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyMetadataStep"],
                        ["{storyEditor}.dom.storyEditStoryStep"]
                    ]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.ui.storyEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.ui.testStoryEditor",
                container: "#testStoryEditor",
                createOnEvent: "{storyEditorTester}.events.onTestCaseStart"
            },
            storyEditorTester: {
                type: "sjrk.storyTelling.ui.storyEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.storyEditorTest"
        ]);
    });

})(jQuery, fluid);
