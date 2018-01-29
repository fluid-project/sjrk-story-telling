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

    fluid.defaults("sjrk.storyTelling.testUiManager", {
        gradeNames: ["sjrk.storyTelling.uiManager"],
        selectors: {
            storyEditor: "#testEditor",
            storyPreviewer: "#testPreviewer"
        },
        components: {
            editor: {
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
                expect: 17,
                sequence: [{
                    "event": "{uiManagerTest uiManager}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.uiManagerTester.verifyPageVisibility",
                    args: [
                        ["{uiManager}.editor.dom.storyEditorPage2", "{uiManager}.previewer.container"],
                        ["{uiManager}.editor.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.editor.dom.storyEditorNext"
                },
                {
                    "event": "{uiManager}.editor.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.uiManagerTester.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.previewer.container"],
                        ["{uiManager}.editor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{uiManager}.editor","storyTitle","Initial test title"]
                },
                {
                    changeEvent: "{uiManager}.editor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Editor model updated to expected value", "Initial test title", "{uiManager}.editor.story.model.title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated to match editor","{uiManager}.editor.story.model.title","{uiManager}.previewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.editor.dom.storySubmit"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.uiManagerTester.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.editor.container"],
                        ["{uiManager}.previewer.container"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.previewer.dom.storyPreviewerPrevious"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.uiManagerTester.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.previewer.container"],
                        ["{uiManager}.editor.dom.storyEditorPage2"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{uiManager}.editor","storyTitle","New test title"]
                },
                {
                    changeEvent: "{uiManager}.editor.story.applier.modelChanged",
                    path: "title",
                    func: "jqUnit.assertEquals",
                    args: ["previewer model updated","{uiManager}.editor.story.model.title","{uiManager}.previewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.editor.dom.storySubmit"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.uiManagerTester.verifyPageVisibility",
                    "args": [
                        ["{uiManager}.editor.container"],
                        ["{uiManager}.previewer.container"]
                    ]
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

    sjrk.storyTelling.uiManagerTester.verifyPageVisibility = function (expectedHidden, expectedVisible) {
        fluid.each(expectedHidden, function (el) {
            sjrk.storyTelling.uiManagerTester.verifyElementVisibility(el, "none");
        });

        fluid.each(expectedVisible, function (el) {
            sjrk.storyTelling.uiManagerTester.verifyElementVisibility(el, "block");
        });
    };

    sjrk.storyTelling.uiManagerTester.verifyElementVisibility = function (element, expectedVisibility) {
        var friendlyName = element.selectorName || element.selector;
        jqUnit.assertEquals("The element " + friendlyName + " is hidden", expectedVisibility, element.css("display"));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiManagerTest"
        ]);
    });

})(jQuery, fluid);
