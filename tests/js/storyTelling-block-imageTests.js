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

    fluid.defaults("sjrk.storyTelling.block.testImage", {
        gradeNames: ["sjrk.storyTelling.block.image"],
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

    fluid.defaults("sjrk.storyTelling.block.imageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Text Block.",
            tests: [{
                name: "Test Text Block",
                expect: 1,
                sequence: [{
                    event: "{imageTest image}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.block.imageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            image: {
                type: "sjrk.storyTelling.block.testImage",
                container: "#testImage",
                createOnEvent: "{imageTester}.events.onTestCaseStart"
            },
            imageTester: {
                type: "sjrk.storyTelling.block.imageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.block.imageTest"
        ]);
        sjrk.storyTelling.block.testImage("#testImageManual");
    });

})(jQuery, fluid);
