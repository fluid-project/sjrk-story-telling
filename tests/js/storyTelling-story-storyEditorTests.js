/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.testStoryEditor", {
        gradeNames: ["sjrk.storyTelling.story.storyEditor"],
        components: {
            resourceLoader: {
                options: {
                    terms: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.storyEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story editor.",
            tests: [{
                name: "Test UI controls",
                expect: 3,
                sequence: [{
                    "event": "{storyEditorTest storyEditor}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storySubmit"
                },
                {
                    "event": "{storyEditor}.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEditor}.dom.storyListenTo"
                },
                {
                    "event": "{storyEditor}.events.onStoryListenToRequested",
                    listener: "jqUnit.assert",
                    args: "onStoryListenToRequested event fired."
                }]
            },
            {
                name: "Test language input relays",
                expect: 4,
                sequence: [{
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEditor}","storyLanguage","Esperanto"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Model language value relayed from text input field", "{storyEditor}.model.languageFromInput", "{storyEditor}.model.language"]
                },
                {
                    func: "jqUnit.assertNotEquals",
                    args: ["Model languageFromInput value not relayed to languageFromSelect field", "{storyEditor}.model.languageFromInput", "{storyEditor}.model.languageFromSelect"]
                }, {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEditor}","storyLanguageList","fr-CA"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Model language value relayed from select field", "{storyEditor}.model.languageFromSelect", "{storyEditor}.model.language"]
                },
                {
                    func: "jqUnit.assertNotEquals",
                    args: ["Model languageFromSelect value not relayed to languageFromInput field", "{storyEditor}.model.languageFromSelect", "{storyEditor}.model.languageFromInput"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEditor: {
                type: "sjrk.storyTelling.story.testStoryEditor",
                container: "#testStoryEditor",
                createOnEvent: "{storyEditorTester}.events.onTestCaseStart"
            },
            storyEditorTester: {
                type: "sjrk.storyTelling.storyEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyEditorTest"
        ]);
    });

})(jQuery, fluid);
