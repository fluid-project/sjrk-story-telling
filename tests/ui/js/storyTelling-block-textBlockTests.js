/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.block.testTextBlock", {
        gradeNames: ["sjrk.storyTelling.block.textBlock"],
        model: {
            heading: "Rootbeer's favourite things",
            text: "Food"
        }
    });

    fluid.defaults("sjrk.storyTelling.block.textBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test text block.",
            tests: [{
                name: "Test model relay",
                expect: 4,
                sequence: [{
                    funcName: "jqUnit.assertEquals", // 11
                    args: ["Initial combined text is as expected", "Rootbeer's favourite things. Food", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 01
                    args: ["Combined text is as expected", "Food", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["text", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 00
                    args: ["Combined text is as expected", "", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["heading", "Shyguy's favourite things"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 10
                    args: ["Combined text is as expected", "Shyguy's favourite things", "{textBlock}.model.contentString"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.textBlockTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            textBlock: {
                type: "sjrk.storyTelling.block.testTextBlock",
                container: "#testTextBlock"
            },
            textBlockTester: {
                type: "sjrk.storyTelling.block.textBlockTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.textBlockTest"
        ]);
    });

})(jQuery, fluid);
