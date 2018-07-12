/*
Copyright 2017-2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
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
    formFieldOptions: {
        method: "fields",
        fields: [
            {name: "file", maxCount: "{that}.options.binaryUploadOptions.fileMaxCount"},
            {name: "model", maxCount: 1}
        ]
    },
    members: {
        storage: "{that}.diskStorage"
    },
    invokers: {
        "diskStorageDestination": {
            func: {
                expander: {
                    "funcName": "sjrk.storyTelling.server.middleware.saveStoryWithBinaries.diskStorageDestination",
                    "args": ["{that}.options.binaryUploadOptions.uploadDirectory"]
                }
            }
        },
        "diskStorageFilename": {
            "funcName": "sjrk.storyTelling.server.middleware.saveStoryWithBinaries.diskStorageFilename"
        }
    }
});

sjrk.storyTelling.server.middleware.saveStoryWithBinaries.diskStorageDestination = function (uploadDirectory) {
    return function (req, file, cb) {
        cb(null, uploadDirectory);
    };
};

// Renames any uploaded files to a pattern of uuid + extension
sjrk.storyTelling.server.middleware.saveStoryWithBinaries.diskStorageFilename = function (req, file, cb) {
    var id = uuidv1();
    var extension = path.extname(file.originalname);
    var generatedFileName = id + extension;
    cb(null, generatedFileName);
};
