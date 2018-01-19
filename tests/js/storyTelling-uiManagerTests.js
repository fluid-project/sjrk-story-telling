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
                expect: 1,//18,
                sequence: [{
                    "listener": "jqUnit.assert",
                    "args": "onStoryEditorReady event fired.",
                    "event": "{uiManagerTest uiManager}.events.onEditorReady"
                // },
                // {
                //     func: "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     args: ["{uiManager}","storyEditorPage1"]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.storyEditor.dom.storyEditorNext"
                // },
                // {
                //     "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     "args": ["{uiManager}","storyEditorPage2"],
                //     "event": "{uiManager}.events.onVisibilityChanged"
                // },
                // {
                //     func: "sjrk.storyTelling.testUtils.changeFormElement",
                //     args: ["{uiManager}.storyEditor","storyTitle","Initial test title"]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.storyEditor.dom.storySubmit"
                // },
                // {
                //     "event": "{uiManager}.events.onStorySubmitRequestedFromEditorNoView",
                //     listener: "jqUnit.assert",
                //     args: ["onStorySubmitRequestedFromEditorNoView event fired"]
                // },
                // {
                //     "event": "{uiManager}.events.onStoryViewerReady",
                //     listener: "jqUnit.assert",
                //     args: ["onStoryViewerReady event fired"]
                // },
                // {
                //     func: "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     args: ["{uiManager}","storyViewer"]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.storyViewer.dom.storyViewerPrevious"
                // },
                // {
                //     "listener": "sjrk.storyTelling.uiManagerTester.checkPageVisibility",
                //     "args": ["{uiManager}","storyEditorPage2"],
                //     "event": "{uiManager}.events.onVisibilityChanged"
                // },
                // {
                //     func: "jqUnit.assertEquals",
                //     args: ["Viewer model updated","{uiManager}.storyEditor.model.title","{uiManager}.storyViewer.model.title"]
                // },
                // {
                //     func: "sjrk.storyTelling.testUtils.changeFormElement",
                //     args: ["{uiManager}.storyEditor","storyTitle","New test title"]
                // },
                // {
                //     func: "jqUnit.assertEquals",
                //     args: ["Viewer model updated","{uiManager}.storyEditor.model.title","{uiManager}.storyViewer.model.title"]
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{uiManager}.storyEditor.dom.storySubmit"
                // },
                // {
                //     "event":
                //     "{uiManager}.events.onStorySubmitRequestedFromEditorViewExists",
                //     listener: "jqUnit.assert",
                //     args: "onStorySubmitRequestedFromEditorViewExists event fired."
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

    var selectors = ["storyEditorPage1", "storyEditorPage2", "storyViewer"];

    sjrk.storyTelling.uiManagerTester.checkPageVisibility = function (component, expectedVisible) {
        fluid.each(selectors, function (selector) {
            var expectedDisplay = selector === expectedVisible ? "block" : "none";
            var actualDisplay = component.locate(selector).css("display");
            jqUnit.assertEquals("The element " + selector + " matches expected display value",expectedDisplay, actualDisplay);
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiManagerTest"
        ]);
    });

})(jQuery, fluid);
