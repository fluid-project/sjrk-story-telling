/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

// This utility generates random stories with "lorem ipsum"-style
// content and pushes them into the storytelling server using the
// standard routes
//
// Useful for:
// - stress-testing
// - providing a certain amount of story content to work with when
// developing

"use strict";

var Chance = require("chance");
var chance = new Chance();
var kettle = require("kettle");
kettle.loadTestingSupportQuiet();

var sjrk = fluid.registerNamespace("sjrk");
var jqUnit = fluid.registerNamespace("jqUnit");

// a template to use when generating new stories
var storyTemplate = {
    "title": "%title",
    "content": [
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "image",
            "mediaUrl": "logo_small_fluid_vertical.png",
            "alternativeText": "Fluid",
            "description": "%imageCaption"
        },
        {
            "id": null,
            "language": null,
            "heading": null,
            "blockType": "text",
            "text": "%text"
        }
    ],
    "author": "%author",
    "language": "",
    "tags": [
        "test",
        "%tag1",
        "%tag2"
    ]
};

fluid.defaults("sjrk.storyTelling.server.storyFabricator.fabricateStoryRequest", {
    gradeNames: ["kettle.test.request.formData"],
    path: "/stories",
    method: "POST",
    formData: {
        files: {
            "file": ["./tests/testData/logo_small_fluid_vertical.png"]
        }
    }
});

jqUnit.asyncTest("kettle.JSON.readFileSync of invalid JSON", function () {

    jqUnit.expect(1);

    var storyValues = {
        author: chance.name(),
        title: chance.sentence({words: 4}),
        text: chance.paragraph(),
        imageCaption: chance.sentence({words: 7}),
        tag1: chance.word(),
        tag2: chance.word()
    };

    var fabricatedStoryModel = fluid.stringTemplate(JSON.stringify(storyTemplate), storyValues);

    var req = sjrk.storyTelling.server.storyFabricator.fabricateStoryRequest({
        formData: {
            fields: {
                "model": {
                    expander: {
                        type: "fluid.noexpand",
                        value: fabricatedStoryModel
                    }
                }
            }
        },
        listeners: {
            "onComplete.testDone": {
                "this": "jqUnit",
                "method": "assert",
                "args": ["story create request complete"]
            }
        }
    });

    req.send();
});
