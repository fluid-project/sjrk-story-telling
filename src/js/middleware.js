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

fluid.defaults("sjrk.storyTelling.server.staticMiddlewareFilter", {
     gradeNames: "kettle.middleware",
     invokers: {
         handle: {
             funcName: "sjrk.storyTelling.server.staticMiddlewareFilter.handle",
             args: ["{request}", "{that}.options.allowedDirectories"]
         }
     },
     allowedDirectories: [
         "infusion",
         "gpii-binder",
         "sjrk-story-telling",
         "handlebars",
         "pagedown",
         "gpii-handlebars"]
});

sjrk.storyTelling.server.staticMiddlewareFilter.handle = function (request, allowedDirectories) {
    var togo = fluid.promise();

    var directory = path.parse(request.req.url).dir;
    var requestedNodeModulesDir = directory.split(path.sep)[1];

    var isAllowed = fluid.contains(allowedDirectories, requestedNodeModulesDir);

    if(isAllowed) {
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
