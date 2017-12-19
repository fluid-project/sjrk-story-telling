/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testTemplateManager", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "../html/templates/testTemplate.handlebars"
                    }
                }
            },
            messageLoader: {
                options: {
                    resources: {
                        componentMessages: "../json/messages/testLocalizationMessages.json"
                    }
                }
            }
        },
        templateStrings: {
            testClasses: "replacement-Value"
        },
        selectors: {
            testMessage: ".sjrkc-testTemplatedComponentWithLocalization-testMessage"
        }
    });

    fluid.defaults("sjrk.storyTelling.templateManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager.",
            tests: [{
                name: "Test template manager template rendering",
                expect: 1,
                sequence: [{
                    "event": "{templateManagerTest testTemplateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTester.testTemplateRendering",
                    args: ["{testTemplateManager}"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templateManagerTester.testTemplateRendering = function (templateManager) {
        var expectedContent = "<span class=\"replacement-Value\">Hello, world!</span>";
        var actualContent = templateManager.container.html().trim();

        jqUnit.assertEquals("Generated markup is inserted into specified container", expectedContent, actualContent);
    };

    fluid.defaults("sjrk.storyTelling.templateManagerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManager: {
                type: "sjrk.storyTelling.testTemplateManager",
                container: "#testTemplateManager",
                createOnEvent: "{templateManagerTester}.events.onTestCaseStart"
            },
            templateManagerTester: {
                type: "sjrk.storyTelling.templateManagerTester"
            }
        }
    });

    jqUnit.test("Test resolveTerms function", function () {
        jqUnit.expect(1);

        var inputTerms = {
            testTemplate2: "%testTemplate",
            testString: "testValue",
            testTemplate: "%testString",
            testArray: ["value1", "value2", "value3"]
            //TODO: once function is made recursive, enable these cases
            // testArray: ["value1", "value2", "value3", "%testTemplate"],
            // testObject: {
            //     testSubObject1: "testValue1",
            //     testSubObject2: "%testSubObject1"
            // }
        };

        var expectedResult = {
            testTemplate2: "testValue",
            testString: "testValue",
            testTemplate: "testValue",
            testArray: ["value1", "value2", "value3"]
            //TODO: once function is made recursive, enable these cases
            // testArray: ["value1", "value2", "value3", "testValue"],
            // testObject: {
            //     testSubObject1: "testValue1",
            //     testSubObject2: "testValue1"
            // }
        };

        var actualResult = sjrk.storyTelling.templateManager.resolveTerms(inputTerms);

        jqUnit.assertDeepEq("Resolved terms are as expected", expectedResult, actualResult);
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templateManagerTest"
        ]);
    });

})(jQuery, fluid);
