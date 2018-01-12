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

    fluid.defaults("sjrk.storyTelling.ui.testPreviewer", {
        gradeNames: ["sjrk.storyTelling.ui.previewer"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.ui.previewerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Previewer UI.",
            tests: [{
                name: "Test UI controls",
                expect: 1,
                sequence: [{
                    funcName: "jqUnit.assert",
                    args: ["There are currently no tests."]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.ui.previewerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            previewer: {
                type: "sjrk.storyTelling.ui.testPreviewer",
                container: "#testPreviewer",
                createOnEvent: "{previewerTester}.events.onTestCaseStart"
            },
            previewerTester: {
                type: "sjrk.storyTelling.ui.previewerTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.previewerTest"
        ]);
    });

})(jQuery, fluid);
