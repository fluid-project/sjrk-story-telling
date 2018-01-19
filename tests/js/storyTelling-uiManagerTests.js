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
        components: {
            editor: {
                container: "#testEditor",
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
                container: "#testPreviewer",
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
            name: "Test combined story user interface",
            tests: [{
                name: "Test editor and viewer model binding and updating",
                expect: 9,
                sequence: [{
                    "event": "{uiManagerTest uiManager}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                    args: [
                        ["{uiManager}.editor.dom.storyEditorPage2", "{uiManager}.previewer.dom.storyPreviewer"],
                        ["{uiManager}.editor.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.editor.dom.storyEditorNext"
                },
                {
                    "event": "{uiManager}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                    "args": [
                        ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.previewer.dom.storyPreviewer"],
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
                    args: ["Viewer model updated","{uiManager}.editor.story.model.title","{uiManager}.previewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{uiManager}.editor.dom.storySubmit"
                },
                {
                    "event": "{uiManager}.events.onStorySubmitRequestedFromEditor",
                    listener: "jqUnit.assert",
                    args: ["onStorySubmitRequestedFromEditorNoView event fired"]
                // },
                // {
                //     func: "fluid.identity"
                // },
                // {
                //     "event": "{uiManager}.events.onVisibilityChanged",
                //     "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     "args": [
                //         ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.editor.dom.storyEditorPage2"],
                //         ["{uiManager}.previewer.dom.storyPreviewer"]
                //     ]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.previewer.dom.storyViewerPrevious"
                // },
                // {
                //     "event": "{uiManager}.events.onVisibilityChanged",
                //     "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     "args": [
                //         ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.previewer.dom.storyPreviewer"],
                //         ["{uiManager}.editor.dom.storyEditorPage2"]
                //     ]
                // },
                // {
                //     func: "sjrk.storyTelling.testUtils.changeFormElement",
                //     args: ["{uiManager}.editor","storyTitle","New test title"]
                // },
                // {
                //     changeEvent: "{uiManager}.editor.story.applier.modelChanged",
                //     path: "title",
                //     func: "jqUnit.assertEquals",
                //     args: ["Viewer model updated","{uiManager}.editor.story.model.title","{uiManager}.previewer.story.model.title"]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.editor.dom.storySubmit"
                // },
                // {
                //     "event":
                //     "{uiManager}.events.onStorySubmitRequestedFromEditor",
                //     listener: "jqUnit.assert",
                //     args: "onStorySubmitRequestedFromEditor event fired."
                // },
                // {
                //     func: "fluid.identity"
                // },
                // {
                //     "event": "{uiManager}.events.onVisibilityChanged",
                //     "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     "args": [
                //         ["{uiManager}.editor.dom.storyEditorPage1", "{uiManager}.editor.dom.storyEditorPage2"],
                //         ["{uiManager}.previewer.dom.storyPreviewer"]
                //     ]
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

    sjrk.storyTelling.uiManagerTester.checkPageVisibility = function (expectedHidden, expectedVisible) {
        fluid.each(expectedHidden, function (el) {
            var expectedDisplay = "none";
            var actualDisplay = el.css("display");
            jqUnit.assertEquals("The element " + el.selectorName + " is hidden", expectedDisplay, actualDisplay);
        });

        fluid.each(expectedVisible, function (el) {
            var expectedDisplay = "block";
            var actualDisplay = el.css("display");
            jqUnit.assertEquals("The element " + el.selectorName + " is showing", expectedDisplay, actualDisplay);
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiManagerTest"
        ]);
    });

})(jQuery, fluid);
