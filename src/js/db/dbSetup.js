/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

// These eslint directives prevent the linter from complaining about the use of
// globals or arguments that will be prevent in CouchDB design doc functions
// such as views or validate_doc_update

/* global sjrk, emit, newDoc, oldDoc, userCtx, secObj */
/*eslint no-unused-vars: ["error", { "vars": "local", "argsIgnorePattern": "newDoc|oldDoc|userCtx|secObj" }]*/

"use strict";

require("infusion");
fluid.setLogging(true);
var sjrk = fluid.registerNamespace("sjrk");

require("./dbConfiguration");

sjrk.storyTelling.server.storiesDb({
    distributeOptions: {
        target: "{that}.options.couchOptions.couchUrl",
        record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
    },
    listeners: {
        "onCreate.configureCouch": "{that}.configureCouch"
    }
});
