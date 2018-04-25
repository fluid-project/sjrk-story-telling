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

    fluid.defaults("sjrk.storyTelling.testStory", {
        gradeNames: ["sjrk.storyTelling.story"]
    });

    fluid.defaults("sjrk.storyTelling.storyTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story.",
            tests: [{
                name: "Test model relay",
                expect: 4,
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Initial contentString is as expected", "", "{story}.model.contentString"]
                },
                {
                    func: "{story}.applier.change",
                    args: ["", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["contentString is as expected", "", ""]
                },
                {
                    func: "{story}.applier.change",
                    args: ["", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["contentString is as expected", "", ""]
                },
                {
                    func: "{story}.applier.change",
                    args: ["description", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["contentString is as expected", "", ""]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            story: {
                type: "sjrk.storyTelling.story",
                container: "#testStory",
                createOnEvent: "{storyTester}.events.onTestCaseStart"
            },
            storyTester: {
                type: "sjrk.storyTelling.storyTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTest"
        ]);
    });

})(jQuery, fluid);
