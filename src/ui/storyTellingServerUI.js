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
 * - "options": additional options to merge into the View page
 */
sjrk.storyTelling.loadStoryFromParameter = function (theme, options) {
    var storyPromise = fluid.promise();

    var storyId = sjrk.storyTelling.getParameterByName("id");

    if (storyId) {
        $.get("/stories/" + storyId, function (data) {
            var retrievedStory = JSON.parse(data);

            options = options || {};
            options.distributeOptions = {
                "target": "{that story}.options.model",
                "record": retrievedStory
            };

            var storyViewComponent;
            if (theme === "base") {
                storyViewComponent = sjrk.storyTelling.page.storyView(options);
            } else {
                storyViewComponent = sjrk.storyTelling[theme].storyView(options);
            }

            storyPromise.resolve(storyViewComponent);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            storyPromise.reject({
                isError: true,
                message: errorThrown
            });
        });;
    } else {
        storyPromise.reject({
            isError: true,
            message: "No story ID provided"
        });
    }

    return storyPromise;
};

/* Loads a story Browse page and populates it with a set of stories
 * - "theme": the theme of the story Browse page (pass "page" in for base theme)
 * - "options": additional options to merge into the Browse page
 */
sjrk.storyTelling.loadBrowse = function (theme, options) {
    var storiesPromise = fluid.promise();

    $.get("/stories", function (data) {
        var browseResponse = JSON.parse(data);

        options = options || {};
        options.distributeOptions = {
            "target": "{that storyBrowser}.options.model",
            "record": browseResponse
        };

        var storyBrowseComponent;
        if (theme === "base") {
            storyBrowseComponent = sjrk.storyTelling.page.storyBrowse(options);
        } else {
            storyBrowseComponent = sjrk.storyTelling[theme].storyBrowse(options);
        }

        storiesPromise.resolve(storyBrowseComponent);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        storiesPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return storiesPromise;
};

/* Loads custom theme files if and only if one of either the theme override or
 * server configuration theme are present AND not set to the base theme.
 * Once complete, the provided callback function is called and the theme name is
 * passed into it. If custom theme files are not loaded, the "base" theme is passed.
 * - "callback": a function to call once everything has completed. Will be called
 *               regardless of whether theme information was specified or retrieved
 * - "themeOverride": allows overriding of the theme stored in the configuration
 */
sjrk.storyTelling.loadThemedPage = function (callback, themeOverride) {
    var loadPromise = fluid.promise();

    var callbackFunction = typeof callback === "function" ? callback : fluid.getGlobalValue(callback);

    $.get("/clientConfig").then(function (data) {
        var theme = themeOverride ? themeOverride : data.clientConfig.theme;

        if (theme && theme !== "base") {
            return sjrk.storyTelling.loadCustomThemeFiles(callbackFunction, theme).then(function () {
                loadPromise.resolve(theme);
            }, function (jqXHR, textStatus, errorThrown) {
                loadPromise.reject({
                    isError: true,
                    message: errorThrown
                });
            });
        } else {
            theme = "base";
            callbackFunction(theme);
            loadPromise.resolve(theme);
        }
    }, function (jqXHR, textStatus, errorThrown) {
        callbackFunction("base"); //default to the base theme page
        loadPromise.reject({
            isError: true,
            message: errorThrown
        });
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
            var callbackResult = callback(theme);
            loadPromise.resolve(callbackResult);
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        loadPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return loadPromise;
};
