/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var { v4: uuidv4 } = require("uuid");
var path = require("path");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// Middleware to save a binary/file associated with a story
fluid.defaults("sjrk.storyTelling.server.middleware.saveStoryFile", {
    gradeNames: ["kettle.middleware.multer"],
    components: {
        storage: {
            type: "kettle.middleware.multer.storage.disk",
            options: {
                destination: "./binaryUploads",
                invokers: {
                    filenameResolver: {
                        funcName: "sjrk.storyTelling.server.middleware.saveStoryFile.filenameResolver",
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
 * {@link https://github.com/fluid-project/kettle/blob/main/docs/Middleware.md}
 *
 * @param {Object} req - the incoming request
 * @param {Object} file - an uploaded file to process
 * @param {filenameResolverCallback} cb - the callback
 */
sjrk.storyTelling.server.middleware.saveStoryFile.filenameResolver = function (req, file, cb) {
    var generatedFileName = fluid.stringTemplate("%storyId_%fileId%extension", {
        storyId: req.url.substring(req.url.lastIndexOf("/") + 1),
        fileId: uuidv4(),
        extension: path.extname(file.originalname)
    });

    cb(null, generatedFileName);
};
