/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global sjrk */

"use strict";

/* A classic query string parser via
 * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * - "name": the name of the query string variable to retrieve
 * - "url": an optional URL to parse. Uses actual page URL if not provided
 */
sjrk.storyTelling.getParameterByName = function (name, url) {
    if (!url) { url = window.location.href; }
    if (name) { name = name.replace(/[\[\]]/g, "\\$&"); }
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ""; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/* Loads a story View page and a particular story from a story ID from the query string
 * - "theme": the theme of the story View page (pass "page" in for base theme)
 */
sjrk.storyTelling.loadStoryFromParameter = function (theme) {
    var storyId = sjrk.storyTelling.getParameterByName("id");
    if (storyId) {
        var storyUrl = "/stories/" + storyId;

        $.get(storyUrl, function (data) {
            var retrievedStory = JSON.parse(data);

            sjrk.storyTelling[theme].storyView({
                distributeOptions: {
                    "target": "{that story}.options.model",
                    "record": retrievedStory
                }
            });
        });
    }
};

/* Loads a story Browse page and populates it with a set of stories
 * - "theme": the theme of the story Browse page (pass "page" in for base theme)
 */
sjrk.storyTelling.loadBrowse = function (theme) {
    var browseUrl = "/stories";
    $.get(browseUrl, function (data) {
        var browseResponse = JSON.parse(data);

        sjrk.storyTelling[theme].storyBrowse({
            distributeOptions: {
                "target": "{that storyBrowser}.options.model",
                "record": browseResponse
            }
        });
    });
};

/* Loads custom theme files if and only if one of either the theme override or
 * server configuration theme are present AND not set to the base theme.
 * Once complete, the provided callback function is called.
 * - "callback": a function to call once everything has completed. Will be called
 *               regardless of whether theme information was specified or retrieved
 * - "themeOverride": allows overriding of the theme stored in the configuration
 */
sjrk.storyTelling.loadThemedPage = function (callback, themeOverride) {
    var loadPromise = fluid.promise();

    var callbackFunction = typeof callback === "function" ? callback : fluid.getGlobalValue(callback);

    $.get("/clientConfig").then(function (data) {
        var theme = themeOverride ? themeOverride : data.clientConfig ? data.clientConfig.theme : "base";

        if (theme && theme !== "base") {
            return sjrk.storyTelling.loadCustomThemeFiles(callbackFunction, theme).then(function () {
                loadPromise.resolve(theme);
            }, function (error) {
                loadPromise.reject(error);
            });
        } else {
            callbackFunction("page");
            loadPromise.resolve(theme);
        }
    }, function () {
        callbackFunction("page");
        loadPromise.reject();
    });

    return loadPromise;
};

/* Loads CSS and JavaScript files for the provided theme into the page markup.
 * If JavaScript file loading is successful, the callback function is called.
 * - "theme": the theme of the story Browse page (pass "page" in for base theme)
 * - "callback": a function to call once everything has completed
 */
sjrk.storyTelling.loadCustomThemeFiles = function (callback, theme) {
    var loadPromise = fluid.promise();

    var cssUrl = fluid.stringTemplate("/css/%theme.css", {theme: theme});
    var scriptUrl = fluid.stringTemplate("/js/%theme.js", {theme: theme});

    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: cssUrl
    }).appendTo("head");

    $.getScript(scriptUrl, function () {
        if (typeof callback === "function") {
            callback(theme);
            loadPromise.resolve(theme);
        }
    }).fail(function (error) {
        loadPromise.reject(error);
    });

    return loadPromise;
};
