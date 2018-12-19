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
    fluid.defaults("sjrk.storyTelling.blockUi.timeBased", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        selectors: {
            mediaPlayerPreview: ".sjrkc-st-block-media-preview"
        },
        events: {
            onMediaPlayerStop: null
        },
        invokers: {
            "updateMediaPlayer": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer",
                "args": ["{that}.dom.mediaPlayerPreview", "{arguments}.0"]
            },
            "stopMediaPlayer": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.stopMediaPlayer",
                "args": ["{that}.dom.mediaPlayerPreview"]
            }
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": {
                func: "{that}.updateMediaPlayer",
                args: ["{that}.block.model.mediaUrl"]
            },
            "onMediaPlayerStop.stopMediaPlayer": "{that}.stopMediaPlayer"
        },
        block: {
            type: "sjrk.storyTelling.block.timeBased"
        }
    });

    /* Updates the HTML preview of a media player associated with a given block.
     * If a media player was playing, it will be stopped before loading.
     * - "mediaPlayer": the jQueryable containing the HTML video or audio element
     * - "mediaUrl": the URL of the media source file
     */
    sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer = function (mediaPlayer, mediaUrl) {
        if (mediaPlayer) {
            var mediaPlayerMarkup = mediaUrl ? "<source src=\"" + mediaUrl + "\">\nThis is the media player preview" : "";
            mediaPlayer.html(mediaPlayerMarkup);

            if (mediaUrl && mediaPlayer[0]) {
                sjrk.storyTelling.blockUi.timeBased.stopMediaPlayer(mediaPlayer);
                mediaPlayer[0].load();
            }
        } else {
            fluid.fail("The mediaPlayer is not valid");
        }
    };

    /* Pauses and rewinds a given media player
     * If a media player was playing, it will be stopped before loading.
     * - "mediaPlayer": the jQueryable containing the HTML video or audio element
     */
    sjrk.storyTelling.blockUi.timeBased.stopMediaPlayer = function (mediaPlayer) {
        if (mediaPlayer[0]) {
            mediaPlayer[0].pause();
            mediaPlayer[0].currentTime = 0;
        }
    };

})(jQuery, fluid);
