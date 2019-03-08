/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
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
