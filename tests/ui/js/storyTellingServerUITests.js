/*
Copyright 2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk, sinon */

"use strict";

(function ($, fluid) {

    var mockServer;

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
        gradeNames: ["fluid.modelComponent", "fluid.test.testCaseHolder"],
        baseTestCase: {
            clientConfig: {
                theme: "base",
                baseTheme: "base",
                authoringEnabled: true
            }
        },
        model: {
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
                expect: 1,
                sequence: [{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.setupMockServer",
                    args: ["/clientConfig", "{that}.options.baseTestCase.clientConfig", "application/json"]
                },{
                    task: "sjrk.storyTelling.loadTheme",
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["The themed page load resolved as expected", "{that}.options.baseTestCase.clientConfig", "{arguments}.0"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.teardownMockServer"
                }]
            },{
                name: "Test themed page loading functions with server config values",
                expect: 6,
                sequence: [{
                    task: "sjrk.storyTelling.storyTellingServerUiTester.loadClientConfigFromServer",
                    args: ["/clientConfig", "{that}", "clientConfig.theme"],
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["Custom theme was loaded successfully", "{that}.model.clientConfig", "{arguments}.0"]
                },{
                    task: "sjrk.storyTelling.loadTheme",
                    resolve: "jqUnit.assertDeepEq",
                    resolveArgs: ["The themed page load resolved as expected", "{that}.model.clientConfig", "{arguments}.0"]
                },{
                    funcName: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomThemeFilesLoaded",
                    args: ["{that}.model.clientConfig.theme", 1]
                },{
                    task: "sjrk.storyTelling.loadCustomThemeFiles",
                    args: ["{that}.model.clientConfig"],
                    resolve: "sjrk.storyTelling.storyTellingServerUiTester.verifyCustomThemeFilesLoaded",
                    resolveArgs: ["{that}.model.clientConfig.theme", 2]
                }]
            }]
        }]
    });

    sjrk.storyTelling.storyTellingServerUiTester.loadClientConfigFromServer = function (url, testerComponent, clientConfigPath) {
        var configPromise = fluid.promise();

        $.get(url).then(function (data) {
            if (data.theme !== data.baseTheme) {
                testerComponent.applier.change(clientConfigPath, data.theme);
                configPromise.resolve(data);
            } else {
                configPromise.reject({
                    isError: true,
                    message: "Custom theme was not set in the server configuration."
                });
            }
        }, function (jqXHR, textStatus, errorThrown) {
            configPromise.reject({
                isError: true,
                message: errorThrown
            });
        });

        return configPromise;
    };

    sjrk.storyTelling.storyTellingServerUiTester.setupMockServer = function (url, clientConfig, responseType) {
        mockServer = sinon.createFakeServer();
        mockServer.respondImmediately = true;
        mockServer.respondWith(url, [200, { "Content-Type": responseType }, JSON.stringify(clientConfig)]);
    };

    sjrk.storyTelling.storyTellingServerUiTester.teardownMockServer = function () {
        mockServer.restore();
    };

    sjrk.storyTelling.storyTellingServerUiTester.verifyCustomThemeFilesLoaded = function (expectedTheme, expectedCssInstanceCount) {
        var actualInstanceCount = $("link[href$=\"" + expectedTheme + ".css\"]").length;
        jqUnit.assertEquals("Custom theme CSS file is linked the expected number of instances", expectedCssInstanceCount, actualInstanceCount);

        jqUnit.assertTrue("The custom theme JS file has been loaded", window.customThemeScriptLoaded);
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
