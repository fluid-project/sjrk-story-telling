/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
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
                }, {
                    jQueryTrigger: "click",
                    element: "{imageBlockEditor}.dom.imageUploadButton"
                }, {
                    event: "{imageBlockEditor}.events.imageUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The onUploadRequested event fired"]
                }
                // TODO: make these context-aware tests
               //  {
               //     jQueryTrigger: "click",
               //     element: "{imageBlock}.dom.imageCaptureButton"
               // }, {
               //     event: "{imageBlock}.events.imageCaptureRequested",
               //     listener: "jqUnit.assert",
               //     args: ["The imageUploadRequested event fired"]
               // }
                ]
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
