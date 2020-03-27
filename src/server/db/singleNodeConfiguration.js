/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

// Performs a single node configuration, per
// documentation at http://docs.couchdb.org/en/latest/install/setup.html

"use strict";

// the basic configuration
fluid.defaults("sjrk.storyTelling.server.singleNodeDb.core", {
    gradeNames: ["fluid.couchConfig.pipeline.retrying"],
    listeners: {
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)"
    }
});

// includes the replicator database name
fluid.defaults("sjrk.storyTelling.server.replicatorDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.core"],
    couchOptions: {
        dbName: "_replicator"
    }
});

// includes the users database name
fluid.defaults("sjrk.storyTelling.server.usersDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.core"],
    couchOptions: {
        dbName: "_users"
    }
});

// includes the global_changes database name
fluid.defaults("sjrk.storyTelling.server.globalChangesDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.core"],
    couchOptions: {
        dbName: "_global_changes"
    }
});
