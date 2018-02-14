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

    fluid.defaults("sjrk.storyTelling.block.textBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Text Block.",
            tests: [{
                name: "Test heading field",
                expect: 3,
                sequence: [{
                    event: "{textBlockTest textBlock}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{textBlock}", "heading", "Text about cats"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "heading",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Text about cats", "{textBlock}.model.heading"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["heading", "Story about cats"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "heading",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{textBlock}.dom.heading", "Story about cats"]
                }]
            },
            {
                name: "Test text field",
                expect: 2,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{textBlock}", "textBlockText", "Hello Shyguy!"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "text",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Hello Shyguy!", "{textBlock}.model.text"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["text", "Hello Rootbeer!"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "text",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{textBlock}.dom.textBlockText", "Hello Rootbeer!"]
                }]
            },
            {
                name: "Test text field",
                expect: 2,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{textBlock}", "textBlockSimplifiedText", "Hi Shyguy!"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "simplifiedText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Hi Shyguy!", "{textBlock}.model.simplifiedText"]
                },
                {
                    func: "{textBlock}.applier.change",
                    args: ["simplifiedText", "Hi Rootbeer!"]
                },
                {
                    changeEvent: "{textBlock}.applier.modelChanged",
                    path: "simplifiedText",
                    listener: "sjrk.storyTelling.testUtils.assertElementValue",
                    args: ["{textBlock}.dom.textBlockSimplifiedText", "Hi Rootbeer!"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.textBlockTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            textBlock: {
                type: "sjrk.storyTelling.block.testTextBlock",
                container: "#testText",
                createOnEvent: "{textBlockTester}.events.onTestCaseStart"
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
