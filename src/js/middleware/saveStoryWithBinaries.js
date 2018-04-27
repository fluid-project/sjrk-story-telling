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
var uuidv1 = require("uuid/v1");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.middleware.saveStoryWithBinaries", {
    gradeNames: ["kettle.middleware.multer"],
    binaryUploadOptions: {
        fileMaxCount: 10,
        uploadDirectory: "./binaryUploads"
    },
    invokers: {
        "getMiddlewareForFileStrategy": {
            "funcName": "kettle.middleware.multer.getMiddlewareForFileStrategy",
            "args": ["{that}", "fields", [
                    {name: "file", maxCount: "{that}.options.binaryUploadOptions.fileMaxCount"},
                    {name: "model", maxCount: 1}
            ]]
        },
        "getStorage": {
            "func": "{that}.getDiskStorage"
        },
        "getDiskStorageDestinationFunc": {
            "funcName": "sjrk.storyTelling.server.middleware.saveStoryWithBinaries.getDiskStorageDestinationFunc",
            "args": ["{that}.options.binaryUploadOptions.uploadDirectory"]
        },
        "getDiskStorageFilenameFunc": {
            "funcName": "sjrk.storyTelling.server.middleware.saveStoryWithBinaries.getDiskStorageFilenameFunc"
        }
    }
});

sjrk.storyTelling.server.middleware.saveStoryWithBinaries.getDiskStorageDestinationFunc = function (uploadDirectory) {
    return function (req, file, cb) {
        cb(null, uploadDirectory);
    };
};

// Renames any uploaded files to a pattern of uuid + extension
sjrk.storyTelling.server.middleware.saveStoryWithBinaries.getDiskStorageFilenameFunc = function () {
    return function (req, file, cb) {
        var id = uuidv1();
        var extension = path.extname(file.originalname);
        var generatedFileName = id + extension;
        cb(null, generatedFileName);
    };
};
