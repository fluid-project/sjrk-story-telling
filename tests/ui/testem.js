/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

require("fluid-testem");

fluid.defaults("fluid.tests.testem", {
    gradeNames: ["fluid.testem.instrumentation"],
    coverageDir: "coverage",
    reportsDir: "reports",
    testPages: ["tests/ui/all-tests.html"],
    instrumentationOptions: {
        nonSources: [
            "./**/*.!(js)",
            "./Gruntfile.js"
        ]
    },
    sourceDirs: {
        src: "src"
    },
    contentDirs: {
        tests: "tests"
    },
    testemOptions: {
        launch: "Headless Chrome,Headless Firefox",
        ignore_missing_launchers: true,
        disable_watching: true,
        tap_quiet_logs: true
    }
});

module.exports = fluid.tests.testem().getTestemOptions();
