/*
Copyright 2017 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");
require("./src/server/staticHandlerBase");
require("./src/server/middleware/basicAuth");
require("./src/server/middleware/saveStoryWithBinaries");
require("./src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("./src/server/dataSource");
require("./src/server/serverSetup");
require("./src/server/requestHandlers");

var sjrk = fluid.registerNamespace("sjrk");

sjrk.storyTelling.server();
