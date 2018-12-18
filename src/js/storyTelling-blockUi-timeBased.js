/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // the grade for any blockUi that has time-based media
    // block, regardless of type.
    fluid.defaults("sjrk.storyTelling.blockUi.timeBased", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        selectors: {
            videoPreview: ".sjrkc-st-block-video-preview"
        },
        events: {
            onVideoStop: null
        },
        invokers: {
            "updateVideoPreview": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer",
                "args": ["{that}.dom.videoPreview", "{arguments}.0"]
            },
            "stopVideo": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.stopMediaPlayback",
                "args": ["{that}.dom.videoPreview"]
            }
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                func: "{that}.updateVideoPreview",
                args: ["{that}.block.model.videoUrl"]
            },
            "onVideoStop.stopVideo": "{that}.stopVideo"
        }
    });

    /* Updates the HTML preview of a video associated with a given video block.
     * If a video was playing in the editor, it will be stopped before loading.
     * - "video": the jQueryable containing the HTML video element
     * - "videoUrl": the URL of the video source file
     */
    sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer = function (video, videoUrl) {
        var videoMarkup = videoUrl ? "<source src=\"" + videoUrl + "\">\nThis is the video preview" : "";
        video.html(videoMarkup);

        if (videoUrl && video[0]) {
            sjrk.storyTelling.blockUi.timeBased.stopMediaPlayback(video);
            video[0].load();
        }
    };

    /* Pauses and rewinds a given video
     * If a video was playing in the editor, it will be stopped before loading.
     * - "video": the jQueryable containing the HTML video element
     */
    sjrk.storyTelling.blockUi.timeBased.stopMediaPlayback = function (video) {
        if (video[0]) {
            video[0].pause();
            video[0].currentTime = 0;
        }
    };

})(jQuery, fluid);
