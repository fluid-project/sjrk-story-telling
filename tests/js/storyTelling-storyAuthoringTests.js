/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testStoryAuthoring", {
        gradeNames: ["sjrk.storyTelling.storyAuthoring"],
        resourceLoaderConfig: {
            resourcePrefix: "../.."
        }
    });

    fluid.defaults("sjrk.storyTelling.storyAuthoringTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story authoring interface",
            tests: [{
                name: "Test editor and viewer model binding and updating",
                expect: 18,
                sequence: [{
                    "listener": "jqUnit.assert",
                    "args": "onStoryEditorReady event fired.",
                    "event": "{storyAuthoringTest storyAuthoring}.events.onStoryEditorReady"
                },
                {
                    func: "sjrk.storyTelling.storyAuthoringTester.checkPageVisibility",
                    args: ["{storyAuthoring}","storyEditorPage1"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyAuthoring}.storyEditor.dom.storyEditorNext"
                },
                {
                    "listener": "sjrk.storyTelling.storyAuthoringTester.checkPageVisibility",
                    "args": ["{storyAuthoring}","storyEditorPage2"],
                    "event": "{storyAuthoring}.events.onVisibilityChanged"
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyAuthoring}.storyEditor","storyTitle","Initial test title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyAuthoring}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyAuthoring}.events.onStorySubmitRequestedFromEditorNoView",
                    listener: "jqUnit.assert",
                    args: ["onStorySubmitRequestedFromEditorNoView event fired"]
                },
                {
                    "event": "{storyAuthoring}.events.onStoryViewerReady",
                    listener: "jqUnit.assert",
                    args: ["onStoryViewerReady event fired"]
                },
                {
                    func: "sjrk.storyTelling.storyAuthoringTester.checkPageVisibility",
                    args: ["{storyAuthoring}","storyViewer"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyAuthoring}.storyViewer.dom.storyViewerPrevious"
                },
                {
                    "listener": "sjrk.storyTelling.storyAuthoringTester.checkPageVisibility",
                    "args": ["{storyAuthoring}","storyEditorPage2"],
                    "event": "{storyAuthoring}.events.onVisibilityChanged"
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Viewer model updated","{storyAuthoring}.storyEditor.model.title","{storyAuthoring}.storyViewer.model.title"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyAuthoring}.storyEditor","storyTitle","New test title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Viewer model updated","{storyAuthoring}.storyEditor.model.title","{storyAuthoring}.storyViewer.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyAuthoring}.storyEditor.dom.storySubmit"
                },
                {
                    "event":
                    "{storyAuthoring}.events.onStorySubmitRequestedFromEditorViewExists",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequestedFromEditorViewExists event fired."
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyAuthoringTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyAuthoring: {
                type: "sjrk.storyTelling.testStoryAuthoring",
                container: "#testStoryAuthoring",
                createOnEvent: "{storyAuthoringTester}.events.onTestCaseStart"
            },
            storyAuthoringTester: {
                type: "sjrk.storyTelling.storyAuthoringTester"
            }
        }
    });

    var selectors = ["storyEditorPage1", "storyEditorPage2", "storyViewer"];

    sjrk.storyTelling.storyAuthoringTester.checkPageVisibility = function (component, expectedVisible) {
        fluid.each(selectors, function (selector) {
            var expectedDisplay = selector === expectedVisible ? "block" : "none";
            var actualDisplay = component.locate(selector).css("display");
            jqUnit.assertEquals("The element " + selector + " matches expected display value",expectedDisplay, actualDisplay);
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyAuthoringTest"
        ]);
    });

})(jQuery, fluid);
