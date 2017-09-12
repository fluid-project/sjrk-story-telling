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
        model: {
            title: "TestTitle",
            author: "TestAuthor",
            content: "Test Content"
        },
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "./src/templates/storyEdit.html"
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
                expect: 1,
                sequence: [{
                    "func": "jqUnit.assert",
                    "args": ["no tests yet"]
                    //TODO: rebuild the tests post-refactor
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.storyTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            story: {
                type: "sjrk.storyTelling.story.testStory",
                createOnEvent: "{storyTester}.events.onTestCaseStart"
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
