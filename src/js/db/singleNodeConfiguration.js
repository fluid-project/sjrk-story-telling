/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
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
