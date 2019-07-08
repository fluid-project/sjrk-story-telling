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
                // URL altered without pageload via code from StackOverflow
                // https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
                if (history.pushState) {
                    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?testParameterFromUrl=testValue&emptyTestParameterFromUrl=";
                    window.history.pushState({ path:newurl }, "", newurl);
                }
            }

            var actualResult = sjrk.storyTelling.getParameterByName(testCase.parameter, testCase.url);
            jqUnit.assertEquals("Query string parameter '" + testCase.parameter + "' is retrieved as expected", testCase.expected, actualResult);
        });
    });

    // test the clientConfig server URL
    // test the "loading" of a set theme from the config

    fluid.defaults("sjrk.storyTelling.testStoryTellingServerUi", {
        gradeNames: ["fluid.component"]
    });

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Storytelling Server UI code",
            tests: [{
                name: "Test themed page loading functions",
                expect: 2,
                sequence: [{
                    // call the load themed page function, forcing the base theme
                    task: "sjrk.storyTelling.loadThemedPage",
                    args: ["sjrk.storyTelling.storyTellingServerUiTester.callbackVerificationFunction", "base"],
                    resolve: "jqUnit.assertEquals",
                    resolveArgs: ["The themed page load resolved as expected", "{arguments}.0", "base"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyTellingServerUiTester.callbackVerificationFunction = function (value) {
        if (value) {
            jqUnit.assert("Callback was successfully called with value: " + value);
        }
    };

    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            ui: {
                type: "sjrk.storyTelling.testStoryTellingServerUi",
                createOnEvent: "{storyTellingServerUiTester}.events.onTestCaseStart"
            },
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
