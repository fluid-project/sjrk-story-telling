/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the AuthorControls UI grade
    fluid.defaults("sjrk.storyTelling.ui.testAuthorControls", {
        gradeNames: ["sjrk.storyTelling.ui.authorControls"],
        model: {
            // Supplying an email address to force rendering the
            // "logged in" state, since the "logged out" template
            // is only a pair of links to "Log In" and "Sign Up"
            authorAccountName: "a-truthy-value"
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    // Test cases and sequences for the AuthorControls UI
    fluid.defaults("sjrk.storyTelling.ui.authorControlsTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test AuthorControls UI.",
            tests: [{
                name: "Test UI controls",
                expect: 2,
                sequence: [{
                    "event": "{authorControlsTest authorControls}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["AuthorControls's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{authorControls}.dom.logOutButton"
                },
                {
                    "event": "{authorControls}.events.onLogOutRequested",
                    listener: "jqUnit.assert",
                    args: ["onLogOutRequested event fired"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.ui.authorControlsTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            authorControls: {
                type: "sjrk.storyTelling.ui.testAuthorControls",
                container: "#testAuthorControls",
                createOnEvent: "{authorControlsTester}.events.onTestCaseStart"
            },
            authorControlsTester: {
                type: "sjrk.storyTelling.ui.authorControlsTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.authorControlsTest"
        ]);
    });

})(jQuery, fluid);
