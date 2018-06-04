/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
require("kettle");
require("./src/js/staticHandlerBase");
require("./src/js/middleware/basicAuth");
require("./src/js/middleware/saveStoryWithBinaries");
require("./src/js/middleware/staticMiddlewareSubdirectoryFilter");
require("./src/js/dataSource");
require("./src/js/serverSetup");
require("./src/js/requestHandlers");

var sjrk = fluid.registerNamespace("sjrk");

sjrk.storyTelling.server();
