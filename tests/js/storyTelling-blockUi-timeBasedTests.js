/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // testing time-based media using a video as the sample file
    fluid.defaults("sjrk.storyTelling.blockUi.testTimeBased", {
        gradeNames: ["sjrk.storyTelling.blockUi.timeBased"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../..",
                        templatePath: "%resourcePrefix/src/templates/storyBlockVideoView.handlebars"
                    }
                }
            },
            block: {
                options: {
                    model: {
                        mediaUrl: "../video/shyguy_and_rootbeer.mp4"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.blockUi.timeBasedTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Time Based Block UI.",
            tests: [{
                name: "Test Time Based Block UI (video)",
                expect: 1,
                sequence: [{
                    event: "{timeBasedTest timeBased}.events.onMediaLoaded",
                    listener: "jqUnit.assert",
                    args: ["Media player has been loaded"]
                //},
                // Autoplay is now disabled in most browsers, so testing the play
                // invoker is not feasible at the time of writing (2018-12-20)
                // {
                //     func: "{timeBased}.playMediaPlayer"
                // },
                // {
                //     event: "{timeBasedTest timeBased}.events.onMediaPlay",
                //     listener: "jqUnit.assert",
                //     args: ["Media player played successfully"]
                // },
                // {
                //     funcName: "fluid.identity"
                // },
                // {
                //     event: "{timeBasedTest timeBased}.events.onMediaEnded",
                //     listener: "jqUnit.assert",
                //     args: ["Media player playback ended"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.blockUi.timeBasedTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            timeBased: {
                type: "sjrk.storyTelling.blockUi.testTimeBased",
                container: "#testTimeBased",
                createOnEvent: "{timeBasedTester}.events.onTestCaseStart"
            },
            timeBasedTester: {
                type: "sjrk.storyTelling.blockUi.timeBasedTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.blockUi.timeBasedTest"
        ]);
    });

})(jQuery, fluid);
