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

    fluid.defaults("sjrk.storyTelling.testUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
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
                name: "Test UI",
                expect: 1,
                sequence: [{
                    func: "jqUnit.assert",
                    args: ["An empty test has been run"]
                }]
            }]
        }]
    });

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

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiTest"
        ]);
    });

})(jQuery, fluid);
