/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

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
                    event: "{storyEditorTest storyEditor}.events.onStoryUiReady",
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
                name: "Block reordering function unit tests",
                expect: 19,
                sequence: [{
                    funcName: "sjrk.storyTelling.ui.storyEditorTester.sortStoryContentTests"
                },
                {
                    funcName: "sjrk.storyTelling.ui.storyEditorTester.getManagedClassNamePatternTests"
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

    /**
     * Tests the sortStoryContent function
     */
    sjrk.storyTelling.ui.storyEditorTester.sortStoryContentTests = function () {
        var testCases = {
            aLessThanB: {
                content: [{ id: "a", order: 0 }, { id: "b", order: 1 }],
                expectedContent: [{ id: "a", order: 0 }, { id: "b", order: 1 }]
            },
            bLessThanA: {
                content: [{ id: "a", order: 1 }, { id: "b", order: 0 }],
                expectedContent: [{ id: "b", order: 0 }, { id: "a", order: 1 }]
            },
            aSameAsB: {
                content: [{ id: "a", order: 0 }, { id: "b", order: 0 }],
                expectedContent: [{ id: "a", order: 0 }, { id: "b", order: 0 }]
            },
            bothFalse: {
                content: [{ id: "a", order: false }, { id: "b", order: false }],
                expectedContent: [{ id: "a", order: false }, { id: "b", order: false }]
            },
            bothTrue: {
                content: [{ id: "a", order: true }, { id: "b", order: true }],
                expectedContent: [{ id: "a", order: true }, { id: "b", order: true }]
            },
            bothUndefined: {
                content: [{ id: "a", order: undefined }, { id: "b", order: undefined }],
                expectedContent: [{ id: "a" }, { id: "b" }]
            },
            bothNull: {
                content: [{ id: "a", order: null }, { id: "b", order: null }],
                expectedContent: [{ id: "a", order: null }, { id: "b", order: null }]
            },
            bothStrings: {
                content: [{ id: "a", order: "incorrect" }, { id: "b", order: "values" }],
                expectedContent: [{ id: "a", order: "incorrect" }, { id: "b", order: "values" }]
            },
            oneBlock: {
                content: [{ id: "a", order: 0 }],
                expectedContent: [{ id: "a", order: 0 }]
            },
            noBlocks: {
                content: [],
                expectedContent: []
            }
        };

        fluid.each(testCases, function (testCase, caseName) {
            // create a new story component with the provided content array
            var testStory = sjrk.storyTelling.story({
                soandso: "this is a thing",
                model: {
                    content: testCase.content
                }
            });

            sjrk.storyTelling.ui.storyEditor.sortStoryContent(testStory);
            var actualContent = testStory.model.content;

            jqUnit.assertDeepEq("Story content is as expected after reorder: " + caseName, testCase.expectedContent, actualContent);
        });
    };

    /**
     * Tests the getManagedClassNamePattern function
     */
    sjrk.storyTelling.ui.storyEditorTester.getManagedClassNamePatternTests = function () {
        var testCases = {
            normal: { selector: ".test-selector", expected: "\^test-selector-" },
            incorrectFormat: { selector: "test-selector", expected: "\^est-selector-" },
            charArray: { selector: [".","t","e","s","t"], expected: undefined },
            emptyObject: { selector: {}, expected: undefined },
            numberZero: { selector: 0, expected: undefined },
            numberOne: { selector: 1, expected: undefined },
            boolTrue: { selector: true, expected: undefined },
            boolFalse: { selector: true, expected: undefined },
            missingField: { expected: undefined }
        };

        fluid.each(testCases, function (testCase, caseName) {
            var actual = sjrk.storyTelling.ui.storyEditor.getManagedClassNamePattern(testCase.selector);

            jqUnit.assertDeepEq("Generated class name pattern is as expected: " + caseName, testCase.expected, actual);
        });
    };

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
