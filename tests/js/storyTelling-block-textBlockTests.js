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

    fluid.defaults("sjrk.storyTelling.block.testTextBlock", {
        gradeNames: ["sjrk.storyTelling.block.textBlock"],
        model: {
            heading: "Rootbeer's favourite things",
            text: "Food."
        }
    });

    fluid.defaults("sjrk.storyTelling.block.textBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test text block.",
            tests: [{
                name: "Test model relay",
                expect: 6,
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Initial combined text is as expected", "Rootbeer's favourite things. Food.", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["heading", "Shyguy's favourite things"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Shyguy's favourite things. Food.", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["text", "Calm."]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Shyguy's favourite things. Calm.", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["text", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Shyguy's favourite things", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["text", "Pets"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Shyguy's favourite things. Pets", "{textBlock}.model.contentString"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["heading", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Pets", "{textBlock}.model.contentString"]
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
