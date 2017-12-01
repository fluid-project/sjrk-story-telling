/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var uuidv1 = require("uuid/v1");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.getStoryHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleStorageRequest",
            args: ["{request}", "{server}.dataSource", false]
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.saveStoryHandler", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleStorageRequest",
            args: ["{request}", "{server}.dataSource", true]
        }
    }
});

sjrk.storyTelling.server.handleStorageRequest = function (request, dataSource, isSave) {
    var id = request.req.params.id ? request.req.params.id : (isSave ? uuidv1() : "");
    var promise = isSave ?
        dataSource.set({directStoryId: id}, request.req.body) :
        dataSource.get({directStoryId: id});

    promise.then(function (response) {
        var responseAsJSON = JSON.stringify(response);
        request.events.onSuccess.fire(responseAsJSON);
    }, function (error) {
        var errorAsJSON = JSON.stringify(error);
        request.events.onError.fire({
            message: errorAsJSON
        });
    });
};

fluid.defaults("sjrk.storyTelling.server.staticHandlerBase", {
    gradeNames: "kettle.request.http",
    invokers: {
        handleRequest: {
            funcName: "kettle.request.notFoundHandler"
        }
    }
});

var staticHandlerGrades = {
    "uiHandler": "{server}.ui"
};

var createStaticHandlerGrade = function (gradeSuffix, middlewareIoCReference) {
    return fluid.defaults("sjrk.storyTelling.server." + gradeSuffix, {
        gradeNames: ["sjrk.storyTelling.server.staticHandlerBase"],
        requestMiddleware: {
            "static": {
                middleware: middlewareIoCReference
            }
        }
    });
};

var createStaticHandlerGrades = function (staticHandlerGrades) {
    fluid.each(staticHandlerGrades, function (middlewareIoCReference, gradeSuffix) {
        createStaticHandlerGrade(gradeSuffix, middlewareIoCReference);
    });
};

createStaticHandlerGrades(staticHandlerGrades);
