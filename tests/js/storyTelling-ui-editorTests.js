/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui.testEditor", {
        gradeNames: ["sjrk.storyTelling.ui.editor"],
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

    fluid.setLogging(true);

    fluid.defaults("sjrk.storyTelling.ui.editorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 2,
                sequence: [{
                    "event": "{editorTest binder}.events.onBindingApplied",
                    listener: "jqUnit.assert",
                    args: ["onBindingApplied event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{editor}.dom.storySubmit"
                },
                {
                    "event": "{editor}.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                // TODO: move storyListenTo tests to the uiManager test suite
                // },
                // {
                //     "jQueryTrigger": "click",
                //     "element": "{editor}.dom.storyListenTo"
                // },
                // {
                //     "event": "{editor}.events.onStoryListenToRequested",
                //     listener: "jqUnit.assert",
                //     args: "onStoryListenToRequested event fired."
                }]
            },
            {
                name: "Test language input relays",
                expect: 7,
                sequence: [{
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{editor}","storyLanguage","Esperanto"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Model language value relayed from text input field", "{editor}.story.model.languageFromInput", "{editor}.story.model.language"]
                },
                {
                    func: "jqUnit.assertNotEquals",
                    args: ["Model languageFromInput value not relayed to languageFromSelect field", "{editor}.story.model.languageFromInput", "{editor}.story.model.languageFromSelect"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{editor}","storyLanguageList","fr-CA"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Select field value updated", "{editor}.story.model.languageFromSelect", "fr-CA"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Model language value relayed from select field", "{editor}.story.model.languageFromSelect", "{editor}.story.model.language"]
                },
                {
                    func: "jqUnit.assertNotEquals",
                    args: ["Model languageFromSelect value not relayed to languageFromInput field", "{editor}.story.model.languageFromSelect", "{editor}.story.model.languageFromInput"]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{editor}","storyLanguage","Interlingua"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Model language value relayed from text input field", "{editor}.story.model.languageFromInput", "{editor}.story.model.language"]
                },
                {
                    func: "jqUnit.assertNotEquals",
                    args: ["Model languageFromInput value not relayed to languageFromSelect field", "{editor}.story.model.languageFromInput", "{editor}.story.model.languageFromSelect"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.ui.editorTester.testGetClasses = function (component) {
        var suffix = "testFunction";
        var classes = component.getClasses(suffix);
        var expectedClasses = "testc-testFunction test-testFunction";

        jqUnit.assertEquals("Generated classes are expected value", expectedClasses, classes);
    };

    fluid.defaults("sjrk.storyTelling.ui.editorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            editor: {
                type: "sjrk.storyTelling.ui.testEditor",
                container: "#testEditor",
                createOnEvent: "{editorTester}.events.onTestCaseStart"
            },
            editorTester: {
                type: "sjrk.storyTelling.ui.editorTester"
            }
        }
    });

    sjrk.storyTelling.ui.editorTest.testGetLabelId = function (prefix) {
        var label1 = sjrk.storyTelling.ui.editor.getLabelId(prefix);
        var label2 = sjrk.storyTelling.ui.editor.getLabelId(prefix);

        jqUnit.assertNotEquals("Two generated labels are not identical", label1, label2);

        jqUnit.assertEquals("Generated label begins with prefix and dash", 0, label1.indexOf(prefix + "-"));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.editorTest"
        ]);
    });

})(jQuery, fluid);
