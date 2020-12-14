/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global jqUnit */

"use strict";

(function ($, fluid) {

    fluid.registerNamespace("sjrk.storyTelling");

    // Feature detection to see if mp4 video format is supported
    // Once SJRK-381 has been addressed we should be able to provide the fallback video sources
    // rather than using context awareness.
    // see: https://issues.fluidproject.org/browse/SJRK-381
    sjrk.storyTelling.isVideoFormatSupported = function (format) {
        var video = document.createElement("video");
        return !!video.canPlayType(format); // !! forces a boolean result
    };

    fluid.contextAware.makeChecks({
        "fluid.supportsMP4": sjrk.storyTelling.isVideoFormatSupported("video/mp4")
    });

    fluid.defaults("sjrk.storyTelling.blockUi.testTimeBased.webm", {
        model: {
            mediaUrl: "../../testData/shyguy_and_rootbeer.webm"
        }
    });

    fluid.defaults("sjrk.storyTelling.blockUi.testTimeBased.mp4", {
        model: {
            mediaUrl: "../../testData/shyguy_and_rootbeer.mp4"
        }
    });

    // Testing time-based media using a video as the sample file
    fluid.defaults("sjrk.storyTelling.blockUi.testTimeBased", {
        gradeNames: ["sjrk.storyTelling.blockUi.timeBased"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base",
                        templatePath: "%resourcePrefix/templates/storyBlockVideoView.hbs"
                    }
                }
            },
            block: {
                options: {
                    gradeNames: ["fluid.contextAware"],
                    contextAwareness: {
                        videoFormat: {
                            checks: {
                                supportsMP4: {
                                    contextValue: "{fluid.supportsMP4}",
                                    gradeNames: "sjrk.storyTelling.blockUi.testTimeBased.mp4"
                                }
                            },
                            defaultGradeNames: "sjrk.storyTelling.blockUi.testTimeBased.webm"
                        }
                    }
                }
            }
        }
    });

    // Test cases and sequences for the time-based media block UI
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
                    args: ["{timeBased}.dom.mediaPreview", "{timeBased}.dom.mediaPreview.0.duration"]
                },
                {
                    func: "{timeBased}.stopMediaPlayer"
                },
                {
                    event: "{timeBased}.events.onMediaPlayerStop",
                    listener: "sjrk.storyTelling.blockUi.timeBasedTester.verifyMediaPlayerTime",
                    args: ["{timeBased}.dom.mediaPreview", 0]
                }]
            }]
        }]
    });

    /**
     * Verifies that the media player is at the expected time
     *
     * @param {jQuery} mediaPlayer - the media player ("audio" or "video") DOM element
     * @param {Number} expectedCurrentTime - the expected current playback time on the media player
     */
    sjrk.storyTelling.blockUi.timeBasedTester.verifyMediaPlayerTime = function (mediaPlayer, expectedCurrentTime) {
        var actualCurrentTime = mediaPlayer[0].currentTime;
        jqUnit.assertEquals("The current time of the media player is as expected", expectedCurrentTime, actualCurrentTime);
    };

    // Test environment
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
