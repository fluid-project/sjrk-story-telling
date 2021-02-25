/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the authenticationUi grade
    fluid.defaults("sjrk.storyTelling.ui.testAuthenticationUi", {
        gradeNames: ["sjrk.storyTelling.ui.authenticationUi"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base",
                        // since there's no dedicated "authentication" template, we'll use the login page
                        templatePath: "%resourcePrefix/templates/login.hbs"
                    }
                }
            }
        }
    });

    // Test cases and sequences for the Authentication UI
    fluid.defaults("sjrk.storyTelling.ui.authenticationUiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Authentication UI.",
            tests: [{
                name: "Test UI controls",
                expect: 2,
                sequence: [{
                    "event": "{authenticationUiTest authenticationUi}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["authenticationUi's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{authenticationUi}.dom.authenticationButton"
                },
                {
                    "event": "{authenticationUi}.events.onAuthenticationRequested",
                    listener: "jqUnit.assert",
                    args: ["onLogOutRequested event fired"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.ui.authenticationUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            authenticationUi: {
                type: "sjrk.storyTelling.ui.testAuthenticationUi",
                container: "#testAuthenticationUi",
                createOnEvent: "{authenticationUiTester}.events.onTestCaseStart"
            },
            authenticationUiTester: {
                type: "sjrk.storyTelling.ui.authenticationUiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.authenticationUiTest"
        ]);
    });

})(jQuery, fluid);
