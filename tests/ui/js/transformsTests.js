/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

"use strict";

(function ($, fluid) {

    var stringToArrayTransformTestCases = [
        {
            input: "Shyguy,Rootbeer",
            rules: {},
            expectedResult: ["Shyguy", "Rootbeer"],
            expectedInverseResult: "Shyguy, Rootbeer"
        },
        {
            input: "Shyguy, Rootbeer",
            rules: {},
            expectedResult: ["Shyguy", "Rootbeer"],
            expectedInverseResult: "Shyguy, Rootbeer"
        },
        {
            input: "Shyguy   , Rootbeer",
            rules: {
                trim: false
            },
            expectedResult: ["Shyguy   ", " Rootbeer"],
            expectedInverseResult: "Shyguy   , Rootbeer"
        },
        {
            input: "Shyguy, Rootbeer",
            rules: {
                delimiter: "."
            },
            expectedResult: ["Shyguy, Rootbeer"]
        },
        {
            input: "Shyguy. Rootbeer",
            rules: {
                delimiter: "."
            },
            expectedResult: ["Shyguy", "Rootbeer"]
        },
        {
            input: ["Shyguy ,Rootbeer"],
            rules: {},
            expectedResult: []
        },
        {
            input: 0,
            rules: {},
            expectedResult: []
        },
        {
            input: {},
            rules: {},
            expectedResult: []
        },
        {
            input: [],
            rules: {},
            expectedResult: []
        },
        {
            input: false,
            rules: {},
            expectedResult: []
        },
        {
            input: "",
            rules: {},
            expectedResult: []
        },
        {
            input: null,
            rules: {},
            expectedResult: []
        },
        {
            input: undefined,
            rules: {},
            expectedResult: undefined
        }
    ];

    jqUnit.test("Test stringToArray transform function", function () {
        jqUnit.expect(stringToArrayTransformTestCases.length);

        fluid.each(stringToArrayTransformTestCases, function (testCase, index) {
            var transformRules = $.extend({}, testCase.rules, {
                type: "sjrk.storyTelling.transforms.stringToArray",
                inputPath: "inputString"
            });

            var transform = {
                transform: transformRules
            };

            var output = fluid.model.transformWithRules(
                { inputString: testCase.input },
                { output: transform }
            ).output;

            jqUnit.assertDeepEq("Generated array values for test case " + index + " are as expected", testCase.expectedResult, output);

        });
    });

    var arrayToStringTransformTestCases = [
        {
            input: ["Shyguy", "Rootbeer"],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            input: {cat1: "Shyguy", cat2: "Rootbeer"},
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: ". "
            },
            expectedResult: "Shyguy. Rootbeer"
        },
        {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: true
            },
            expectedResult: "ShyguytrueRootbeer"
        },
        {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: 1
            },
            expectedResult: "Shyguy1Rootbeer"
        },
        {
            input: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            input: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {
                stringOnly: false
            },
            expectedResult: "Shyguy, Rootbeer, 0, [object Object], a string in an array"
        },
        {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                path: "innerPath"
            },
            expectedResult: ""
        },
        {
            input: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "innerPath"
            },
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            input: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "notARealPath"
            },
            expectedResult: ""
        },
        {
            input: ["Shyguy", "Rootbeer", "", false, {}, []],
            rules: {},
            expectedResult: "Shyguy, Rootbeer"
        },
        {
            input: [],
            rules: {},
            expectedResult: ""
        },
        {
            input: 0,
            rules: {},
            expectedResult: ""
        },
        {
            input: {},
            rules: {},
            expectedResult: ""
        },
        {
            input: "",
            rules: {},
            expectedResult: ""
        },
        {
            input: null,
            rules: {},
            expectedResult: ""
        },
        {
            input: undefined,
            rules: {},
            expectedResult: undefined
        }
    ];

    jqUnit.test("Test arrayToString transform function", function () {
        jqUnit.expect(arrayToStringTransformTestCases.length);

        fluid.each(arrayToStringTransformTestCases, function (testCase, index) {
            var transformRules = $.extend({}, testCase.rules, {
                type: "sjrk.storyTelling.transforms.arrayToString",
                inputPath: "sourceArray"
            });

            var resultString = fluid.model.transformWithRules(
                { sourceArray: testCase.input },
                { resultString: { transform: transformRules }}
            ).resultString;

            jqUnit.assertEquals("Generated string value for test case " + index + " is as expected", testCase.expectedResult, resultString);
        });
    });

})(jQuery, fluid);
