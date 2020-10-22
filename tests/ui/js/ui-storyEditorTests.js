/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
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
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
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
                                                // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                                                resourcePrefix: "../../../themes/base"
                                            },
                                            listeners: {
                                                "onTemplateRendered.notifyTestStoryEditor": {
                                                    func: "{testStoryEditor}.events.onNewBlockTemplateRendered.fire",
                                                    args: ["{editor}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
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

    fluid.registerNamespace("sjrk.storyTelling.ui.storyEditorTester");
    sjrk.storyTelling.ui.storyEditorTester.testStoryPreReorder = [{
        "alternativeText": null, "blockType": "image", "description": null,
        "fileDetails": null, "firstInOrder": true, "heading": null, "id": null,
        "imageUrl": null, "language": null, "lastInOrder": false, "order": 0
    },
    {
        "blockType": "text", "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": false, "order": 1, "text": null
    },
    {
        "alternativeText": null, "blockType": "audio", "description": null,
        "fileDetails": null, "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": false, "mediaUrl": null, "order": 2
    },
    {
        "alternativeText": null, "blockType": "video", "description": null,
        "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": true, "mediaUrl": null, "order": 3
    }];

    sjrk.storyTelling.ui.storyEditorTester.testStoryAfterFirstReorder = [{
        "alternativeText": null, "blockType": "image", "description": null,
        "fileDetails": null, "firstInOrder": true, "heading": null, "id": null,
        "imageUrl": null, "language": null, "lastInOrder": false, "order": 0
    },
    {
        "alternativeText": null, "blockType": "audio", "description": null,
        "fileDetails": null, "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": false, "mediaUrl": null, "order": 1
    },
    {
        "blockType": "text", "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": false, "order": 2, "text": null
    },
    {
        "alternativeText": null, "blockType": "video", "description": null,
        "firstInOrder": false, "heading": null, "id": null,
        "language": null, "lastInOrder": true, "mediaUrl": null, "order": 3
    }];

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
                expect: 11,
                sequence: [{
                    // add a third block
                    jQueryTrigger: "click",
                    element: "{storyEditor}.dom.storyAddAudioBlock"
                },
                {
                    event: "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.audioBlockEditor"]
                },
                {
                    // add a fourth block
                    jQueryTrigger: "click",
                    element: "{storyEditor}.dom.storyAddVideoBlock"
                },
                {
                    event: "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.videoBlockEditor"]
                },
                {
                    // Mock focusin event, listen for reorderer onRefresh
                    jQueryTrigger: "focusin",
                    element: "{storyEditor}.reorderer.container"
                },
                {
                    event: "{storyEditor}.reorderer.events.onRefresh",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Block orders are as expected after reorderer refresh", sjrk.storyTelling.ui.storyEditorTester.testStoryPreReorder, "{storyEditor}.story.model.content"]
                },
                {
                    // Click its reorder button up, listen for reorderer onMove and check order
                    funcName: "sjrk.storyTelling.ui.storyEditorTester.clickBlockButton",
                    args: ["{storyEditor}.blockManager", 2, "moveBlockUpButton"]
                },
                {
                    event: "{storyEditor}.reorderer.events.onMove",
                    listener: "jqUnit.assert",
                    args: ["Reorderer onMove fired on moveBlockUp button clicked"]
                },
                {
                    event: "{storyEditor}.reorderer.events.afterMove",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Block orders are as expected after reorder up", sjrk.storyTelling.ui.storyEditorTester.testStoryAfterFirstReorder, "{storyEditor}.story.model.content"]
                },
                {
                    // Click its reorder button down, listen for reorderer onMove and check order
                    funcName: "sjrk.storyTelling.ui.storyEditorTester.clickBlockButton",
                    args: ["{storyEditor}.blockManager", 2, "moveBlockDownButton"]
                },
                {
                    event: "{storyEditor}.reorderer.events.onMove",
                    listener: "jqUnit.assert",
                    args: ["Reorderer onMove fired on moveBlockDown button clicked"]
                },
                {
                    event: "{storyEditor}.reorderer.events.afterMove",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Block orders are as expected after reorder down (original order)", sjrk.storyTelling.ui.storyEditorTester.testStoryPreReorder, "{storyEditor}.story.model.content"]
                }]
            },
            {
                name: "Block reordering function unit tests",
                expect: 21,
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
     * Triggers a jQuery click event on a specified button on the block that is
     * in a given position in the collection (independent of block order)
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {Number} blockIndex - the index of the block to click on (0-indexed)
     * @param {String} buttonSelector - the selector name for the button to click
     */
    sjrk.storyTelling.ui.storyEditorTester.clickBlockButton = function (blockManager, blockIndex, buttonSelector) {
        var blockUi = Object.values(blockManager.managedViewComponentRegistry)[blockIndex];
        var button = blockUi.dom.locate(buttonSelector);
        $(button).click();
    };

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
            bFalseOnly: {
                content: [{ id: "a", order: 0 }, { id: "b", order: false }],
                expectedContent: [{ id: "a", order: 0 }, { id: "b", order: false }]
            },
            bothFalse: {
                content: [{ id: "a", order: false }, { id: "b", order: false }],
                expectedContent: [{ id: "a", order: false }, { id: "b", order: false }]
            },
            bothTrue: {
                content: [{ id: "a", order: true }, { id: "b", order: true }],
                expectedContent: [{ id: "a", order: true }, { id: "b", order: true }]
            },
            aTrueBFalse: {
                content: [{ id: "a", order: true }, { id: "b", order: false }],
                expectedContent: [{ id: "a", order: true }, { id: "b", order: false }]
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
