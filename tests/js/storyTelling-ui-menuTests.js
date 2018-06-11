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

    fluid.defaults("sjrk.storyTelling.ui.testMenu", {
        gradeNames: ["sjrk.storyTelling.ui.menu"]
    });

    fluid.defaults("sjrk.storyTelling.ui.menuTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story Viewer UI.",
            tests: [{
                name: "Test UI controls",
                expect: 1,
                sequence: [{
                    func: "jqUnit.assert",
                    args: "There are no tests, currently"
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
