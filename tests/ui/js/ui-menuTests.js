/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.ui.testMenu", {
        gradeNames: ["sjrk.storyTelling.ui.menu"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.ui.menuTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Menu UI.",
            tests: [{
                name: "Test UI controls",
                expect: 3,
                sequence: [{
                    "event": "{menuTest menu}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["Menu's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{menu}.dom.languageLinkEnglish"
                },
                {
                    "event": "{menu}.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for English button with correct args", "en", "{arguments}.0.data"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{menu}.dom.languageLinkSpanish"
                },
                {
                    "event": "{menu}.events.onInterfaceLanguageChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onInterfaceLanguageChangeRequested event fired for Spanish button with correct args", "es", "{arguments}.0.data"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.ui.menuTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            menu: {
                type: "sjrk.storyTelling.ui.testMenu",
                container: "#testMenu",
                createOnEvent: "{menuTester}.events.onTestCaseStart"
            },
            menuTester: {
                type: "sjrk.storyTelling.ui.menuTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.menuTest"
        ]);
    });

})(jQuery, fluid);
