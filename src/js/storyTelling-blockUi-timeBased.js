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
            mediaPlayer: ".sjrkc-st-block-media-preview"
        },
        events: {
            onMediaPlayerStop: null,
            onMediaLoaded: null,
            onMediaPlay: null,
            onMediaEnded: null
        },
        invokers: {
            "updateMediaPlayer": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer",
                "args": ["{that}", "{that}.dom.mediaPlayer", "{arguments}.0"]
            },
            "stopMediaPlayer": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.stopMediaPlayer",
                "args": ["{that}.dom.mediaPlayer"]
            },
            "playMediaPlayer": {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.playMediaPlayer",
                "args": ["{that}.dom.mediaPlayer"]
            }
        },
        listeners: {
            "{templateManager}.events.onTemplateRendered": [{
                funcName: "sjrk.storyTelling.blockUi.timeBased.addEventListeners",
                args: ["{that}", "{that}.dom.mediaPlayer"],
                priority: "first"
            },
            {
                func: "{that}.updateMediaPlayer",
                args: ["{that}.block.model.mediaUrl"]
            }],
            "onMediaPlayerStop.stopMediaPlayer": "{that}.stopMediaPlayer"
        },
        block: {
            type: "sjrk.storyTelling.block.timeBased"
        }
    });

    /* Attaches infusion component events to native HTML audio/video events
     * - "component": the time-based block UI component
     * - "mediaPlayer": the jQueryable containing the HTML video or audio element
     */
    sjrk.storyTelling.blockUi.timeBased.addEventListeners = function (component, mediaPlayer) {
        mediaPlayer[0].addEventListener("loadeddata", component.events.onMediaLoaded.fire());
        mediaPlayer[0].addEventListener("play", component.events.onMediaPlay.fire());
        mediaPlayer[0].addEventListener("ended", component.events.onMediaEnded.fire());
    };

    /* Updates the HTML preview of a media player associated with a given block.
     * If a media player was playing, it will be stopped before loading.
     * - "component": the time-based block UI component
     * - "mediaPlayer": the jQueryable containing the HTML video or audio element
     * - "mediaUrl": the URL of the media source file
     */
    sjrk.storyTelling.blockUi.timeBased.updateMediaPlayer = function (component, mediaPlayer, mediaUrl) {
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

    /* Plays a given media player, though this will not work properly unless
     * triggered by user action, in accordance with the requirements laid out,
     * in the case of Chrome, here: https://goo.gl/xX8pDD
     * - "mediaPlayer": the jQueryable containing the HTML video or audio element
     */
    sjrk.storyTelling.blockUi.timeBased.playMediaPlayer = function (mediaPlayer) {
        var promise = mediaPlayer[0].play();

        if (promise) {
            promise.then(function () {
                console.log("playing!");
            }, function (error) {
                console.log("error:", error, "message:", error.message);
            });
        }
    };

})(jQuery, fluid);
