/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var jqUnit = fluid.registerNamespace("jqUnit"),
    sjrk = fluid.registerNamespace("sjrk"),
    kettle = fluid.registerNamespace("kettle"),
    fs = require("fs");
fluid.registerNamespace("sjrk.storyTelling.server");

/**
 * Removes all files from the test uploads directory
 *
 * @param {String} dirPath - the path for the test uploads directory
 */
sjrk.storyTelling.server.cleanTestUploadsDirectory = function (dirPath) {
    var testUploadsDir = fs.readdirSync(dirPath);
    fluid.each(testUploadsDir, function (filePath) {
        if (filePath !== ".gitkeep") {
            fs.unlinkSync(dirPath + filePath);
        }
    });
};

/**
 * Verifies that a call to /clientConfig was succesful and returns the correct
 * current theme value
 *
 * @param {String} data - the data returned by the call
 * @param {Component} that - an instance of kettle.test.request.http
 * @param {String} expectedTheme - the expected current theme
 */
sjrk.storyTelling.server.verifyGetClientConfigSuccessful = function (data, that, expectedTheme) {
    jqUnit.assertEquals("Successful GET request for clientConfig endpoint", 200, that.nativeResponse.statusCode);

    var responseData = JSON.parse(data);
    jqUnit.assertEquals("Retrieved theme is as expected", expectedTheme, responseData.theme);
};

/**
 * Verifies that a call to load a custom theme file was successful and
 * contains the correct markup
 *
 * @param {String} data - the data returned by the call
 * @param {Component} that - an instance of kettle.test.request.http
 * @param {String} expectedMarkup - the expected markup
 */
sjrk.storyTelling.server.verifyGetThemeFileSuccessful = function (data, that, expectedMarkup) {
    jqUnit.assertEquals("Successful GET request for theme file 1/2: expected file retrieved", expectedMarkup, data.trim());
    jqUnit.assertEquals("Successful GET request for theme file 2/2: file loaded", 200, that.nativeResponse.statusCode);
};

/**
 * Verifies that a call to load a custom theme file was unsuccessful and
 * produces an error
 *
 * @param {String} data - the data returned by the call
 * @param {Component} that - an instance of kettle.test.request.http
 */
sjrk.storyTelling.server.verifyGetThemeFileUnsuccessful = function (data, that) {
    jqUnit.assertEquals("Unsuccessful GET request for theme file 1/2: file not loaded", 404, that.nativeResponse.statusCode);

    var responseData = JSON.parse(data);
    jqUnit.assertTrue("Unsuccessful GET request for theme file 2/2: error was returned", responseData.isError);
};

/**
 * A wrapper around `jqUnit.assertDeepEq` except it censors the filtered keys from the `actual` object.
 * The remaining properties are compared with `jqUnit.assertDeepEq`. Can also optionally check that the censored keys
 * are included in the `actual` object, without validating their values.
 *
 * This is particulary useful for asserting response object that contain generated values.
 *
 * @param {String} msg - The assertion message
 * @param {Object} expected - The expected value to compare against the `actual` value.
 * @param {Object} actual - The actual value, minus `_rev` and `rev` properties, compared against the `expected` value.
 * @param {Object} [options] - Options for configuring filtering of keys from the `actual` argument
 * @param {String|Array} [options.filter] - (optiona) keys to ommit from
 * @param {Boolean} [options.checkFiltered] - (optional) if set to `true` will verify that the filtered keys are
 *                                            present in the `actual` argument.
 */
sjrk.storyTelling.server.assertFilteredDeepEq = function (msg, expected, actual, options) {
    options = options || {};
    var filter = fluid.makeArray(options.filter || []);
    var filtered = fluid.censorKeys(actual, filter);
    jqUnit.assertDeepEq(msg, expected, filtered);

    if (options.checkFiltered) {
        fluid.each(filter, function (key) {
            jqUnit.assertTrue(msg + " - has key \"" + key + "\"", actual.hasOwnProperty(key));
        });
    }
};

/**
 * Asserts that a successful response with a JSON payload body has been received. Will optionally ignore filtered keys.
 *
 * The code for this is based off of `kettle.test.assertJSONResponse`
 * https://github.com/fluid-project/kettle/blob/c0633b2156b33e805898cc18253cc84c953bb464/lib/test/KettleTestUtils.http.js#L232-L246
 *
 * @param {Object} options - The "core fields" for response assertion as described in `kettle.test.assertJSONResponse`
 * and `sjrk.storyTelling.server.assertFilteredDeepEq`.
 */
sjrk.storyTelling.server.assertFilteredJSONResponse = function (options) {
    var data;
    try {
        data = kettle.JSON.parse(options.string);
    } catch (e) {
        throw kettle.upgradeError(e, "\nwhile parsing HTTP response as JSON");
    }
    sjrk.storyTelling.server.assertFilteredDeepEq(options.message, options.expected, data, options);
    kettle.test.assertResponseStatusCode(options, 200);
};

/**
 * Asserts that an error response of a particular structure has been received.
 *
 * @param {Object} options - The "core fields" for response assertion as described in `kettle.test.assertJSONResponse`
 * and `sjrk.storyTelling.server.assertFilteredDeepEq`.
 * @param {String} options.string - The received response body
 * @param {Component} options.request - The http request component which has fired
 * @param {String} options.message - The assertion message
 * @param {String} [options.expectedHeaders] - The headers to verify in the response
 * @param {String} [options.statusCode] - The expected status code; default is 200
 */
sjrk.storyTelling.server.assertBinaryResponse = function (options) {
    jqUnit.assertNotUndefined(options.message + " - data returned in response", options.string);

    var filter = fluid.keys(options.expectedHeaders);
    if (filter.length) {
        jqUnit.assertDeepEq(options.message, options.expectedHeaders, fluid.filterKeys(options.request.nativeResponse.headers, filter));
    }
    kettle.test.assertResponseStatusCode(options, 200);
};
