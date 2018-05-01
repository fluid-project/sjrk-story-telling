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

    fluid.defaults("sjrk.storyTelling.testTemplateManagerHelper", {
        gradeNames: ["sjrk.storyTelling.templateManager"],
        templateConfig: {
            templatePath: "../html/templates/testHandleBarsHelperTemplate.handlebars",
            messagesPath: "../json/messages/testLocalizationMessages.json"
        },
        selectors: {
            testId1: ".sjrkc-testTemplateManager-testId1",
            testId2: ".sjrkc-testTemplateManager-testId2",
            testId3: ".sjrkc-testTemplateManager-testId3"
        }
    });

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

    sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsIdHelper = function (component, selector1, selector2, prefix) {
        var generatedId1 = component.locate(selector1).text().trim();
        var generatedId2 = component.locate(selector2).text().trim();

        jqUnit.assertNotEquals("Two generated IDs are not identical", generatedId1, generatedId2);

        jqUnit.assertEquals("Generated ID begins with prefix and dash", 0, generatedId1.indexOf(prefix + "-"));
    };

    sjrk.storyTelling.templateManagerHelperTester.verifyHandlebarsReplaceHelper = function (component, selector3) {
        var actualOutputString = component.locate(selector3).text().trim();

        jqUnit.assertNotEquals("Output string is not equal to initial string", "Test input string", actualOutputString);
        jqUnit.assertEquals("Output string is as expected", "Test output string", actualOutputString);
    };

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
