/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // the grade for any blockUi that has time-based media
    fluid.defaults("sjrk.storyTelling.blockUi.timeBased", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        selectors: {
            mediaPreview: ".sjrkc-st-block-media-preview"
        },
        events: {
            onTemplateReady: "{that}.templateManager.events.onTemplateRendered",
            onMediaPlayerStop: null,
            onMediaReady: null,
            onMediaDurationChange: null,
            onMediaPlay: null,
            onMediaEnded: null
        },
        invokers: {
            updateMediaPreview: {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.updateMediaPreview",
                "args": ["{that}.dom.mediaPreview", "{arguments}.0"]
            },
            stopMediaPlayer: {
                func: "{that}.events.onMediaPlayerStop.fire",
                args: ["{that}"]
            },
            playMediaPlayer: {
                "funcName": "sjrk.storyTelling.blockUi.timeBased.playMediaPlayer",
                "args": ["{that}.dom.mediaPreview"]
            }
        },
        // describes the relationship of DOM events to associated Infusion events
        mediaPlayerEventMapping : {
            canplay: "onMediaReady",
            durationchange: "onMediaDurationChange",
            ended: "onMediaEnded",
            play: "onMediaPlay"
        },
        listeners: {
            "onTemplateReady.updateMediaPreviewUrl": {
                func: "{that}.updateMediaPreview",
                args: ["{that}.block.model.mediaUrl"]
            },
            "onTemplateReady.registerMediaPlayerEvents": {
                funcName: "sjrk.storyTelling.blockUi.timeBased.registerMediaPlayerEvents",
                args: ["{that}", "{that}.dom.mediaPreview.0", "{that}.options.mediaPlayerEventMapping"]
            },
            "onMediaPlayerStop.pauseMediaPlayer": {
                "this": "{that}.dom.mediaPreview.0",
                method: "pause"
            },
            "onMediaPlayerStop.resetMediaPlayerTime": {
                funcName: "sjrk.storyTelling.blockUi.timeBased.resetMediaPlayerTime",
                args: ["{that}.dom.mediaPreview.0"],
                priority: "after:pauseMediaPlayer"
            }
        },
        block: {
            type: "sjrk.storyTelling.block.timeBased"
        }
    });

    /**
     * Registers listeners for DOM events which in turn fire Infusion events
     * as specified by a given mapping between the two
     *
     * the pattern is { domEventName: "{component}.events.eventName.fire" }
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.blockUi.timeBased`
     * @param {jQuery} mediaPlayer - the jQueryable containing the HTML video or audio element
     * @param {Object.<String, String>} eventMapping - a mapping between DOM and Infusion events
     */
    sjrk.storyTelling.blockUi.timeBased.registerMediaPlayerEvents = function (that, mediaPlayer, eventMapping) {
        fluid.each(eventMapping, function (infusionEvent, domEvent) {
            mediaPlayer.addEventListener(domEvent, that.events[infusionEvent].fire);
        });
    };

    /**
     * Updates the HTML preview of a media player associated with a given block.
     * If a media player was playing, it will be stopped before loading.
     *
     * @param {jQuery} mediaPlayer - the jQueryable containing the HTML video or audio element
     * @param {String} mediaUrl - the URL of the media source file
     */
    sjrk.storyTelling.blockUi.timeBased.updateMediaPreview = function (mediaPlayer, mediaUrl) {
        mediaPlayer.prop("controls", !!mediaUrl);
        mediaPlayer.attr("src", mediaUrl);
        mediaPlayer[0].load();
    };

    /**
     * Rewinds a given media player to the beginning
     *
     * @param {jQuery} mediaPlayer - the jQueryable containing the HTML video or audio element
     */
    sjrk.storyTelling.blockUi.timeBased.resetMediaPlayerTime = function (mediaPlayer) {
        mediaPlayer.currentTime = 0;
    };

    /**
     * Plays a given media player, though it must first mute the player to satisfy
     * autoplay restrictions in several browsers. In the case of Chrome, please
     * refer to {@link https://developers.google.com/web/updates/2017/09/autoplay-policy-changes|this article}
     *
     * @param {jQuery} mediaPlayer - the jQueryable containing the HTML video or audio element
     */
    sjrk.storyTelling.blockUi.timeBased.playMediaPlayer = function (mediaPlayer) {
        mediaPlayer.prop("muted", true);

        var promise = mediaPlayer[0].play();
        if (promise) {
            promise.then(function () {
                fluid.log("Media player playback triggered");
            }, function (error) {
                fluid.log(fluid.logLevel.WARN, "Error:", error, "message:", error.message);
            });
        }
    };

})(jQuery, fluid);
