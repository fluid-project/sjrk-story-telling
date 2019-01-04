/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.blockUi.editor.testAudioBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor.audioBlockEditor"],
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

    fluid.defaults("sjrk.storyTelling.blockUi.editor.audioBlockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Audio Block Editor.",
            tests: [{
                name: "Test Audio Block Editor",
                expect: 5,
                sequence: [{
                    event: "{audioBlockEditorTest audioBlockEditor binder}.events.onUiReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["The template has been loaded and rendered"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{audioBlockEditor}.binder", "audioAltText", "Alternative text for the audio"]
                },
                {
                    changeEvent: "{audioBlockEditor}.block.applier.modelChanged",
                    path: "alternativeText",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Alternative text for the audio", "{audioBlockEditor}.block.model.alternativeText"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{audioBlockEditor}.binder", "audioDescription", "Description for audio"]
                },
                {
                    changeEvent: "{audioBlockEditor}.block.applier.modelChanged",
                    path: "description",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Description for audio", "{audioBlockEditor}.block.model.description"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{audioBlockEditor}.binder", "audioTranscript", "Transcript for audio"]
                },
                {
                    changeEvent: "{audioBlockEditor}.block.applier.modelChanged",
                    path: "transcript",
                    listener: "jqUnit.assertEquals",
                    args: ["The model text has expected value", "Transcript for audio", "{audioBlockEditor}.block.model.transcript"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{audioBlockEditor}.dom.audioUploadButton"
                },
                {
                    event: "{audioBlockEditor}.events.onAudioUploadRequested",
                    listener: "jqUnit.assert",
                    args: ["The audioUploadButton event fired"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.blockUi.editor.audioBlockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            audioBlockEditor: {
                type: "sjrk.storyTelling.blockUi.editor.testAudioBlockEditor",
                container: "#testAudioBlockEditor",
                createOnEvent: "{audioBlockEditorTester}.events.onTestCaseStart"
            },
            audioBlockEditorTester: {
                type: "sjrk.storyTelling.blockUi.editor.audioBlockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.blockUi.editor.audioBlockEditorTest"
        ]);
    });

})(jQuery, fluid);
