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
        templateConfig: {
            templatePath: "../html/templates/testTemplate.handlebars",
            messagesPath: "../json/messages/testLocalizationMessages.json"
        },
        templateStrings: {
            testClasses: "replacement-Value"
        },
        selectors: {
            testMessage: ".sjrkc-testTemplateManager-testMessage"
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

    // Abstract, see implementations below
    fluid.defaults("sjrk.storyTelling.templateManagerTesterBase", {
        gradeNames: ["fluid.test.testCaseHolder"],
        // TODO: need to have a better sense of how to:
        // - handle potential multilingual input (non-Latin character sets)
        // - test multilingual input
        // - store them - HTML entities, unicode, etc?
        // Issues encountered already:
        // - encoding between platforms (local vs server)
        // - testability of multilingual strings when rendering
        // message bundles to DOM
        // Set by implementing tester grade
        // expectedMessage: ""
        modules: [{
            name: "Test template manager localization.",
            tests: [{
                name: "Test locale translation",
                expect: 1,
                sequence: [{
                    "event": "{templateManager}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerTesterBase.testLocalization",
                    args: ["{templateManager}", "testMessage", "{that}.options.expectedMessage"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templateManagerTesterBase.testLocalization = function (component, selector, expected) {
        var text = component.locate(selector).text().trim();
        jqUnit.assertEquals("Selector text matches expected value", expected, text);
    };

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest = function (languageCode, expected) {
        fluid.defaults("sjrk.storyTelling.templateManagerTester." + languageCode, {
            gradeNames: ["sjrk.storyTelling.templateManagerTesterBase"],
            expectedMessage: expected,
            modules: [{
                name: "Test templated component with localization (" + languageCode + ")"
            }]
        });
    };

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("en", "Hello, world!");

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("fr", "Bonjour le monde!");

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("es", "\u00A1Hola Mundo!");

    sjrk.storyTelling.templateManagerTesterBase.generateLocalizationTest ("chef", "bork bork bork!");

    // Abstract, see factory function below for generating usable
    // test environment grades
    fluid.defaults("sjrk.storyTelling.templateManagerTestBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManager: {
                type: "sjrk.storyTelling.testTemplateManager",
                // Set by implementing test environment grade
                // container: "#testTemplateManager",
                createOnEvent: "{templateManagerTesterLocalized}.events.onTestCaseStart"//,
                // options: {
                //     components: {
                //         messageLoader: {
                //             options: {
                //                 // locale: "en"
                //             }
                //         }
                //         // templateManagerTester: {
                //         //
                //         // }
                //     }
                // }
            }
        }
    });

    sjrk.storyTelling.templateManagerTestBase.generateTestEnvironment = function (languageCode) {
        fluid.defaults("sjrk.storyTelling.templateManagerTest." + languageCode, {
            gradeNames: ["sjrk.storyTelling.templateManagerTestBase"],
            components: {
                templateManager: {
                    container: "#testTemplateManager_" + languageCode,
                    options: {
                        templateConfig: {
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
            "sjrk.storyTelling.templateManagerTest"
        ]);
    });

})(jQuery, fluid);
