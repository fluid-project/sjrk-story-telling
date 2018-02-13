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

    fluid.defaults("sjrk.storyTelling.block.testText", {
        gradeNames: ["sjrk.storyTelling.block.text"],
        model: {
            text: "An initial value"
        },
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

    fluid.defaults("sjrk.storyTelling.block.textTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Text Block.",
            tests: [{
                name: "Test Text Block",
                expect: 3,
                sequence: [{
                    event: "{textTest text}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{text}", "textBlock", "Hello Shyguy!"]
                },
                {
                    changeEvent: "{text}.applier.modelChanged",
                    path: "text",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Hello Shyguy!", "{text}.model.text"]
                },
                {
                    func: "{text}.applier.change",
                    args: ["text", "Hello Rootbeer!"]
                },
                {
                    changeEvent: "{text}.applier.modelChanged",
                    path: "text",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{text}.dom.textBlock", "Hello Rootbeer!"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.textTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            text: {
                type: "sjrk.storyTelling.block.testText",
                container: "#testText",
                createOnEvent: "{textTester}.events.onTestCaseStart"
            },
            textTester: {
                type: "sjrk.storyTelling.block.textTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.textTest"
        ]);
    });

})(jQuery, fluid);
