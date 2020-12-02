/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

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
            // In "vanilla" JavaScript, !undefined === true. In Infusion, if there are no defaults set up for a transform
            // and the input is undefined, the result will be undefined as well. Please see the documentation for info:
            // https://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html#example-4-using-an-undefined-input
            input: undefined,
            rules: {},
            expectedResult: undefined,
            expectedInverseResult: undefined
        }
    };

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

    var negateTransformTestCases = {
        "test_01": {
            input: true,
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_02": {
            input: false,
            expectedResult: true,
            expectedInverseResult: false
        },
        "test_03": {
            input: 0,
            expectedResult: true,
            expectedInverseResult: false
        },
        "test_04": {
            input: 1,
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_05": {
            input: -1,
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_06": {
            input: "",
            expectedResult: true,
            expectedInverseResult: false
        },
        "test_07": {
            input: "Rootbeer",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_08": {
            input: {},
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_09": {
            input: [],
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_10": {
            input: [1],
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_11": {
            input: [0],
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_12": {
            input: [""],
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_13": {
            input: "true",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_14": {
            input: "false",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_15": {
            input: "1",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_16": {
            input: "0",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_17": {
            input: "-1",
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_18": {
            input: null,
            expectedResult: true,
            expectedInverseResult: false
        },
        "test_19": {
            input: undefined,
            expectedResult: undefined,
            expectedInverseResult: undefined
        },
        "test_20": {
            input: [[]],
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_21": {
            input: NaN,
            expectedResult: true,
            expectedInverseResult: false
        },
        "test_22": {
            input: Infinity,
            expectedResult: false,
            expectedInverseResult: true
        },
        "test_23": {
            input: -Infinity,
            expectedResult: false,
            expectedInverseResult: true
        }
    };

    /* Sets up and runs a transform through a set of test cases
     * - "transformType": the gradeName of the transform to test
     * - "testCases": the test cases for said transform
     */
    sjrk.storyTelling.transforms.runTestsForTransform = function (transformType, testCases) {
        jqUnit.test("Test transform " + transformType, function () {
            jqUnit.expect(Object.keys(testCases).length * 2);

            fluid.each(testCases, function (testCase, index) {
                // set up the transform and merge in any extra transformation rules
                var transformRules = {
                    value: {
                        transform: $.extend({}, testCase.rules, {
                            type: transformType,
                            inputPath: "input"
                        })
                    }
                };

                // test the transformation
                var result = fluid.model.transformWithRules(testCase, transformRules);
                jqUnit.assertDeepEq("Transformation of test case " + index + " is as expected", testCase.expectedResult, result.value);

                // test the inverse transformation
                var inverseRules = fluid.model.transform.invertConfiguration(transformRules);
                var inverseResult = fluid.model.transformWithRules({value: testCase.expectedResult}, inverseRules);
                jqUnit.assertDeepEq("Inverse transformation of test case " + index + " is as expected", testCase.expectedInverseResult, inverseResult.input);
            });
        });
    };

    sjrk.storyTelling.transforms.runTestsForTransform("sjrk.storyTelling.transforms.stringToArray", stringToArrayTransformTestCases);
    sjrk.storyTelling.transforms.runTestsForTransform("sjrk.storyTelling.transforms.arrayToString", arrayToStringTransformTestCases);
    sjrk.storyTelling.transforms.runTestsForTransform("sjrk.storyTelling.transforms.not", negateTransformTestCases);

})(jQuery, fluid);
