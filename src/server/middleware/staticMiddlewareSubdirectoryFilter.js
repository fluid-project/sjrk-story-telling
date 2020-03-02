/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// Kettle middleware to prevent serving from directories not present in a whitelist
fluid.defaults("sjrk.storyTelling.server.staticMiddlewareSubdirectoryFilter", {
    gradeNames: "kettle.middleware",
    invokers: {
        handle: {
            funcName: "sjrk.storyTelling.server.staticMiddlewareSubdirectoryFilter.handle",
            args: ["{arguments}.0", "{that}.options.allowedSubdirectories"]
        }
    },
    // This should be a list of allowed subdirectory names
    allowedSubdirectories: []
});

/**
 * Restricts a given request based on whether the requested resource is contained
 * within a directory that is on a list of allowed subdirectories
 *
 * @param {Objec} request - the kettle request
 * @param {Object} allowedSubdirectories - the list of subdirectories from which to allow serving
 *
 * @return {Promise} - a fluid-flavoured promise that returns empty on resolve
 */
sjrk.storyTelling.server.staticMiddlewareSubdirectoryFilter.handle = function (request, allowedSubdirectories) {
    var togo = fluid.promise();

    var directory = path.parse(request.req.url).dir;
    //Because directory is always from a URL, it will always split on a forward slash
    var requestedSubdirectory = directory.split("/")[1];

    var isAllowed = fluid.contains(allowedSubdirectories, requestedSubdirectory);

    if (isAllowed) {
        togo.resolve();
    } else {
        togo.reject({
            isError: true,
            statusCode: 404,
            message: "Cannot GET " + request.req.originalUrl
        });
    }

    return togo;
};
