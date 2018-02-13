/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.block.testImageBlock", {
        gradeNames: ["sjrk.storyTelling.block.imageBlock"],
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

    fluid.defaults("sjrk.storyTelling.block.imageBlockTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Image Block.",
            tests: [{
                name: "Test Image Block",
                expect: 5,
                sequence: [{
                    event: "{imageBlockTest imageBlock}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{imageBlock}", "imageAltText", "Alternative text for the image"]
                },
                {
                    changeEvent: "{imageBlock}.applier.modelChanged",
                    path: "alternativeText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Alternative text for the image", "{imageBlock}.model.alternativeText"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{imageBlock}", "imageDescription", "Caption for image"]
                },
                {
                    changeEvent: "{imageBlock}.applier.modelChanged",
                    path: "description",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Caption for image", "{imageBlock}.model.description"]
                }, {
                    jQueryTrigger: "click",
                    element: "{imageBlock}.dom.imageUploadButton"
                }, {
                    event: "{imageBlock}.events.imageUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The imageUploadRequested event fired"]
                },
                {
                   jQueryTrigger: "click",
                   element: "{imageBlock}.dom.imageCaptureButton"
               }, {
                   event: "{imageBlock}.events.imageCaptureRequested",
                   listener: "jqUnit.assert",
                   args: ["The imageUploadRequested event fired"]
               }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.imageBlockTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            imageBlock: {
                type: "sjrk.storyTelling.block.testImageBlock",
                container: "#testImage",
                createOnEvent: "{imageBlockTester}.events.onTestCaseStart"
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
        sjrk.storyTelling.block.testImageBlock("#testImageManual");
    });

})(jQuery, fluid);
