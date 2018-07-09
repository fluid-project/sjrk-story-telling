/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testStory", {
        gradeNames: ["sjrk.storyTelling.story"],
        model: {
            content: [{ incorrectKey: "Not about cats." }]
        }
    });

    fluid.defaults("sjrk.storyTelling.storyTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story.",
            tests: [{
                name: "Test model relay",
                expect: 3,
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Initial contentString is as expected", "", "{story}.model.contentString"]
                },
                {
                    func: "{story}.applier.change",
                    args: ["content", [{ contentString: "Cats" }]]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["contentString is as expected", "Cats", "{story}.model.contentString"]
                },
                {
                    func: "{story}.applier.change",
                    args: ["content", [
                        { contentString: "Shyguy is a grey Mackerel Tabby with Bengal spots" },
                        { contentString: "Rootbeer is an grey-orange Mackerel Tabby with a few spots." }
                    ]]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["contentString is as expected", "Shyguy is a grey Mackerel Tabby with Bengal spots. Rootbeer is an grey-orange Mackerel Tabby with a few spots.", "{story}.model.contentString"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            story: {
                type: "sjrk.storyTelling.testStory",
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
