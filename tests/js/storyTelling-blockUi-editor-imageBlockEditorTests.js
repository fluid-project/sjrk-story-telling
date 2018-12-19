/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.blockUi.editor.testImageBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.imageBlockEditor"],
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

    fluid.defaults("sjrk.storyTelling.blockUi.editor.imageBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Image Block Editor.",
            tests: [{
                name: "Test Image Block Editor",
                expect: 5,
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
                },
                {
                    jQueryTrigger: "click",
                    element: "{imageBlockEditor}.dom.imageCaptureButton"
                },
                {
                    event: "{imageBlockEditor}.events.imageCaptureRequested",
                    listener: "jqUnit.assert",
                    args: ["The imageCaptureRequested event fired"]
                }]
            }]
        }]
    });

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
