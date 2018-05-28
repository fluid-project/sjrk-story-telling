/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui.testStoryEditor", {
        gradeNames: ["sjrk.storyTelling.ui.storyEditor"],
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
                                                "onTemplateRendered.notifyTestStoryEditor": {
                                                    func: "{testStoryEditor}.events.onNewBlockTemplateRendered.fire",
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

    fluid.defaults("sjrk.storyTelling.ui.storyEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 18,
                sequence: [{
                    "event": "{storyEditorTest storyEditor}.events.onControlsBound",
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
                // TODO: waiting for this seems necessary because the block manager isn't fully created by the time onControlsBound fires; this should be fixed
                {
                    "event": "{storyEditor blockManager}.events.onCreate",
                    listener: "jqUnit.assert",
                    args: ["Block manager ready"]
                },
                // Click to add a text block
                {
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
                // Wait for block to fully render
                {
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Click to add an image block
                {
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
                // Wait for block to fully render
                {
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Add a second text block
                {
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
                // Wait for block to fully render
                {
                    "event": "{storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                },
                // Select the checkbox of the first block
                {
                    func: "sjrk.storyTelling.testUtils.checkFirstBlockCheckbox",
                    args: ["{storyEditor}.blockManager"]
                },
                // Click the "remove selected blocks" button
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyRemoveSelectedBlocks"
                },
                // Verify removal
                {
                    "event": "{storyEditor}.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEditor}.blockManager", "{arguments}.0", 2]
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
                name: "Test page visibility",
                expect: 6,
                sequence: [{
                    "funcName": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyEditorPage2"],
                        ["{storyEditor}.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorNext"
                },
                {
                    "event": "{storyEditor}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyEditorPage1"],
                        ["{storyEditor}.dom.storyEditorPage2"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEditor}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEditor}.dom.storyEditorPage2"],
                        ["{storyEditor}.dom.storyEditorPage1"]
                    ]
                }]
            }]
        }]
    });

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
