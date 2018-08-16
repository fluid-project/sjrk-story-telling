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
    formFieldOptions: {
        method: "fields",
        fields: [
            {name: "file", maxCount: 10},
            {name: "model", maxCount: 1}
        ]
    },
    components: {
        storage: {
            type: "kettle.middleware.multer.storage.disk",
            options: {
                destination: "./binaryUploads",
                invokers: {
                    filenameResolver: {
                        funcName: "sjrk.storyTelling.server.middleware.saveStoryWithBinaries.filenameResolver",
                        args: ["{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    }
                }
            }
        }
    }
});

// Renames any uploaded files to a pattern of uuid + extension
sjrk.storyTelling.server.middleware.saveStoryWithBinaries.filenameResolver = function (req, file, cb) {
    var id = uuidv1();
    var extension = path.extname(file.originalname);
    var generatedFileName = id + extension;
    cb(null, generatedFileName);
};
