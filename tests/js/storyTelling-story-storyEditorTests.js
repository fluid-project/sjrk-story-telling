/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.testStoryEditor", {
        gradeNames: ["sjrk.storyTelling.story.storyEditor"],
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "../../src/templates/storyEdit.html"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.storyEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story editor.",
            tests: [{
                name: "Test 'Done' button",
                expect: 1,
                sequence: [{
                    "event": "{storyEditorTest storyEditor}.events.onControlsBound",
                    listener: "sjrk.storyTelling.storyEditorTester.clickDoneButton",
                    args: ["{storyEditor}.dom.storySubmit"]
                },
                {
                    "event": "{storyEditorTest storyEditor}.events.onStorySubmitRequested",
                    listener: "sjrk.storyTelling.storyEditorTester.hello"
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyEditorTester.clickDoneButton = function (selector) {
        selector.click();
        console.log("hello");
    };

    sjrk.storyTelling.storyEditorTester.hello = function () {
        console.log("hi");
    };

    fluid.defaults("sjrk.storyTelling.storyEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.story.testStoryEditor",
                container: "#testStoryEditor",
                createOnEvent: "{storyEditorTester}.events.onTestCaseStart"
            },
            storyEditorTester: {
                type: "sjrk.storyTelling.storyEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyEditorTest"
        ]);
    });

})(jQuery, fluid);
