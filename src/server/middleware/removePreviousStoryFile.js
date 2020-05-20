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
fluid.defaults("sjrk.storyTelling.server.middleware.removePreviousStoryFile", {
    gradeNames: ["kettle.middleware"],
    uploadedFilesDirectory: "./binaryUploads",
    invokers: {
        handle: {
            funcName: "sjrk.storyTelling.server.middleware.removePreviousStoryFile.handle",
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
 */
sjrk.storyTelling.server.middleware.removePreviousStoryFile.handle = function (request, uploadedFilesDirectory) {
    if (request.req.body.previousFileUrl) {
        var fileToDelete = path.join(uploadedFilesDirectory, path.basename(request.req.body.previousFileUrl));

        fluid.log(fluid.logLevel.WARN, "Deleting file: " + fileToDelete);

        if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete);
        }
    }
};
