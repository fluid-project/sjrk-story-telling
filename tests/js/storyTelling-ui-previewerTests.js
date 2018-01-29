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

    fluid.defaults("sjrk.storyTelling.ui.testPreviewer", {
        gradeNames: ["sjrk.storyTelling.ui.previewer"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../.."
                    }
                }
            },
            story: {
                options: {
                    model: {
                        title: "Test title",
                        content: "Some content",
                        author: "Author",
                        tags: ["tag1","tag2","tag3"]
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.ui.previewerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Previewer UI.",
            tests: [{
                name: "Test UI controls",
                expect: 4,
                sequence: [{
                    "event": "{previewerTest previewer}.events.onReadyToBind",
                    listener: "jqUnit.assert",
                    args: ["onReadyToBind event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{previewer}.dom.storySaveNoShare"
                },
                {
                    "event": "{previewer}.events.onSaveNoShareRequested",
                    listener: "jqUnit.assert",
                    args: "onSaveNoShareRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{previewer}.dom.storyPreviewerPrevious"
                },
                {
                    "event": "{previewer}.events.onPreviewerPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onPreviewerPreviousRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{previewer}.dom.storyListenTo"
                },
                {
                    "event": "{previewer}.events.onStoryListenToRequested",
                    listener: "jqUnit.assert",
                    args: "onStoryListenToRequested event fired."
                }]
            },
            {
                name: "Test language name resolution",
                expect: 4,
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Language name initial state is blank, as expected", "{previewer}.story.model.languageName", ""]
                },
                {
                    func: "{previewer}.story.applier.change",
                    args: ["language", "fa"]
                },
                {
                    changeEvent: "{previewer}.story.applier.modelChanged",
                    path: "language",
                    listener: "jqUnit.assertEquals",
                    args: ["Language name has been resolved to expected existing value", "Farsi", "{previewer}.story.model.languageName"]
                },
                {
                    func: "{previewer}.story.applier.change",
                    args: ["language", "fr-CA"]
                },
                {
                    changeEvent: "{previewer}.story.applier.modelChanged",
                    path: "language",
                    listener: "jqUnit.assertEquals",
                    args: ["Language name has been resolved to another expected existing value", "French (Canada)", "{previewer}.story.model.languageName"]
                },
                {
                    func: "{previewer}.story.applier.change",
                    args: ["language", "zh"]
                },
                {
                    changeEvent: "{previewer}.story.applier.modelChanged",
                    path: "language",
                    listener: "jqUnit.assertEquals",
                    args: ["Language name has not been resolved to an existing value, as expected", "zh", "{previewer}.story.model.languageName"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.ui.previewerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            previewer: {
                type: "sjrk.storyTelling.ui.testPreviewer",
                container: "#testPreviewer",
                createOnEvent: "{previewerTester}.events.onTestCaseStart"
            },
            previewerTester: {
                type: "sjrk.storyTelling.ui.previewerTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.previewerTest"
        ]);
    });

})(jQuery, fluid);
