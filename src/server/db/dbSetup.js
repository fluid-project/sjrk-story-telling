/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
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

require("./singleNodeConfiguration");
require("./authors-dbConfiguration");
require("./story-dbConfiguration");


// Mix-in grade for all the couch configuration
// components when actually used to configure
// the DB
fluid.defaults("sjrk.storyTelling.server.dbSetup.core", {
    distributeOptions: [
        {
            target: "{that}.options.couchOptions.couchUrl",
            record: "@expand:kettle.resolvers.env(COUCHDB_URL)"
        },
        {
            target: "{that}.options.components.retryingBehaviour.options.retryOptions.maxRetries",
            record: "@expand:kettle.resolvers.env(COUCHDB_CONFIG_MAX_RETRIES)"
        },
        {
            target: "{that}.options.components.retryingBehaviour.options.retryOptions.retryDelay",
            record: "@expand:kettle.resolvers.env(COUCHDB_CONFIG_RETRY_DELAY)"
        }
    ],
    listeners: {
        "onCreate.configureCouch": "{that}.configureCouch"
    }
});

// sets up a new instance of the core setup along with replicatorDb defined
sjrk.storyTelling.server.replicatorDb({
    gradeNames: ["sjrk.storyTelling.server.dbSetup.core"]
});

// sets up a new instance of the core setup along with usersDb defined
sjrk.storyTelling.server.usersDb({
    gradeNames: ["sjrk.storyTelling.server.dbSetup.core"]
});

// sets up a new instance of the core setup along with globalChangesDb defined
sjrk.storyTelling.server.globalChangesDb({
    gradeNames: ["sjrk.storyTelling.server.dbSetup.core"]
});

// sets up a new instance of the core setup along with the storiesDb defined
sjrk.storyTelling.server.storiesDb({
    gradeNames: ["sjrk.storyTelling.server.dbSetup.core"]
});

// sets up a new instance of the core setup along with the storyUsersDb defined
sjrk.storyTelling.server.authorsDb({
    gradeNames: ["sjrk.storyTelling.server.dbSetup.core"]
});
