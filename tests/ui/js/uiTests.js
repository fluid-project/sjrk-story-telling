/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the UI grade
    fluid.defaults("sjrk.storyTelling.testUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // there is no "plain" UI template, so we'll co-op the storyViewer
                        templatePath: "%resourcePrefix/templates/storyViewer.handlebars",
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    // Test cases and sequences for the UI grade
    fluid.defaults("sjrk.storyTelling.uiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test UI.",
            tests: [{
                name: "Test event wiring",
                expect: 2,
                sequence: [{
                    event: "{uiTest ui}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The onReadyToBind event fired"]
                },
                {
                    funcName: "fluid.identity"
                },
                {
                    event: "{ui}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["The onControlsBound event fired after onReadyToBind"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.uiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            ui: {
                type: "sjrk.storyTelling.testUi",
                container: "#testUi",
                createOnEvent: "{uiTester}.events.onTestCaseStart"
            },
            uiTester: {
                type: "sjrk.storyTelling.uiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiTest"
        ]);
    });

})(jQuery, fluid);
