/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

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
                expect: 4,
                sequence: [{
                    event: "{timeBasedTest timeBased}.events.onMediaReady",
                    listener: "jqUnit.assert",
                    args: ["Media player has been loaded and is ready to play"]
                },
                {
                    func: "{timeBased}.playMediaPlayer"
                },
                {
                    event: "{timeBased}.events.onMediaPlay",
                    listener: "jqUnit.assert",
                    args: ["Media player playback started successfully"]
                },
                {
                    func: "fluid.identity"
                },
                {
                    event: "{timeBased}.events.onMediaEnded",
                    listener: "sjrk.storyTelling.blockUi.timeBasedTester.verifyMediaPlayerTime",
                    args: ["{timeBased}.dom.mediaPlayer", "{timeBased}.dom.mediaPlayer.0.duration"]
                },
                {
                    func: "{timeBased}.stopMediaPlayer"
                },
                {
                    event: "{timeBased}.events.onMediaPlayerStop",
                    listener: "sjrk.storyTelling.blockUi.timeBasedTester.verifyMediaPlayerTime",
                    args: ["{timeBased}.dom.mediaPlayer", 0]
                }]
            }]
        }]
    });

    sjrk.storyTelling.blockUi.timeBasedTester.verifyMediaPlayerTime = function (mediaPlayer, expectedCurrentTime) {
        var actualCurrentTime = mediaPlayer[0].currentTime;
        jqUnit.assertEquals("The current time of the media player is as expected", expectedCurrentTime, actualCurrentTime);
    };

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
