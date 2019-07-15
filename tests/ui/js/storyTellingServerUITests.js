/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk */

"use strict";

(function ($, fluid) {

    jqUnit.test("Test getParameterByName function", function () {
        var testCases = [
            { // test retrieval of set value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=testValue",
                expected: "testValue"
            },
            { // test retrieval of empty value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=",
                expected: ""
            },
            { // test retrieval of set value from falsy URL
                parameter: "testParameter",
                url: null,
                expected: null
            },
            { // test retrieval of null value from provided URL
                parameter: null,
                url: "testUrl?testParameter=testValue",
                expected: null
            },
            { // test retrieval of set value from page URL
                parameter: "testParameterFromUrl",
                url: "",
                expected: "testValue"
            },
            { // test retrieval of null value from page URL
                parameter: null,
                url: "",
                expected: null
            },
            { // test retrieval of empty value from page URL
                parameter: "emptyTestParameterFromUrl",
                url: "",
                expected: ""
            },
            { // test retrieval of missing value from page URL
                parameter: "testParameterNotInUrl",
                url: "",
                expected: null
            }
        ];

        jqUnit.expect(testCases.length);

        fluid.each(testCases, function (testCase, index) {
            if (index === 4) {
                sjrk.storyTelling.testUtils.setQueryString("testParameterFromUrl=testValue&emptyTestParameterFromUrl=");
            }

            var actualResult = sjrk.storyTelling.getParameterByName(testCase.parameter, testCase.url);
            jqUnit.assertEquals("Query string parameter '" + testCase.parameter + "' is retrieved as expected", testCase.expected, actualResult);
        });
    });

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Storytelling Server UI code",
            tests: [{
                name: "Test themed page loading functions",
                expect: 8,
                sequence: [{
                    // call the load themed page function, forcing the base theme
                    task: "sjrk.storyTelling.loadThemedPage",
                    args: ["sjrk.storyTelling.testUtils.callbackVerificationFunction", "base"],
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The themed page load resolved as expected", "base", "{arguments}.0"]
                },{
                    // call the load themed page function, forcing the Learning Reflections theme
                    task: "sjrk.storyTelling.loadThemedPage",
                    args: ["sjrk.storyTelling.testUtils.callbackVerificationFunction", "learningReflections"],
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The themed page load resolved as expected", "learningReflections", "{arguments}.0"]
                },{
                    // call the load themed page function, forcing a falsy theme
                    task: "sjrk.storyTelling.loadThemedPage",
                    args: ["sjrk.storyTelling.testUtils.callbackVerificationFunction", null],
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The themed page load resolved as expected", "learningReflections", "{arguments}.0"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.assertCustomCssLoaded",
                    args: ["learningReflections.css", 2]
                },{
                    // test the CSS/JS injection function directly
                    funcName: "sjrk.storyTelling.loadCustomThemeFiles",
                    args: ["sjrk.storyTelling.testUtils.callbackVerificationFunction", "learningReflections"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.assertCustomCssLoaded",
                    args: ["learningReflections.css", 3]
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyTellingServerUiTester.assertCustomCssLoaded = function (expectedFileName, expectedInstanceCount) {
        var cssFilesLinked = fluid.transform(fluid.getMembers($("link"), "href"), function (fileUrl) {
            return fileUrl.split("/css/")[1];
        });

        var actualInstanceCount = 0;

        fluid.each(cssFilesLinked, function (fileName) {
            if (fileName === expectedFileName) {
                actualInstanceCount++;
            }
        });

        jqUnit.assertEquals("Linked CSS files include the expected custom theme file the expected number of instances", expectedInstanceCount, actualInstanceCount);
    };

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyTellingServerUiTester: {
                type: "sjrk.storyTelling.storyTellingServerUiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTellingServerUiTest"
        ]);
    });

})(jQuery, fluid);
