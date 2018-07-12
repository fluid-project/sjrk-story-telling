/*
Copyright 2017-2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

// Performs a single node configuration, per
// documentation at http://docs.couchdb.org/en/latest/install/setup.html

fluid.defaults("sjrk.storyTelling.server.singleNodeDb.base", {
    gradeNames: ["fluid.couchConfig.pipeline.retrying"],
    listeners: {
        "onSuccess.logSuccess": "fluid.log(SUCCESS)",
        "onError.logError": "fluid.log({arguments}.0.message)"
    }
});

fluid.defaults("sjrk.storyTelling.server.replicatorDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.base"],
    couchOptions: {
        dbName: "_users"
    }
});

fluid.defaults("sjrk.storyTelling.server.usersDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.base"],
    couchOptions: {
        dbName: "_replicator"
    }
});

fluid.defaults("sjrk.storyTelling.server.globalChangesDb", {
    gradeNames: ["sjrk.storyTelling.server.singleNodeDb.base"],
    couchOptions: {
        dbName: "_global_changes"
    }
});
