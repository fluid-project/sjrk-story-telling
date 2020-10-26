/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
require("./src/server/staticHandlerBase");
require("./src/server/middleware/basicAuth");
require("./src/server/middleware/saveStoryWithBinaries");
require("./src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("./src/server/dataSource");
require("./src/server/serverSetup");
require("./src/server/requestHandlers");

fluid.registerNamespace("sjrk");

kettle.config.loadConfig({
    configName: "sjrk.storyTelling.server.config",
    configPath: "."
});
