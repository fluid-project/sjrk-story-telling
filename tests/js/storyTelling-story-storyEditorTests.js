/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.testStoryEditor", {
        gradeNames: ["sjrk.storyTelling.story.storyEditor"],
        components: {
            resourceLoader: {
                options: {
                    terms: {
                        resourcePrefix: "../.."
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
                expect: 3,
                sequence: [{
                    "event": "{storyEditorTest storyEditor}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["onControlsBound event fired"]
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
                    "element": "{storyEditor}.dom.storyListenTo"
                },
                {
                    "event": "{storyEditor}.events.onStoryListenToRequested",
                    listener: "jqUnit.assert",
                    args: "onStoryListenToRequested event fired."
                }]
            }]
        }]
    });

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
