/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the templateManager helper grades
    fluid.defaults("sjrk.storyTelling.testTemplateManagerHelper", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        templateConfig: {
            templatePath: "../html/templates/testHandleBarsHelperTemplate.handlebars",
            messagesPath: "../messages/testLocalizationMessages.json"
        },
        selectors: {
            testId1: ".sjrkc-testTemplateManager-testId1",
            testId2: ".sjrkc-testTemplateManager-testId2",
            testId3: ".sjrkc-testTemplateManager-testId3"
        }
    });

    // Test cases and sequences for the templateManager helper grades
    fluid.defaults("sjrk.storyTelling.templateManagerHelperTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test template manager.",
            tests: [{
                name: "Test template manager Handlebars helper",
                expect: 4,
                sequence: [{
                    "event": "{templateManagerHelperTest testTemplateManagerHelper}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsIdHelper",
                    args: ["{testTemplateManagerHelper}", "testId1", "testId2", "test"]
                },
                {
                    funcName: "sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsReplaceHelper",
                    args: ["{testTemplateManagerHelper}", "testId3"]
                }]
            }]
        }]
    });

    /**
     * Verifies the behaviour of the ID helper is as expected by confirming two
     * generated IDs are not the same as one another and both follow a set format
     *
     * @param {Component} component - an instance of sjrk.storyTelling.templateManager
     * @param {String} selector1 - the selector for the first element to check
     * @param {String} selector2 - the selector for the second element to check
     * @param {String} prefix - the expected prefix for generated IDs
     */
    sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsIdHelper = function (component, selector1, selector2, prefix) {
        var generatedId1 = component.locate(selector1).text().trim();
        var generatedId2 = component.locate(selector2).text().trim();

        jqUnit.assertNotEquals("Two generated IDs are not identical", generatedId1, generatedId2);

        jqUnit.assertEquals("Generated ID begins with prefix and dash", 0, generatedId1.indexOf(prefix + "-"));
    };

    /**
     * Verifies the behaviour of the Replace helper
     *
     * @param {Component} component - an instance of sjrk.storyTelling.templateManager
     * @param {String} selector - the selector for the element to check
     */
    sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsReplaceHelper = function (component, selector) {
        var actualOutputString = component.locate(selector).text().trim();

        jqUnit.assertNotEquals("Output string is not equal to initial string", "Test input string", actualOutputString);
        jqUnit.assertEquals("Output string is as expected", "Test output string", actualOutputString);
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.templateManagerHelperTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templateManagerHelper: {
                type: "sjrk.storyTelling.testTemplateManagerHelper",
                container: "#testTemplateManagerHelper",
                createOnEvent: "{templateManagerHelperTester}.events.onTestCaseStart"
            },
            templateManagerHelperTester: {
                type: "sjrk.storyTelling.templateManagerHelperTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templateManagerHelperTest"
        ]);
    });

})(jQuery, fluid);
