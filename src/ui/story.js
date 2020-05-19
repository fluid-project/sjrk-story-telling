/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    // The data model for all stories
    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            id: null, // to be filled in on initialization
            title: "",
            content: [
                // a collection of sjrk.storyTelling.block data.
                // blocks contain the type of block and fields
                // specific to and consistent with that type.
                // e.g.
                // {
                //     blockType: "text",
                //     id: "id-123",
                //     language: "en-CA",
                //     heading: "An appropriate header",
                //     text: "This is the main text of this block",
                // }
            ],
            author: "",
            tags: [],
            published: false,
            // These timestamps are intended to be in ISO-8601 format and UTC time
            // https://en.wikipedia.org/wiki/ISO_8601
            // E.g. "2020-04-22T16:50:44.324Z"
            timestampCreated: "",
            timestampLastModified: "",
            timestampPublished: ""
        },
        invokers: {
            "updateLastModified": {
                funcName: "sjrk.storyTelling.story.updateLastModified",
                args: "{that}"
            }
        },
        modelListeners: {
            "": {
                func: "{that}.updateLastModified",
                excludeSource: "init",
                namespace: "updateLastModified"
            }
        }
    });

    /**
     * Updates timestampLastModified with the current date and time
     *
     * @param {Component} storyComponent - an instance of `sjrk.storyTelling.story`
     */
    sjrk.storyTelling.story.updateLastModified = function (storyComponent) {
        storyComponent.applier.change("timestampLastModified", new Date().toISOString());
    };

})(jQuery, fluid);
