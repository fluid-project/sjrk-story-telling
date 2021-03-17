/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

require("kettle");
fluid.require("fluid-json-schema");

fluid.defaults("sjrk.storyTelling.server.signupValidator", {
    gradeNames: ["fluid.schema.kettle.validator.body"],
    requestSchema: {
        "$schema": "fss-v7-full#",
        type: "object",
        properties: {
            email: {
                type: "string",
                required: true,
                format: "email"
            },
            password: {
                type: "string",
                required: true,
                minLength: 8
            },
            confirm: {
                type: "string",
                required: true,
                minLength: 8
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.loginValidator", {
    gradeNames: ["fluid.schema.kettle.validator.body"],
    requestSchema: {
        "$schema": "fss-v7-full#",
        type: "object",
        properties: {
            email: {
                type: "string",
                required: true,
                format: "email"
            },
            password: {
                type: "string",
                required: true,
                minLength: 8
            }
        }
    }
});
