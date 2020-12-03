/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    kettle = require("kettle");

require("../../src/server/staticHandlerBase");
require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/requestHandlers");
require("../../src/server/validators");
require("./utils/serverTestUtils.js");

kettle.loadTestingSupport();

// Configs which can be found to be bad at definition time
jqUnit.test("Config with missing theme folder", function () {
    jqUnit.expectFrameworkDiagnostic("Config with missing theme folder failed as expected", function () {
        kettle.config.loadConfig({
            configName: "sjrk.storyTelling.server.testServerWithMissingTheme",
            configPath: "./tests/server/configs"
        });
    }, "The custom theme folder ./themes/aThemeThatIsntReal does not exist. Please verify that the theme name is configured properly.");
});
