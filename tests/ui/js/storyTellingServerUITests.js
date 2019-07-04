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
        jqUnit.expect(8);

        var testCases = {
            test1: { // test retrieval of set value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=testValue",
                expected: "testValue"
            },
            test2: { // test retrieval of empty value from provided URL
                parameter: "testParameter",
                url: "testUrl?testParameter=",
                expected: ""
            },
            test3: { // test retrieval of set value from falsy URL
                parameter: "testParameter",
                url: null,
                expected: null
            },
            test4: { // test retrieval of null value from provided URL
                parameter: null,
                url: "testUrl?testParameter=testValue",
                expected: null
            },
            test5: { // test retrieval of set value from page URL
                parameter: "testParameterFromUrl",
                url: "",
                expected: "testValue"
            },
            test6: { // test retrieval of null value from page URL
                parameter: null,
                url: "",
                expected: null
            },
            test7: { // test retrieval of empty value from page URL
                parameter: "emptyTestParameterFromUrl",
                url: "",
                expected: ""
            },
            test8: { // test retrieval of missing value from page URL
                parameter: "testParameterNotInUrl",
                url: "",
                expected: null
            }
        };

        fluid.each(testCases, function (testCase, index) {
            if (index === "test5") {
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

})(jQuery, fluid);
