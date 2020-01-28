/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.blockUi.editor.testVideoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.videoBlockEditor"],
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

    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Video Block Editor.",
            tests: [{
                name: "Test Video Block Editor",
                expect: 4,
                sequence: [{
                    event: "{videoBlockEditorTest videoBlockEditor binder}.events.onUiReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{videoBlockEditor}.binder", "videoAltText", "Alternative text for the video"]
                },
                {
                    changeEvent: "{videoBlockEditor}.block.applier.modelChanged",
                    path: "alternativeText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Alternative text for the video", "{videoBlockEditor}.block.model.alternativeText"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{videoBlockEditor}.binder", "videoDescription", "Description for video"]
                },
                {
                    changeEvent: "{videoBlockEditor}.block.applier.modelChanged",
                    path: "description",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Description for video", "{videoBlockEditor}.block.model.description"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{videoBlockEditor}.dom.videoUploadButton"
                },
                {
                    event: "{videoBlockEditor}.events.onVideoUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The videoUploadButton event fired"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.blockUi.editor.videoBlockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            videoBlockEditor: {
                type: "sjrk.storyTelling.blockUi.editor.testVideoBlockEditor",
                container: "#testVideoBlockEditor",
                createOnEvent: "{videoBlockEditorTester}.events.onTestCaseStart"
            },
            videoBlockEditorTester: {
                type: "sjrk.storyTelling.blockUi.editor.videoBlockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.blockUi.editor.videoBlockEditorTest"
        ]);
    });

})(jQuery, fluid);
