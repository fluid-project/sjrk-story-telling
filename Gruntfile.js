/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

// Declare dependencies
/* global module */

"use strict";

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        // Project package file destination.
        pkg: grunt.file.readJSON("package.json"),
        lintAll: {
            sources: {
                md: ["./*.md", "docs/*.md"],
                js: ["src/**/*.js", "tests/**/*.js", "themes/**/*.js", "*.js"],
                json: ["package.json", ".eslintrc.json", "themes/**/*.json", "tests/**/*.json"],
                json5: ["./*.json5", "tests/**/*.json5"]
            }
        }
    });

    // Load the plugin(s):
    grunt.loadNpmTasks("gpii-grunt-lint-all");

    // Custom tasks:
    grunt.registerTask("default", ["lint"]);
    grunt.registerTask("lint", "Perform standard linting checks using lint-all", ["lint-all"]);
};
