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
var fs = require("fs");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

// Middleware to remove the previous file associated with a story block
fluid.defaults("sjrk.storyTelling.server.middleware.deleteFile", {
    gradeNames: ["kettle.middleware"],
    uploadedFilesDirectory: "./binaryUploads",
    invokers: {
        handle: {
            funcName: "sjrk.storyTelling.server.middleware.deleteFile.handle",
            args: ["{arguments}.0", "{that}.options.uploadedFilesDirectory"]
        }
    }
});

/**
 * Deletes the previous file from the file system
 * For more information on middleware, see the Kettle docs:
 * {@link https://github.com/fluid-project/kettle/blob/master/docs/Middleware.md}
 *
 * @param {Object} request - the incoming request
 * @param {String} uploadedFilesDirectory - the directory where uploaded files are stored
 */
sjrk.storyTelling.server.middleware.deleteFile.handle = function (request, uploadedFilesDirectory) {
    if (request.req.body.previousFileUrl) {
        var fileToDelete = path.join(uploadedFilesDirectory, path.basename(request.req.body.previousFileUrl));

        fluid.log(fluid.logLevel.WARN, "Deleting file: ", fileToDelete, "...");

        try {
            if (fs.existsSync(fileToDelete)) {
                fs.unlinkSync(fileToDelete);
            } else {
                throw "The specified file did not exist, and could not be deleted: " + fileToDelete;
            }

            fluid.log(fluid.logLevel.WARN, "Successfully deleted file: ", fileToDelete);
        } catch (err) {
            fluid.log(fluid.logLevel.FAIL, "Error deleting file \"", fileToDelete, "\".");
            fluid.log(fluid.logLevel.FAIL, "Error detail: ", err.toString());
        }
    }
};
