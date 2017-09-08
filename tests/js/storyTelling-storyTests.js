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

    fluid.defaults("sjrk.storyTelling.story.testStory", {
        gradeNames: ["sjrk.storyTelling.story"],
        model: {
            title: "TestTitle",
            author: "TestAuthor",
            content: "Test Content"
        },
        components: {
            resourceLoader: {
                type: "fluid.resourceLoader",
                options: {
                    resources: {
                        componentTemplate: "%resourcePrefix/src/templates/storyEdit.html",
                        componentMessages: "%resourcePrefix/src/messages/storyEdit.json"
                    }
                }
            },
            storySpeaker: {
                type: "sjrk.storyTelling.story.storySpeaker"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.storyTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test story text building",
            tests: [{
                name: "Test story text invoker",
                expect: 1,
                sequence: [{
                    "funcName": "sjrk.storyTelling.storyTester.testGetFullStoryText",
                    args: ["{testStory}"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyTester.testGetFullStoryText = function (component) {
        var expectedText = "TestTitle by TestAuthor. Test Content";
        var actualText = component.getFullStoryText();

        jqUnit.assertEquals("Text from the invoker is the same as expected", expectedText, actualText);
    };

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

    var storyTextTests = [
        {
            title: "A", author: "B", content: "C", byline: "from %storyAuthor",
            message: "getFullStoryText returns as expected with full arguments provided",
            expectedResult: "A from B. C"
        },
        {
            title: "A", author: "B", content: "C", byline: undefined,
            message: "getFullStoryText returns as expected with missing byline template",
            expectedResult: "A by B. C"
        },
        {
            title: "A", author: undefined, content: "C", byline: undefined,
            message: "getFullStoryText returns as expected with missing byline and author",
            expectedResult: "A . C"
        },
        {
            title: undefined, author: undefined, content: "C", byline: undefined,
            message: "getFullStoryText returns as expected with full arguments provided",
            expectedResult: "C"
        }
    ];

    jqUnit.test("Test getFullStoryText function", function () {
        jqUnit.expect(4);

        fluid.each(storyTextTests, function (test) {
            var actualText1 = sjrk.storyTelling.story.getFullStoryText(test.title, test.author, test.content, test.byline);
            jqUnit.assertEquals(test.message, test.expectedResult, actualText1);
        });
    });

    var bylineTests = [
        {
            input: "{\"message_storyAuthorText\":\"test\"}",
            expected: "test",
            message: "getBylineTemplate returns as expected when passed a proper string"
        },
        {
            input: "{\"testKey\":\"test\"}",
            expected: undefined,
            message: "getBylineTemplate returns as expected when passed an incorrect string"
        },
        {
            input: undefined,
            expected: undefined,
            message: "getBylineTemplate returns as expected when passed nothing"
        }
    ];

    jqUnit.test("Test getBylineTemplate function", function () {
        jqUnit.expect(3);

        fluid.each(bylineTests, function (test) {
            var actualValue = sjrk.storyTelling.story.getBylineTemplate(test.input);
            jqUnit.assertEquals(test.message, test.expected, actualValue);
        });
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTest"
        ]);
    });

})(jQuery, fluid);
