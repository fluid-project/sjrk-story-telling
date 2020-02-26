/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the templateManager grade
    fluid.defaults("sjrk.storyTelling.testTemplateManager", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        templateConfig: {
            templatePath: "../html/templates/testTemplate.handlebars",
            messagesPath: "../messages/testLocalizationMessages.json"
        },
        testDynamicValues: {
            testValue: " a dynamic test value!",
            testString: " a dynamic test string!"
        }
    });

    // Test cases and sequences for the templateManager
    fluid.defaults("sjrk.storyTelling.templateManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager.",
            tests: [{
                name: "Test template manager template rendering",
                expect: 2,
                sequence: [{
                    "event": "{templateManagerTest testTemplateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTester.verifyTemplateRendering",
                    args: ["{testTemplateManager}", "<span class=\"sjrkc-testTemplateManager-testMessage\">Hello, world!</span>"]
                },
                {
                    func: "{testTemplateManager}.applier.change",
                    args: ["dynamicValues", "{testTemplateManager}.options.testDynamicValues"]
                },
                {
                    changeEvent: "{testTemplateManager}.applier.modelChanged",
                    path: "dynamicValues",
                    listener: "{testTemplateManager}.renderTemplate"
                },
                {
                    "event": "{testTemplateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTester.verifyTemplateRendering",
                    args: ["{testTemplateManager}", "<span class=\"sjrkc-testTemplateManager-testMessage\">Hello, world! a dynamic test value! a dynamic test string!</span>"]
                }]
            }]
        }]
    });

    /* Verifies that the markup in the templateManager's container is as expected
     * - "templateManager": the templateManager component
     * - "expectedContent": the expected content of the DOM container
     */
    sjrk.storyTelling.templateManagerTester.verifyTemplateRendering = function (templateManager, expectedContent) {
        var actualContent = templateManager.container.html().trim();

        jqUnit.assertEquals("Generated markup is inserted into specified container", expectedContent, actualContent);
    };

    // Test environment
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

    /* Verifies the resolveTerms function's behaviour
     */
    jqUnit.test("Test resolveTerms function", function () {
        jqUnit.expect(1);

        var inputTerms = {
            testTemplate2: "%testTemplate",
            testTemp3: "%testTemplate2",
            testString: "testValue",
            testTemplate: "%testString"
        };

        var expectedResult = {
            testTemplate2: "testValue",
            testTemp3: "testValue",
            testString: "testValue",
            testTemplate: "testValue"
        };

        var actualResult = sjrk.storyTelling.templateManager.resolveTerms(inputTerms, inputTerms);

        jqUnit.assertDeepEq("Resolved terms are as expected", expectedResult, actualResult);
    });

    /* Verifies that a given element has the expected value
     */
    sjrk.storyTelling.templateManagerTester.verifyLocalization = function (component, selector, expected) {
        var actual = component.locate(selector).text().trim();
        jqUnit.assertEquals("Element text matches expected value", expected, actual);
    };

    /* Generates a test sequence for a single localization
     * - "languageCode": the language code for which to generate a test sequence
     * - "expected": the expected value of the message
     */
    sjrk.storyTelling.templateManagerTester.generateLocalizationTest = function (languageCode, expected) {
        fluid.defaults("sjrk.storyTelling.templateManagerTester." + languageCode, {
            gradeNames: ["fluid.test.testCaseHolder"],
            expectedMessage: expected,
            modules: [{
                name: "Test template manager localization.",
                tests: [{
                    name: "Test locale translation",
                    expect: 1,
                    sequence: [{
                        "event": "{templateManagerTestBase templateManagerLocalized}.events.onTemplateRendered",
                        listener: "sjrk.storyTelling.templateManagerTester.verifyLocalization",
                        args: ["{templateManagerLocalized}", "testMessage", "{that}.options.expectedMessage"]
                    }]
                }]
            },
            {
                name: "Test templated component with localization (" + languageCode + ")"
            }]
        });
    };

    sjrk.storyTelling.templateManagerTester.generateLocalizationTest ("en", "Hello, world!");
    sjrk.storyTelling.templateManagerTester.generateLocalizationTest ("fr", "Bonjour le monde!");
    sjrk.storyTelling.templateManagerTester.generateLocalizationTest ("es", "\u00A1Hola Mundo!");
    sjrk.storyTelling.templateManagerTester.generateLocalizationTest ("chef", "bork bork bork!");

    // Abstract, see factory function below for generating usable
    // test environment grades
    fluid.defaults("sjrk.storyTelling.templateManagerTestBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManagerLocalized: {
                type: "sjrk.storyTelling.testTemplateManager",
                // Set by implementing test environment grade
                // container: "#testTemplateManager",
                createOnEvent: "{templateManagerTesterLocalized}.events.onTestCaseStart",
                options: {
                    selectors: {
                        testMessage: ".sjrkc-testTemplateManager-testMessage"
                    }
                }
            }
        }
    });

    /* Generates a test environment for a single localization
     * - "languageCode": the language code for which to generate a test environment
     */
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment = function (languageCode) {
        fluid.defaults("sjrk.storyTelling.templateManagerTest." + languageCode, {
            gradeNames: ["sjrk.storyTelling.templateManagerTestBase"],
            components: {
                templateManagerLocalized: {
                    container: "#testTemplateManager_" + languageCode,
                    options: {
                        model: {
                            locale: languageCode
                        }
                    }
                },
                templateManagerTesterLocalized: {
                    type: "sjrk.storyTelling.templateManagerTester." + languageCode
                }
            }
        });
    };

    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("en");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("fr");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("es");
    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment("chef");

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templateManagerTest",
            "sjrk.storyTelling.templateManagerTest.en",
            "sjrk.storyTelling.templateManagerTest.fr",
            "sjrk.storyTelling.templateManagerTest.es",
            "sjrk.storyTelling.templateManagerTest.chef"
        ]);
    });

})(jQuery, fluid);
