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
        gradeNames: ["sjrk.storyTelling.block.textBlock"]
    });

    fluid.defaults("sjrk.storyTelling.block.textBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test text block.",
            tests: [{
                name: "Test model relay",
                expect: 1,
                sequence: [{
                    funcName: "jqUnit.assert",
                    args: ["Empty test sequence"]
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
