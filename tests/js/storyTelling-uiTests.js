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

    fluid.defaults("sjrk.storyTelling.testUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
        interfaceConfig: {
            classPrefix: "test"
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "../html/templates/testTemplate.handlebars",
                        messagesPath: "../json/messages/testLocalizationMessages.json"
                    },
                    templateStrings: {
                        testClasses: "replacement-Value"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.uiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test UI.",
            tests: [{
                name: "Test invoker version of getClasses",
                expect: 1,
                sequence: [{
                    funcName: "sjrk.storyTelling.uiTester.testGetClasses",
                    args: ["{ui}"]
                }]
            },
            {
                name: "Test invoker version of getLabelId",
                expect: 2,
                sequence: [{
                    funcName: "sjrk.storyTelling.uiTest.testGetLabelId",
                    args: ["test"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.uiTester.testGetClasses = function (component) {
        var suffix = "testFunction";
        var classes = component.getClasses(suffix);
        var expectedClasses = "testc-testFunction test-testFunction";

        jqUnit.assertEquals("Generated classes are expected value", expectedClasses, classes);
    };

    fluid.defaults("sjrk.storyTelling.uiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            ui: {
                type: "sjrk.storyTelling.testUi",
                container: "#testUi"
            },
            uiTester: {
                type: "sjrk.storyTelling.uiTester"
            }
        }
    });

    jqUnit.test("Test getClasses function", function () {
        jqUnit.expect(1);

        var classes = sjrk.storyTelling.ui.getClasses("test", "testFunction");

        jqUnit.assertEquals("Generated classes are expected value", "testc-testFunction test-testFunction", classes);
    });

    jqUnit.test("Test getLabelId function", function () {
        jqUnit.expect(2);

        var prefix = "test";

        sjrk.storyTelling.uiTest.testGetLabelId(prefix);
    });

    sjrk.storyTelling.uiTest.testGetLabelId = function (prefix) {
        var label1 = sjrk.storyTelling.ui.getLabelId(prefix);
        var label2 = sjrk.storyTelling.ui.getLabelId(prefix);

        jqUnit.assertNotEquals("Two generated labels are not identical", label1, label2);

        jqUnit.assertEquals("Generated label begins with prefix and dash", 0, label1.indexOf(prefix + "-"));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiTest"
        ]);
    });

})(jQuery, fluid);
