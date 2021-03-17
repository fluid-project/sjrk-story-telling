/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

/**
 * A classic query string parser via
 * {@link https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript}
 *
 * @param {String} name - the name of the query string variable to retrieve
 * @param {String} [url] - (optional) an URL to parse. Uses actual page URL if not provided
 *
 * @return {String} - The query string value
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

/**
 * A collection of client configuration settings
 * @typedef {Object.<String, String>} ClientConfig
 * @property {String} theme - the current theme of the site
 * @property {String} baseTheme - the base theme of the site
 * @property {String} authoringEnabled - indicates whether story saving and editing are enabled
 */

// TODO: With https://issues.fluidproject.org/browse/SJRK-416 loading stories and returning 404/403 errors will be
// revised.
/**
 * Loads a story View page and a particular story from a story ID from the query string
 *
 * @param {ClientConfig} clientConfig - client configuration settings
 * @param {Object} options - additional options to merge into the View page
 *
 * @return {Promise} - a fluid-flavoured promise which will return a storyView page component on resolve
 *                     returns storyNotFound page component on rejection
 */
sjrk.storyTelling.loadStoryFromParameter = function (clientConfig, options) {
    var storyPromise = fluid.promise();

    var storyId = sjrk.storyTelling.getParameterByName("id");

    if (storyId) {
        $.get("/stories/" + storyId, function (data) {
            var retrievedStory = JSON.parse(data);

            options = options || {
                pageSetup: {
                    authoringEnabled: clientConfig.authoringEnabled
                }
            };
            options.distributeOptions = [{
                "target": "{that story}.options.model",
                "record": retrievedStory
            }];

            // TODO: Move this string to another file and localize it
            if (retrievedStory.title) {
                document.title = retrievedStory.title + " | The Storytelling Project";
            }

            var storyViewComponent = sjrk.storyTelling[clientConfig.theme].page.storyView(options);

            storyPromise.resolve(storyViewComponent);
        }).fail(function () {
            var storyNotFoundComponent = sjrk.storyTelling[clientConfig.theme].page.storyNotFound({storyId: storyId});
            storyPromise.reject(storyNotFoundComponent);
        });
    } else {
        var storyNotFoundComponent = sjrk.storyTelling[clientConfig.theme].page.storyNotFound();
        storyPromise.reject(storyNotFoundComponent);
    }

    return storyPromise;
};

// TODO: With https://issues.fluidproject.org/browse/SJRK-416 loading stories and returning 404/403 errors will be
// revised.
/**
 * Attempts to load a story Edit page and a particular story from a story ID from the query string if provided
 *
 * @param {ClientConfig} clientConfig - client configuration settings
 * @param {Object} options - additional options to merge into the Edit page
 *
 * @return {Promise} - a fluid-flavoured promise which will return a storyEdit page component on resolve
 *                     returns storyNotFound page component on rejection
 */
sjrk.storyTelling.loadStoryEditWithParameter = function (clientConfig, options) {
    var storyPromise = fluid.promise();
    var storyId = sjrk.storyTelling.getParameterByName("id");
    options = options || {
        pageSetup: {
            authoringEnabled: clientConfig.authoringEnabled
        }
    };

    if (storyId) {
        $.get("/stories/" + storyId + "/edit", function (data) {
            var retrievedStory = JSON.parse(data);

            options.distributeOptions = [{
                "target": "{that story}.options.model",
                "record": retrievedStory
            }];

            var storyEditComponent = sjrk.storyTelling[clientConfig.theme].page.storyEdit(options);
            storyPromise.resolve(storyEditComponent);
        }).fail(function () {
            var storyNotFoundComponent = sjrk.storyTelling[clientConfig.theme].page.storyNotFound({storyId: storyId});
            storyPromise.reject(storyNotFoundComponent);
        });
    } else {
        var storyEditComponent = sjrk.storyTelling[clientConfig.theme].page.storyEdit(options);
        storyPromise.resolve(storyEditComponent);
    }

    return storyPromise;
};

/**
 * Loads a story Browse page and populates it with a set of stories
 *
 * @param {ClientConfig} clientConfig - client configuration settings
 * @param {Object} options - additional options to merge into the Browse page
 *
 * @return {Promise} - a fluid-flavoured promise which will return a storyBrowse page component on resolve,
 *                     returns an error object on rejection
 */
sjrk.storyTelling.loadBrowse = function (clientConfig, options) {
    var storiesPromise = fluid.promise();

    $.get("/stories", function (data) {
        var browseResponse = JSON.parse(data);

        options = options || {
            pageSetup: {
                authoringEnabled: clientConfig.authoringEnabled
            }
        };
        options.distributeOptions = [{
            "target": "{that storyBrowser}.options.model",
            "record": browseResponse
        }];

        var storyBrowseComponent = sjrk.storyTelling[clientConfig.theme].page.storyBrowse(options);

        storiesPromise.resolve(storyBrowseComponent);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        storiesPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return storiesPromise;
};

/**
 * Gets the current theme from the server and loads associated files via a call to
 * loadCustomThemeFiles. Returns a promise which contains the clientConfig information.
 *
 * @return {Promise} - a fluid-flavoured promise which returns clientConfig on resolve,
 *                     returns an error object on rejection
 */
sjrk.storyTelling.loadTheme = function () {
    var loadPromise = fluid.promise();

    $.get("/clientConfig").then(function (clientConfig) {
        fluid.promise.follow(sjrk.storyTelling.loadCustomThemeFiles(clientConfig), loadPromise);
    }, function (jqXHR, textStatus, errorThrown) {
        loadPromise.reject({
            isError: true,
            message: errorThrown
        });
    });

    return loadPromise;
};

/**
 * Loads CSS and JavaScript files for the provided theme into the page markup.
 * Returns a promise. If the promise resolves, it will contain the clientConfig.
 *
 * @param {ClientConfig} clientConfig - client configuration settings
 *
 * @return {Promise} - a fluid-flavoured promise which returns clientConfig on resovle,
 *                     returns an error object on rejection
 */
sjrk.storyTelling.loadCustomThemeFiles = function (clientConfig) {
    var loadPromise = fluid.promise();

    if (clientConfig.theme !== clientConfig.baseTheme) {
        var cssUrl = fluid.stringTemplate("/css/%theme.css", {theme: clientConfig.theme});
        var scriptUrl = fluid.stringTemplate("/js/%theme.js", {theme: clientConfig.theme});

        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: cssUrl
        }).appendTo("head");

        // TODO: This method of loading produces a potential race condition
        // See SJRK-272: https://issues.fluidproject.org/browse/SJRK-272
        $.getScript(scriptUrl, function () {
            loadPromise.resolve(clientConfig);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            loadPromise.reject({
                isError: true,
                message: errorThrown
            });
        });
    } else {
        // The theme is the base theme, no custom files need to be loaded
        loadPromise.resolve(clientConfig);
    }

    return loadPromise;
};
