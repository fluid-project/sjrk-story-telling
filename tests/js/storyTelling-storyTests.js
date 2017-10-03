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

    fluid.defaults("sjrk.storyTelling.story.testStory", {
        gradeNames: ["sjrk.storyTelling.story.ui"],
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyView.handlebars"
                    },
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
                }]// Test 2: (if possible) ensure that {storySpeaker}.queueSpeech is called?
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
