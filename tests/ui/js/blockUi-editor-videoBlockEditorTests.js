/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the video block editor grade
    fluid.defaults("sjrk.storyTelling.blockUi.editor.testVideoBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.videoBlockEditor"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    // Test cases and sequences for the video block editor
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
                    args: ["{videoBlockEditor}.binder", "mediaAltText", "Alternative text for the video"]
                },
                {
                    changeEvent: "{videoBlockEditor}.block.applier.modelChanged",
                    path: "alternativeText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Alternative text for the video", "{videoBlockEditor}.block.model.alternativeText"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{videoBlockEditor}.binder", "mediaDescription", "Description for video"]
                },
                {
                    changeEvent: "{videoBlockEditor}.block.applier.modelChanged",
                    path: "description",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Description for video", "{videoBlockEditor}.block.model.description"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{videoBlockEditor}.dom.uploadButton"
                },
                {
                    event: "{videoBlockEditor}.events.onMediaUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The uploadButton event fired"]
                }]
            }]
        }]
    });

    // Test environment
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
