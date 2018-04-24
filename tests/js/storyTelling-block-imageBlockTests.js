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

    fluid.defaults("sjrk.storyTelling.block.testImageBlock", {
        gradeNames: ["sjrk.storyTelling.block.imageBlock"],
        model: {
            heading: "Picture of Shyguy",
            alternativeText: "A picture of a cute kitty",
            description: "This is a picture of Shyguy"
        }
    });

    fluid.defaults("sjrk.storyTelling.block.imageBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test image block.",
            tests: [{
                name: "Test model relay",
                expect: 6,
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Initial combined text is as expected", "Picture of Shyguy. A picture of a cute kitty. This is a picture of Shyguy", "{imageBlock}.model.contentString"]
                },
                {
                    func: "{imageBlock}.applier.change",
                    args: ["heading", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "A picture of a cute kitty. This is a picture of Shyguy", "{imageBlock}.model.contentString"]
                },
                {
                    func: "{imageBlock}.applier.change",
                    args: ["heading", "Picture of Rootbeer"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Picture of Rootbeer. A picture of a cute kitty. This is a picture of Shyguy", "{imageBlock}.model.contentString"]
                },
                {
                    func: "{imageBlock}.applier.change",
                    args: ["description", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Picture of Rootbeer. A picture of a cute kitty", "{imageBlock}.model.contentString"]
                },
                {
                    func: "{imageBlock}.applier.change",
                    args: ["description", "This is a picture of Rootbeer"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Picture of Rootbeer. A picture of a cute kitty. This is a picture of Rootbeer", "{imageBlock}.model.contentString"]
                },
                {
                    func: "{imageBlock}.applier.change",
                    args: ["alternativeText", ""]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Combined text is as expected", "Picture of Rootbeer. This is a picture of Rootbeer", "{imageBlock}.model.contentString"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.imageBlockTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            imageBlock: {
                type: "sjrk.storyTelling.block.testImageBlock",
                container: "#testImageBlock"
            },
            imageBlockTester: {
                type: "sjrk.storyTelling.block.imageBlockTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.imageBlockTest"
        ]);
    });

})(jQuery, fluid);
