/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.testStory", {
        gradeNames: ["sjrk.storyTelling.story.ui"],
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyView.handlebars"
                    },
                    terms: {
                        resourcePrefix: "../.."
                    }
                }
            },
            messageLoader: {
                options: {
                    terms: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.storyTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story",
            tests: [{
                name: "Test story",
                expect: 2,
                sequence: [{
                    "event": "{storyTest testStory}.events.onTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["onTemplateRendered event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{testStory}.dom.storyListenTo"
                },
                {
                    "event": "{testStory}.events.onStoryListenToRequested",
                    listener: "jqUnit.assert",
                    args: ["onStoryListenToRequested event fired"]
                }]// Test 2: (if possible) ensure that {storySpeaker}.onSpeechQueued is fired?
            }]
        },
        {
            name: "Test storySpeaker",
            tests: [{
                name: "Test storySpeaker",
                expect: 2,
                sequence: [{
                    func: "{testStory}.applier.change",
                    args: ["author", "Rootbeer"]
                },
                {
                    "changeEvent": "{testStory}.applier.modelChanged",
                    path: "author",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", ", by Rootbeer. ", "{testStory}.storySpeaker.model.ttsText"]
                },
                {
                    func: "{testStory}.applier.change",
                    args: ["title", "My brother Shyguy"]
                },
                {
                    "changeEvent": "{testStory}.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "My brother Shyguy, by Rootbeer. ", "{testStory}.storySpeaker.model.ttsText"]
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            story_ui: {
                type: "sjrk.storyTelling.story.testStory",
                createOnEvent: "{storyTester}.events.onTestCaseStart",
                container: "#testStoryUI"
            },
            storyTester: {
                type: "sjrk.storyTelling.storyTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTest"
        ]);
    });

})(jQuery, fluid);
