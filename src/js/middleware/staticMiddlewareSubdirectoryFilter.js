/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

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
