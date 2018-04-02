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

    fluid.defaults("sjrk.storyTelling.testUiManager", {
        gradeNames: ["sjrk.storyTelling.uiManager"],
        selectors: {
            storyEditor: "#testStoryEditor",
            storyPreviewer: "#testPreviewer"
        },
        components: {
            storyEditor: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            },
            previewer: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.uiManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 20,
                sequence: [{
                    "event": "{uiManagerTest uiManager}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    args: [
                        ["{uiManager}.storyEditor.dom.storyEditorPage2", "{uiManager}.previewer.container"],
                        ["{uiManager}.storyEditor.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{uiManager}.storyEditor.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.storyEditor.dom.storyEditorPage1", "{uiManager}.previewer.container"],
                        ["{uiManager}.storyEditor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{uiManager}.storyEditor","storyTitle","Initial test title"]
                },
                {
                    changeEvent: "{uiManager}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Editor model updated to expected value", "Initial test title", "{uiManager}.storyEditor.story.model.title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated to match editor","{uiManager}.storyEditor.story.model.title","{uiManager}.previewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.storyEditor.container"],
                        ["{uiManager}.previewer.container"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.previewer.dom.storyPreviewerPrevious"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.storyEditor.dom.storyEditorPage1", "{uiManager}.previewer.container"],
                        ["{uiManager}.storyEditor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{uiManager}.storyEditor","storyTitle","New test title"]
                },
                {
                    changeEvent: "{uiManager}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    func: "jqUnit.assertEquals",
                    args: ["previewer model updated","{uiManager}.storyEditor.story.model.title","{uiManager}.previewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.storyEditor.container"],
                        ["{uiManager}.previewer.container"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{uiManager}.previewer.dom.storyTitle", "New test title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.storyEditor.dom.storyListenTo"
                },
                {
                    "event": "{uiManager}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from editor."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.previewer.dom.storyListenTo"
                },
                {
                    "event": "{uiManager}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from previewer."
                }]
            }]
        },
        {
            name: "Test storySpeaker",
            tests: [{
                name: "Test storySpeaker",
                expect: 2,
                sequence: [{
                    func: "{uiManager}.storyEditor.story.applier.change",
                    args: ["author", "Rootbeer"]
                },
                {
                    "changeEvent": "{uiManager}.storyEditor.story.applier.modelChanged",
                    path: "author",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "New test title, by Rootbeer. ", "{uiManager}.storySpeaker.model.ttsText"]
                },
                {
                    func: "{uiManager}.storyEditor.story.applier.change",
                    args: ["title", "My brother Shyguy"]
                },
                {
                    "changeEvent": "{uiManager}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "My brother Shyguy, by Rootbeer. ", "{uiManager}.storySpeaker.model.ttsText"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.uiManagerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            uiManager: {
                type: "sjrk.storyTelling.testUiManager",
                container: "#testStoryUiManager",
                createOnEvent: "{uiManagerTester}.events.onTestCaseStart"
            },
            uiManagerTester: {
                type: "sjrk.storyTelling.uiManagerTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiManagerTest"
        ]);
    });

})(jQuery, fluid);
