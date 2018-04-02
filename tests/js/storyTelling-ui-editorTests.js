/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui.testEditor", {
        gradeNames: ["sjrk.storyTelling.ui.editor"],
        events: {
            onNewBlockTemplateRendered: null
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
                                                "onTemplateRendered.notifyTestEditor": {
                                                    func: "{testEditor}.events.onNewBlockTemplateRendered.fire",
                                                    args: ["{that}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
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

    fluid.defaults("sjrk.storyTelling.ui.editorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Block Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 18,
                sequence: [{
                    "event": "{editorTest editor}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["Block editor's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyEditorNext"
                },
                {
                    "event": "{editor}.events.onEditorNextRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorNextRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storySubmit"
                },
                {
                    "event": "{editor}.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyEditorPrevious"
                },
                {
                    "event": "{editor}.events.onEditorPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorPreviousRequested event fired."
                },
                // TODO: waiting for this seems necessary because the block manager isn't fully created by the time onControlsBound fires; this should be fixed
                {
                    "event": "{editor blockManager}.events.onCreate",
                    listener: "jqUnit.assert",
                    args: ["Block manager ready"]
                },
                // Click to add a text block
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyAddTextBlock"
                },
                {
                    "event": "{editor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.ui.editorTester.verifyBlockAdded",
                    args: ["{editor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{editor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Click to add an image block
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyAddImageBlock"
                },
                {
                    "event": "{editor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.ui.editorTester.verifyBlockAdded",
                    args: ["{editor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{editor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Add a second text block
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyAddTextBlock"
                },
                {
                    "event": "{editor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.ui.editorTester.verifyBlockAdded",
                    args: ["{editor}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{editor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Select the checkbox of the first block
                {
                    func: "sjrk.storyTelling.ui.editorTester.checkFirstBlockCheckbox",
                    args: ["{editor}.blockManager"]
                },
                // Click the "remove selected blocks" button
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyRemoveSelectedBlocks"
                },
                // Verify removal
                {
                    "event": "{editor}.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.ui.editorTester.verifyBlocksRemoved",
                    args: ["{editor}.blockManager", "{arguments}.0", 2]
                }]
            },
            {
                name: "Test tags model relay",
                expect: 1,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{editor}", "storyTags", "testTag1, testTag2"]
                },
                {
                    changeEvent: "{editor}.story.applier.modelChanged",
                    path: "tags",
                    listener: "jqUnit.assertDeepEq",
                    args: ["DOM to Model: Stored tags are equal to the expected value", ["testTag1", "testTag2"], "{editor}.story.model.tags"]
                }]
            },
            {
                name: "Test page visibility",
                expect: 6,
                sequence: [{
                    "funcName": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{editor}.dom.storyEditorPage2"],
                        ["{editor}.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyEditorNext"
                },
                {
                    "event": "{editor}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{editor}.dom.storyEditorPage1"],
                        ["{editor}.dom.storyEditorPage2"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storyEditorPrevious"
                },
                {
                    "event": "{editor}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{editor}.dom.storyEditorPage2"],
                        ["{editor}.dom.storyEditorPage1"]
                    ]
                }]
            }]
        }]
    });

    // TODO: this doesn't work because of speed of execution and asynchronous
    // template loading - need to delay on this until the blocks have loaded
    // their content, because until then they don't have checkboxes!
    sjrk.storyTelling.ui.editorTester.checkFirstBlockCheckbox = function (blockManager) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");
        var checkBox = managedComponentRegistryAsArray[0].locate("selectedCheckbox");

        checkBox.prop("checked", true);
    };

    // TODO: test currently failing - see comment above.
    sjrk.storyTelling.ui.editorTester.verifyBlocksRemoved = function (blockManager, removedBlockKeys, expectedNumberOfBlocks) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");
        jqUnit.assertEquals("Number of remaining blocks is expected #: " + expectedNumberOfBlocks, expectedNumberOfBlocks, managedComponentRegistryAsArray.length);
    };

    sjrk.storyTelling.ui.editorTester.verifyBlockAdded = function (blockManager, addedBlockKey, expectedGrade) {

        var blockComponent = blockManager.managedViewComponentRegistry[addedBlockKey];

        // Verify the block is added to the manager's registry
        jqUnit.assertNotNull("New block added to manager's registry", blockComponent);

        // Verify the block's type is correct
        jqUnit.assertEquals("Block's dynamicComponent type is expected " + expectedGrade, expectedGrade,  blockComponent.options.managedViewComponentRequiredConfig.type);

        // Verify the block is added to the DOM
        var newBlock = blockManager.container.find("." + addedBlockKey);
        jqUnit.assertTrue("New block added to DOM", newBlock.length > 0);
    };

    fluid.defaults("sjrk.storyTelling.ui.editorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            editor: {
                type: "sjrk.storyTelling.ui.testEditor",
                container: "#testEditor",
                createOnEvent: "{editorTester}.events.onTestCaseStart"
            },
            editorTester: {
                type: "sjrk.storyTelling.ui.editorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.editorTest"
        ]);
    });

})(jQuery, fluid);
