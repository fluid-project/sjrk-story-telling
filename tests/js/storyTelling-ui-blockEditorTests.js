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

    fluid.defaults("sjrk.storyTelling.ui.testBlockEditor", {
        gradeNames: ["sjrk.storyTelling.ui.blockEditor"],
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

    fluid.defaults("sjrk.storyTelling.ui.blockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Block Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 1,
                sequence: [{
                    "event": "{blockEditorTest binder}.events.onBindingApplied",
                    listener: "jqUnit.assert",
                    args: ["onBindingApplied event fired"]
                }]
            }]
            // TODO: add tests for each field's bindings, see text block tests
        }]
    });

    // sjrk.storyTelling.ui.editorTester.testGetClasses = function (component) {
    //     var suffix = "testFunction";
    //     var classes = component.getClasses(suffix);
    //     var expectedClasses = "testc-testFunction test-testFunction";
    //
    //     jqUnit.assertEquals("Generated classes are expected value", expectedClasses, classes);
    // };

    fluid.defaults("sjrk.storyTelling.ui.blockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            blockEditor: {
                type: "sjrk.storyTelling.ui.testBlockEditor",
                container: "#testBlockEditor",
                createOnEvent: "{blockEditorTester}.events.onTestCaseStart"
            },
            blockEditorTester: {
                type: "sjrk.storyTelling.ui.blockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.blockEditorTest"
        ]);
    });

})(jQuery, fluid);
