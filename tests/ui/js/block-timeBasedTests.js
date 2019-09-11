/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.block.testTimeBased", {
        gradeNames: ["sjrk.storyTelling.block.timeBased"],
        model: {
            heading: "Video of Rootbeer",
            alternativeText: "A video of a cute kitty",
            description: "This is a video of Rootbeer"
        }
    });

    fluid.defaults("sjrk.storyTelling.block.timeBasedTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test time-based block.",
            tests: [{
                name: "Test model relay",
                expect: 8,
                // These assertions are numbered in order to illustrate the combinations of the three values being combined in the relay.
                // for the binary number 000, the bits represent heading, alternativeText and description, respectively.
                sequence: [{
                    funcName: "jqUnit.assertEquals", // 111
                    args: ["Initial combined text is as expected", "Video of Rootbeer. A video of a cute kitty. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 011
                    args: ["Combined text is as expected", "A video of a cute kitty. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 001
                    args: ["Combined text is as expected", "This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", "Video of Shyguy"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 101
                    args: ["Combined text is as expected", "Video of Shyguy. This is a video of Rootbeer", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["description", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 100
                    args: ["Combined text is as expected", "Video of Shyguy", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", "A video of another cute kitty"]
                },
                {
                    funcName: "jqUnit.assertEquals", // 110
                    args: ["Combined text is as expected", "Video of Shyguy. A video of another cute kitty", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["heading", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 010
                    args: ["Combined text is as expected", "A video of another cute kitty", "{timeBased}.model.contentString"]
                },
                {
                    func: "{timeBased}.applier.change",
                    args: ["alternativeText", null]
                },
                {
                    funcName: "jqUnit.assertEquals", // 000
                    args: ["Combined text is as expected", "", "{timeBased}.model.contentString"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.timeBasedTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            timeBased: {
                type: "sjrk.storyTelling.block.testTimeBased",
                container: "#testImageBlock"
            },
            timeBasedTester: {
                type: "sjrk.storyTelling.block.timeBasedTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.timeBasedTest"
        ]);
    });

})(jQuery, fluid);
