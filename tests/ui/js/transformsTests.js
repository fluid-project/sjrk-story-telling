/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

"use strict";

(function ($, fluid) {

    var stringToArrayTransformTestCases = {
        "test_01": {
            input: "Shyguy,Rootbeer",
            rules: {},
            expectedResult: ["Shyguy", "Rootbeer"],
            expectedInverseResult: "Shyguy, Rootbeer"
        },
        "test_02": {
            input: "Shyguy, Rootbeer",
            rules: {},
            expectedResult: ["Shyguy", "Rootbeer"],
            expectedInverseResult: "Shyguy, Rootbeer"
        },
        "test_03": {
            input: "Shyguy   , Rootbeer",
            rules: {
                trim: false
            },
            expectedResult: ["Shyguy   ", " Rootbeer"],
            expectedInverseResult: "Shyguy   ,  Rootbeer"
        },
        "test_04": {
            input: "Shyguy, Rootbeer",
            rules: {
                delimiter: "."
            },
            expectedResult: ["Shyguy, Rootbeer"],
            expectedInverseResult: "Shyguy, Rootbeer"
        },
        "test_05": {
            input: "Shyguy. Rootbeer",
            rules: {
                delimiter: "."
            },
            expectedResult: ["Shyguy", "Rootbeer"],
            expectedInverseResult: "Shyguy.Rootbeer"
        },
        "test_06": {
            input: ["Shyguy ,Rootbeer"],
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_07": {
            input: 0,
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_08": {
            input: {},
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_09": {
            input: [],
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_10": {
            input: false,
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_11": {
            input: "",
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_12": {
            input: null,
            rules: {},
            expectedResult: [],
            expectedInverseResult: ""
        },
        "test_13": {
            input: undefined,
            rules: {},
            expectedResult: undefined,
            expectedInverseResult: undefined
        }
    };

    jqUnit.test("Test stringToArray transform function", function () {
        jqUnit.expect(26);

        fluid.each(stringToArrayTransformTestCases, function (testCase, index) {
            var transformSpec = $.extend({}, testCase.rules, {
                type: "sjrk.storyTelling.transforms.stringToArray",
                inputPath: "inputString"
            });

            var transformRules = {
                transform: transformSpec
            };

            var output = fluid.model.transformWithRules(
                { inputString: testCase.input },
                { output: transformRules }
            ).output;
            jqUnit.assertDeepEq("Generated array values for test case " + index + " are as expected", testCase.expectedResult, output);

            var invertedRules = fluid.model.transform.invertConfiguration(transformRules);
            var invertedOutput = fluid.model.transformWithRules(
                output,
                invertedRules
            ).inputString;
            jqUnit.assertEquals("Generated inverted string value for test case " + index + " is as expected", testCase.expectedInverseResult, invertedOutput);
        });
    });

    var arrayToStringTransformTestCases = {
        "test_01": {
            input: ["Shyguy", "Rootbeer"],
            rules: {},
            expectedResult: "Shyguy, Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_02": {
            input: {cat1: "Shyguy", cat2: "Rootbeer"},
            rules: {},
            expectedResult: "Shyguy, Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_03": {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: ". "
            },
            expectedResult: "Shyguy. Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_04": {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: true
            },
            expectedResult: "ShyguytrueRootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_05": {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                delimiter: 1
            },
            expectedResult: "Shyguy1Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_06": {
            input: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {},
            expectedResult: "Shyguy, Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_07": {
            input: ["Shyguy", "Rootbeer", 0, {somethingElse: ""}, ["a string in an array"]],
            rules: {
                stringOnly: false
            },
            expectedResult: "Shyguy, Rootbeer, 0, [object Object], a string in an array",
            expectedInverseResult: ["Shyguy", "Rootbeer", "0", "[object Object]", "a string in an array"]
        },
        "test_08": {
            input: ["Shyguy", "Rootbeer"],
            rules: {
                path: "innerPath"
            },
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_09": {
            input: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "innerPath"
            },
            expectedResult: "Shyguy, Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_10": {
            input: [
                { innerPath: "Shyguy", ignoredValue: "Not a cat" },
                { innerPath: "Rootbeer", ignoredValue: "Also not a cat" }
            ],
            rules: {
                path: "notARealPath"
            },
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_11": {
            input: ["Shyguy", "Rootbeer", "", false, {}, []],
            rules: {},
            expectedResult: "Shyguy, Rootbeer",
            expectedInverseResult: ["Shyguy", "Rootbeer"]
        },
        "test_12": {
            input: [],
            rules: {},
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_13": {
            input: 0,
            rules: {},
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_14": {
            input: {},
            rules: {},
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_15": {
            input: "",
            rules: {},
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_16": {
            input: null,
            rules: {},
            expectedResult: "",
            expectedInverseResult: []
        },
        "test_17": {
            input: undefined,
            rules: {},
            expectedResult: undefined,
            expectedInverseResult: undefined
        }
    };

    jqUnit.test("Test arrayToString transform function", function () {
        jqUnit.expect(34);

        fluid.each(arrayToStringTransformTestCases, function (testCase, index) {
            var transformSpec = $.extend({}, testCase.rules, {
                type: "sjrk.storyTelling.transforms.arrayToString",
                inputPath: "sourceArray"
            });

            var transformRules = {
                transform: transformSpec
            };

            var resultString = fluid.model.transformWithRules(
                { sourceArray: testCase.input },
                { resultString: transformRules }
            ).resultString;
            jqUnit.assertEquals("Generated string value for test case " + index + " is as expected", testCase.expectedResult, resultString);

            var invertedRules = fluid.model.transform.invertConfiguration(transformRules);
            var invertedOutput = fluid.model.transformWithRules(
                resultString,
                invertedRules
            ).sourceArray;
            jqUnit.assertDeepEq("Generated inverted array values for test case " + index + " are as expected", testCase.expectedInverseResult, invertedOutput);
        });
    });

})(jQuery, fluid);
