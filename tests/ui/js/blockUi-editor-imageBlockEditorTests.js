/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Test component for the image block editor grade
    fluid.defaults("sjrk.storyTelling.blockUi.editor.testImageBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.imageBlockEditor"],
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

    // Test cases and sequences for the image block editor
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Image Block Editor.",
            tests: [{
                name: "Test Image Block Editor",
                expect: 4,
                sequence: [{
                    event: "{imageBlockEditorTest imageBlockEditor binder}.events.onUiReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{imageBlockEditor}.binder", "imageAltText", "Alternative text for the image"]
                },
                {
                    changeEvent: "{imageBlockEditor}.block.applier.modelChanged",
                    path: "alternativeText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Alternative text for the image", "{imageBlockEditor}.block.model.alternativeText"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{imageBlockEditor}.binder", "imageDescription", "Caption for image"]
                },
                {
                    changeEvent: "{imageBlockEditor}.block.applier.modelChanged",
                    path: "description",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Caption for image", "{imageBlockEditor}.block.model.description"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{imageBlockEditor}.dom.imageUploadButton"
                },
                {
                    event: "{imageBlockEditor}.events.onImageUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The imageUploadButton event fired"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            imageBlockEditor: {
                type: "sjrk.storyTelling.blockUi.editor.testImageBlockEditor",
                container: "#testImageBlockEditor",
                createOnEvent: "{imageBlockEditorTester}.events.onTestCaseStart"
            },
            imageBlockEditorTester: {
                type: "sjrk.storyTelling.blockUi.editor.imageBlockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.blockUi.editor.imageBlockEditorTest"
        ]);
    });

})(jQuery, fluid);
