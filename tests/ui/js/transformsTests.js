/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

"use strict";

(function ($, fluid) {

    jqUnit.test("Test stringToArray transform function", function () {
        jqUnit.expect(2);

        var expectedArray = ["tag1","tag2"];

        var stringToArrayTransform = {
            transform: {
                type: "sjrk.storyTelling.transforms.stringToArray",
                inputPath: "inputString"
            }
        };

        var tagArray = fluid.model.transformWithRules(
            {inputString: "tag1,tag2"},
            {output: stringToArrayTransform}
        ).output;

        var tagArrayNoSpace = fluid.model.transformWithRules(
            {inputString: "tag1, tag2"},
            {output: stringToArrayTransform}
        ).output;

        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArray);
        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArrayNoSpace);
    });

    var arrayToStringTransformTestCases = [
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {
                separator: ". "
            },
            expectedResult: "Shyguy. Rootbeer"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {
                separator: true
            },
            expectedResult: "ShyguytrueRootbeer"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {
                separator: 1
            },
            expectedResult: "Shyguy1Rootbeer"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {
                trailingSeparator: true
            },
            expectedResult: "Shyguy, Rootbeer, "
        },
        {
            sourceArray: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {
                stringOnly: false
            },
            expectedResult: "Shyguy, Rootbeer, 0, [object Object], a string in an array"
        },
        {
            sourceArray: ["Shyguy", "Rootbeer"],
            rules: {
                path: "innerPath"
            },
            expectedResult: ""
        },
        {
            sourceArray: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "innerPath"
            },
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            sourceArray: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "notARealPath"
            },
            expectedResult: ""
        },
        {
            sourceArray: ["Shyguy", "Rootbeer", "", false, {}, []],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        }
    ];

    jqUnit.test("Test arrayToString transform function", function () {
        jqUnit.expect(arrayToStringTransformTestCases.length);

        fluid.each(arrayToStringTransformTestCases, function (testCase, index) {
            var transformRules = $.extend({}, testCase.rules, {
                type: "sjrk.storyTelling.transforms.arrayToString",
                inputPath: "sourceArray",
            })

            var resultString = fluid.model.transformWithRules(
                { sourceArray: testCase.sourceArray },
                { resultString: { transform: transformRules }}
            ).resultString;

            jqUnit.assertEquals("Generated array values for test case " + index + " are as expected", testCase.expectedResult, resultString);
        });
    });

})(jQuery, fluid);
