/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var uuidv1 = require("uuid/v1");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// Middleware to save all binaries/files associated with a story
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

/**
 * @callback filenameResolverCallback - a callback to call after the filename has been resolved
 */

/**
 * Renames any uploaded files to a pattern of uuid + extension
 * For more information on middleware, see the Kettle docs:
 * {@link https://github.com/fluid-project/kettle/blob/master/docs/Middleware.md}
 *
 * @param {Object} req - the incoming request
 * @param {Object} file - an uploaded file to process
 * @param {filenameResolverCallback} cb - the callback
 */
sjrk.storyTelling.server.middleware.saveStoryWithBinaries.filenameResolver = function (req, file, cb) {
    var id = uuidv1();
    var extension = path.extname(file.originalname);
    var generatedFileName = id + extension;
    cb(null, generatedFileName);
};
