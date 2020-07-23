/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk */

"use strict";

(function ($, fluid) {

    // Sets up and tests the getParameterByName function
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

    // Test cases and sequences for the Server-UI communication functions
    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTester", {
        gradeNames: ["fluid.modelComponent", "fluid.test.testCaseHolder"],
        baseTestCase: {
            clientConfig: {
                theme: "base",
                baseTheme: "base",
                authoringEnabled: true
            }
        },
        members: {
            clientConfig: {
                theme: "customTheme",
                baseTheme: "base",
                authoringEnabled: true
            }
        },
        modules: [{
            name: "Test Storytelling Server UI code",
            tests: [{
                name: "Test themed page loading functions with mock values",
                expect: 4,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: [[
                        {url: "/clientConfig", response: "{that}.options.baseTestCase.clientConfig"},
                        {
                            url: "/js/customTheme.js",
                            contentType: "application/javascript",
                            response: "var test = 123;"
                        }
                ]]
                },{
                    task: "sjrk.storyTelling.loadTheme",
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["The themed page load resolved as expected", "{that}.options.baseTestCase.clientConfig", "{arguments}.0"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded",
                    args: ["{that}.options.baseTestCase.clientConfig", 1]
                },{
                    task: "sjrk.storyTelling.loadCustomThemeFiles",
                    args: ["{that}.clientConfig"],
                    resolve: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded",
                    resolveArgs: ["{that}.clientConfig", 1]
                },{
                    task: "sjrk.storyTelling.loadCustomThemeFiles",
                    args: ["{that}.clientConfig"],
                    resolve: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded",
                    resolveArgs: ["{that}.clientConfig", 2]
                },{
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                }]
            }]
        }]
    });

    /**
     * A collection of client configuration settings
     * @typedef {Object.<String, String>} ClientConfig
     * @property {String} theme - the current theme of the site
     * @property {String} baseTheme - the base theme of the site
     * @property {String} authoringEnabled - indicates whether story saving and editing are enabled
     */

    /**
     * Verifies that a custom CSS file was loaded for custom themes,
     * or that none has been loaded if no custom theme has been specified
     * in the clientConfig
     *
     * @param {ClientConfig} clientConfig - the client configuration data
     * @param {Number} expectedCssInstanceCount - The number of times the CSS file is expected to be present
     */
    sjrk.storyTelling.storyTellingServerUiTester.verifyCustomCssLoaded = function (clientConfig, expectedCssInstanceCount) {
        if (clientConfig.theme === clientConfig.baseTheme) {
            expectedCssInstanceCount = 0; // if no custom theme is set, we actually expect zero custom files
        }

        var actualInstanceCount = $("link[href$=\"" + clientConfig.theme + ".css\"]").length;
        jqUnit.assertEquals("Custom theme CSS file is linked the expected number of instances", expectedCssInstanceCount, actualInstanceCount);
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.storyTellingServerUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyTellingServerUiTester: {
                type: "sjrk.storyTelling.storyTellingServerUiTester"
            }
        }
    });

    /*
     * Tests the bug described by the former SJRK-335, a Kettle crash
     * related to the cancellation of in-flight requests.
     *
     * Fully aware we're doing bad things, this test creates some requests,
     * puts them in a collection, fires them off and then immediately
     * begins making abort calls on them, regardless of their status.
     */
    jqUnit.test("Test SJRK-335", function () {
        jqUnit.expect(1);

        var urlToTest = "/anything";
        var numberOfRequests = 1000;
        var requests = [];

        for (var i = 0; i < numberOfRequests; i++) {
            var req = new XMLHttpRequest();
            requests.push(req);
            req.open("GET", urlToTest, true);
            req.send();
        }

        fluid.each(requests, function (req) {
            req.abort();
        });

        jqUnit.assert("All requests successfully completed.");
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyTellingServerUiTest"
        ]);
    });

})(jQuery, fluid);
