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

    fluid.defaults("sjrk.storyTelling.testTemplatedComponent", {
        gradeNames: ["sjrk.storyTelling.templatedComponent"],
        templateConfig: {
            classPrefix: "test"
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "../html/templates/testTemplate.html"
                    }
                }
            }
        },
        model: {
            templateTerms: {
                testClasses: "replacement-Value"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponentTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test templated component.",
            tests: [{
                name: "Test templated component template rendering",
                expect: 1,
                sequence: [{
                    "event": "{templatedComponentTest templatedComponent}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templatedComponentTester.testTemplateRendering",
                    args: ["{templatedComponent}"]
                }]
            },
            {
                name: "Test invoker version of getClasses",
                expect: 1,
                sequence: [{
                    funcName:                       "sjrk.storyTelling.templatedComponentTester.testGetClasses",
                    args: ["{templatedComponent}"]
                }]
            },
            {
                name: "Test invoker version of getLabelId",
                expect: 2,
                sequence: [{
                    funcName:                       "sjrk.storyTelling.templatedComponentTest.testGetLabelId",
                    args: ["test", "{templatedComponent}.getLabelId"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templatedComponentTester.testGetClasses = function (component) {
        var suffix = "testFunction";
        var classes = component.getClasses(suffix);
        var expectedClasses = "testc-testFunction test-testFunction";

        jqUnit.assertEquals("Generated classes are expected value", expectedClasses, classes);
    };

    sjrk.storyTelling.templatedComponentTester.testTemplateRendering = function (templatedComponent) {
        var expectedContent = "<span class=\"replacement-Value\">Test content</span>";

        jqUnit.assertEquals("Generated markup is inserted into specified container", expectedContent, templatedComponent.container.html().trim());
    };

    fluid.defaults("sjrk.storyTelling.templatedComponentTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templatedComponent: {
                type: "sjrk.storyTelling.testTemplatedComponent",
                container: "#testTemplatedComponent",
                createOnEvent: "{templatedComponentTester}.events.onTestCaseStart"
            },
            templatedComponentTester: {
                type: "sjrk.storyTelling.templatedComponentTester"
            }
        }
    });

    jqUnit.test("Test getClasses function", function () {
        jqUnit.expect(1);

        var classes = sjrk.storyTelling.templatedComponent.getClasses("test", "testFunction");

        jqUnit.assertEquals("Generated classes are expected value", "testc-testFunction test-testFunction", classes);
    });

    jqUnit.test("Test getLabelId function", function () {
        jqUnit.expect(2);

        var prefix = "test";

        sjrk.storyTelling.templatedComponentTest.testGetLabelId(prefix, sjrk.storyTelling.templatedComponent.getLabelId);
    });

    sjrk.storyTelling.templatedComponentTest.testGetLabelId = function (prefix, getLabelIdFunction) {

        var label1 = getLabelIdFunction(prefix);
        var label2 = getLabelIdFunction(prefix);

        jqUnit.assertNotEquals("Two generated labels are not identical", label1, label2);

        jqUnit.assertEquals("Generated label begins with prefix and dash", 0, label1.indexOf(prefix + "-"));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templatedComponentTest"
        ]);
    });

})(jQuery, fluid);
