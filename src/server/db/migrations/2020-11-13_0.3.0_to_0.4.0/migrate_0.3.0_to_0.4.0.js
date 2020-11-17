/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

// This script modifies the Storytelling Tool database in order to migrate story
// data from compliance with 0.3.0 and earlier to 0.4.0:
//    1. Get all stories from the database
//    2. Update all stories to include the following fields & values where it
//       was not previously included:
//        - value.data_version: "0.4.0"
//        - value.id: < the _id value from CouchDB >
//        - value.published: true
//        - value.timestampCreated: Date.now() (in the absence of proper information)
//        - value.timestampPublished: Date.now()
//        - value.content.*.order: # (assign its order in the content array)
//        - value.content.*.firstInOrder: true/false (depending on order)
//        - value.content.*.lastInOrder: true/false (depending on order)
//    3. Convert all `value.content.*.imageUrl` keys to `value.content.*.mediaUrl`
//    4. Remove old/unused fields from story data
//        - authoringEnabled
//        - categories
//        - contentString
//        - contentTypes (this field is calculated dynamically, now)
//        - keywordString
//        - languageFromSelect
//        - languageFromInput
//        - requestedTranslations
//        - summary
//        - thumbnailAltText
//        - thumbnailUrl
//        - translationOf
//    5. Remove old/unused fields from block data
//        - authoringEnabled
//        - contentString
//        - hasMobileCamera
//        - hasTranscript
//        - languageFromSelect
//        - languageFromInput
//        - savingEnabled
//        - simplifiedText
//        - transcript
//    6. Prepend "./uploads/" to all `value.mediaUrl` values
//    7. Upload the freshly-modified stories to the database
//    8. Get all the stories from the database
//    9. Verify the update was successful

// A sample command that runs this script:
// node migrate_0.3.0_to_0.4.0.js $COUCHDBURL [maxDocsInBatchPerRequest]
//
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be migrated.
// @param {Number} maxDocsInBatchPerRequest - [optional] Limit the number of stories to be processed in a batch.
//     Default to 100 if not provided.

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

require("../utils/dbRequestUtils.js");

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.storyUpdate");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 3) {
    fluid.log("Usage: node migrate_0.3.0_to_0.4.0.js $COUCHDB_URL [maxDocsInBatchPerRequest]");
    process.exit(1);
}

sjrk.storyUpdate.defaultMaxDocsInBatchPerRequest = 100;

/**
 * Create a set of options for data loader and a function to retreive them.
 * The options are based on the command line parameters and a set of database
 * constants
 *
 * @param {Array} processArgv - The command line arguments.
 *
 * @return {Object} - The options.
 */
sjrk.storyUpdate.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2];
    options.maxDocsInBatchPerRequest = Number(processArgv[3]) || sjrk.storyUpdate.defaultMaxDocsInBatchPerRequest;

    options.storiesUrl = options.couchDbUrl + "/_all_docs?include_docs=true&limit=" + options.maxDocsInBatchPerRequest;

    // Set up database specific options
    options.parsedCouchDbUrl = url.parse(options.couchDbUrl);
    options.postOptions = {
        hostname: options.parsedCouchDbUrl.hostname,
        port: options.parsedCouchDbUrl.port,
        path: "/stories/_bulk_docs",
        auth: options.parsedCouchDbUrl.auth,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Length": 0, // this value is filled in at runtime
            "Content-Type": "application/json"
        }
    };
    fluid.log("COUCHDB_URL: '" +
        options.parsedCouchDbUrl.protocol + "//" +
        options.parsedCouchDbUrl.hostname + ":" +
        options.parsedCouchDbUrl.port +
        options.parsedCouchDbUrl.pathname + "'"
    );
    return options;
};

/**
 * Create the step that retrieves stories from the database
 *
 * @param {Object} options - options for the query
 *
 * @return {Promise} - A promise that resolves retrieving the tokens.
 */
sjrk.storyUpdate.retrieveStories = function (options) {
    var details = {
        requestUrl: options.storiesUrl,
        requestErrMsg: "Error retrieving stories from the database: ",
        responseDataHandler: sjrk.storyUpdate.updateStoriesData,
        responseErrMsg: "Error retrieving stories from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the documents from the database, update their data according to the new data model
 *
 * @param {String} responseString - the response from the request to get all documents
 * @param {Object} options - Where to store the to-be-updated documents
 *
 * @return {Array} - The updated documents in the new data structure with the new schema version.
 */
sjrk.storyUpdate.updateStoriesData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);
    var updatedDocs = [];
    options.totalNumOfDocs = allDocs.total_rows;

    if (allDocs.rows) {
        fluid.each(allDocs.rows, function (aRow) {
            var aDoc = aRow.doc;
            // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
            if (aDoc.type === "story") {
                // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
                // aDoc.schemaVersion = sjrk.storyUpdate.newSchemaVersion;

                // do the heavy lifting here

                fluid.log("Updating the story with ID: ", aDoc._id);
                updatedDocs.push(aDoc);
            }
        });
        options.updatedDocs = updatedDocs;
    }
    return updatedDocs;
};

/**
 * Configure update, in batch, of the documents
 *
 * @param {Object} options - The documents to be updated:
 * @param {Array} options.updatedDocs - The documents to update
 *
 * @return {Promise} - The promise that resolves the update
 */
sjrk.storyUpdate.updateDB = function (options) {
    var details = {
        // dataToPost: options.updatedDocs,
        responseDataHandler: sjrk.storyUpdate.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Log how many documents were updated
 *
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of documents:
 * @param {Array} options.updatedDocs - The documents to update
 *
 * @return {Number} - the number of documents updated.
 */
sjrk.storyUpdate.logUpdateDB = function (responseString, options) {
    fluid.log("Updated ", options.updatedDocs.length, " of ", options.totalNumOfDocs, " story documents.");
    return options.updatedDocs.length;
};

/**
 * Create and execute the steps to migrate documents.
 */
sjrk.storyUpdate.updateAllStoryData = function () {
    var options = sjrk.storyUpdate.initOptions(process.argv);
    var sequence = [
        sjrk.storyUpdate.retrieveStories,
        sjrk.storyUpdate.updateDB
    ];
    fluid.promise.sequence(sequence, options).then(
        function (/*result*/) {
            fluid.log("Done.");
            process.exit(0);
        },
        function (error) {
            fluid.log(error);
            process.exit(1);
        }
    );
};

sjrk.storyUpdate.updateAllStoryData();
