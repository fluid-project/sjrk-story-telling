/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");

fluid.require("express-basic-auth", require, "kettle.npm.basicAuth");

// Wraps standard Express middleware for performing
// basic auth

fluid.defaults("kettle.middleware.basicAuth", {
    gradeNames: ["kettle.plainMiddleware"],
    // https://www.npmjs.com/package/express-basic-auth#how-to-use
    middlewareOptions: {},
    middleware: "@expand:kettle.npm.basicAuth({that}.options.middlewareOptions)"
});
