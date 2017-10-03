/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.testStoryViewer", {
        gradeNames: ["sjrk.storyTelling.story.storyViewer"],
        model: {
            title: "Test title",
            content: "Some content",
            author: "Author",
            tags: ["tag1","tag2","tag3"]
        },
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

    var expectedElements = [
        {
            selector: "storyTitle",
            expected: "Test title"
        },
        {
            selector: "storyContent",
            expected: "Some content"
        },
        {
            selector: "storyAuthor",
            expected: "by Author"
        },
        {
            selector: "storyTags",
            expected: "tag1, tag2, tag3"
        }
    ];

    fluid.defaults("sjrk.storyTelling.storyViewerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story viewer.",
            tests: [{
                name: "Test 'Done' button",
                expect: 5,
                sequence: [{
                    "event": "{storyViewerTest storyViewer}.events.onTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["onTemplateRendered event fired"]
                },
                {
                    func: "sjrk.storyTelling.storyViewerTester.verifyElementsRendered",
                    args: ["{storyViewer}",expectedElements]
                }
                ]
            }]
        }]
    });

    sjrk.storyTelling.storyViewerTester.verifyElementsRendered = function (component, elementSpec) {
        fluid.each(elementSpec, function (el) {
            var domValue = component.locate(el.selector).text().trim();

            jqUnit.assertEquals("The element " + el.selector + " matches expected",el.expected, domValue);
        });
    };

    fluid.defaults("sjrk.storyTelling.storyViewerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyViewer: {
                type: "sjrk.storyTelling.story.testStoryViewer",
                container: "#testStoryViewer",
                createOnEvent: "{storyViewerTester}.events.onTestCaseStart"
            },
            storyViewerTester: {
                type: "sjrk.storyTelling.storyViewerTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyViewerTest"
        ]);
    });

})(jQuery, fluid);
