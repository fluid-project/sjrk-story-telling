/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

// This script modifies the Storytelling Tool database in order to migrate story
// data from compliance with earlier versions of the tool to 0.4.0:
//    1. Get all stories from the database
//    2. Update all stories to include the following fields & values where it
//       was not previously included:
//       a - value.schemaVersion: "0.0.1"
//       b - value.id: < the _id value from CouchDB >
//       c - value.published: true
//       d - value.timestampCreated: Date.now() (in the absence of proper information)
//       e - value.timestampPublished: Date.now()
//       f - value.content.*.order: # (assign its order in the content array)
//       g - value.content.*.firstInOrder: true/false (depending on order)
//       h - value.content.*.lastInOrder: true/false (depending on order)
//    3. Convert all `value.content.*.imageUrl` keys to `value.content.*.mediaUrl`
//    4. Remove old/unused fields from block data
//       a - authoringEnabled
//       b - contentString
//       c - hasMobileCamera
//       d - hasTranscript
//       e - languageFromSelect
//       f - languageFromInput
//       g - savingEnabled
//       h - simplifiedText
//       i - transcript
//    5. Remove old/unused fields from story data
//       a - authoringEnabled
//       b - categories
//       c - contentString
//       d - contentTypes (this field is calculated dynamically, now)
//       e - keywordString
//       f - languageFromSelect
//       g - languageFromInput
//       h - requestedTranslations
//       i - summary
//       j - thumbnailAltText
//       k - thumbnailUrl
//       l - translationOf
//    6. Prepend "./uploads/" to all `value.mediaUrl` values where it isn't already present
//    7. Upload the freshly-modified stories to the database
//    8. Get all the stories from the database
//    9. Verify the update was successful

// The command arguments are as follows:
// node migrate_undefined_to_0.0.1.js $COUCHDBURL
//
// A sample command that runs this script on the "stories" database at "localhost:5984":
// node migrate_undefined_to_0.0.1.js http://localhost:5984/stories
//
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be migrated.

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

require("../utils/dbRequestUtils.js");

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.storyUpdate");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 2) {
    fluid.log("Usage: node migrate_undefined_to_0.0.1.js $COUCHDB_URL");
    process.exit(1);
}

// these values should be reviewed & updated with every migration:
sjrk.storyUpdate.newSchemaVersion = "0.0.1";

sjrk.storyUpdate.uploadsDirectoryPrefix = "./uploads/";
sjrk.storyUpdate.timestampForUnset = new Date().toISOString();

sjrk.storyUpdate.blockValuesToRemove = [
    "imageUrl",                 // 3
    "authoringEnabled",         // 4.a
    "contentString",            // 4.b
    "hasMobileCamera",          // 4.c
    "hasTranscript",            // 4.d
    "languageFromSelect",       // 4.e
    "languageFromInput",        // 4.f
    "savingEnabled",            // 4.g
    "simplifiedText",           // 4.h
    "transcript"                // 4.i
];

sjrk.storyUpdate.storyValuesToRemove = [
    "authoringEnabled",         // 5.a
    "categories",               // 5.b
    "contentString",            // 5.c
    "contentTypes",             // 5.d
    "keywordString",            // 5.e
    "languageFromSelect",       // 5.f
    "languageFromInput",        // 5.g
    "requestedTranslations",    // 5.h
    "summary",                  // 5.i
    "thumbnailAltText",         // 5.j
    "thumbnailUrl",             // 5.k
    "translationOf"             // 5.l
];

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

    options.storiesUrl = options.couchDbUrl + "/_all_docs?include_docs=true";

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
 * @return {Promise} - A promise that resolves retrieving the stories.
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

    fluid.each(allDocs.rows, function (aRow) {
        var aDoc = aRow.doc;
        // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
        if (aDoc.type === "story") {
            // Make the required updates, adding missing fields
            // Please consult the list at the top of this file for details on each item

            if (!aDoc.schemaVersion || aDoc.schemaVersion < sjrk.storyUpdate.newSchemaVersion) {

                aDoc.schemaVersion = sjrk.storyUpdate.newSchemaVersion; // 2.a

                aDoc.value.id = aDoc.value.id || aDoc._id; // 2.b
                aDoc.value.published = aDoc.value.published || true; // 2.c
                aDoc.value.timestampCreated = aDoc.value.timestampCreated || sjrk.storyUpdate.timestampForUnset; // 2.d
                aDoc.value.timestampPublished = aDoc.value.timestampPublished || sjrk.storyUpdate.timestampForUnset; // 2.e

                var blocks = fluid.copy(aDoc.value.content);

                fluid.each(blocks, function (block, i) {
                    block.order = block.order || i; // 2.f
                    block.firstInOrder = block.firstInOrder || i === 0; // 2.g
                    block.lastInOrder = block.lastInOrder || i === aDoc.value.content.length - 1; // 2.h

                    if (block.imageUrl) {
                        block.mediaUrl = block.imageUrl; // 3
                    }

                    if (block.mediaUrl && !block.mediaUrl.startsWith(sjrk.storyUpdate.uploadsDirectoryPrefix)) {
                        block.mediaUrl = sjrk.storyUpdate.uploadsDirectoryPrefix + block.mediaUrl; // 6
                    }

                    // remove obsolete/unused block keys, steps 3 & 4
                    block = fluid.censorKeys(block, sjrk.storyUpdate.blockValuesToRemove);

                    aDoc.value.content[i] = block;
                });

                // remove obsolete/unused story keys, step 5
                aDoc.value = fluid.censorKeys(aDoc.value, sjrk.storyUpdate.storyValuesToRemove);

                fluid.log("Updating the story with ID: ", aDoc._id);
                updatedDocs.push(aDoc);
            }
        }
    });

    options.updatedDocs = updatedDocs;

    /*
     * Refactor or remove this return value and the accompanying structure that passes them along.
     *
     * SJRK-429 has been filed to address this: https://issues.fluidproject.org/browse/SJRK-429
     */
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
        dataToPost: options.updatedDocs,
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
    fluid.log("-- -- --");
    fluid.log("Updated ", options.updatedDocs.length, " of ", options.totalNumOfDocs, " documents.");
    fluid.log("-- -- --");
    return options.updatedDocs.length;
};

/**
 * Create the step that retrieves stories from the database
 *
 * @param {Object} options - The documents to be verified:
 * @param {Array} options.updatedDocs - The documents to verify
 *
 * @return {Promise} - The promise that resolves the verificatioon
 */
sjrk.storyUpdate.verifyStories = function (options) {
    var details = {
        requestUrl: options.storiesUrl,
        requestErrMsg: "Error retrieving stories from the database: ",
        responseDataHandler: sjrk.storyUpdate.verifyStoriesData,
        responseErrMsg: "Error retrieving stories from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Check all database documents for errors related to the data update
 *
 * @param {String} responseString - the response from the request to get all documents
 * @param {Object} options - Where to store any potentially-discovered invalid documents
 *
 * @return {Array} - The invalid documents found during verification
 */
sjrk.storyUpdate.verifyStoriesData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);

    if (allDocs.total_rows !== options.totalNumOfDocs) {
        throw "Number of records retrieved for verification does not match number of records retrieved for updating";
    }

    var invalidDocs = [];

    fluid.each(allDocs.rows, function (aRow) {
        var aDoc = aRow.doc;
        // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
        if (aDoc.type === "story") {

            // assume all stories were successfully migrated
            // if an error is discovered, the cause will be tracked
            var invalidStoryReasons = [];

            if (!aDoc.schemaVersion || aDoc.schemaVersion !== sjrk.storyUpdate.newSchemaVersion) {
                invalidStoryReasons.push("Story schema version is not up to date");
            }

            if (!aDoc.value.id || aDoc.value.id !== aDoc._id) {
                invalidStoryReasons.push("Story ID and internal database ID do not match");
            }

            invalidStoryReasons = invalidStoryReasons.concat(sjrk.storyUpdate.verifyRequiredKeys(aDoc.value, {
                "published": true,
                "timestampCreated": sjrk.storyUpdate.timestampForUnset,
                "timestampPublished": sjrk.storyUpdate.timestampForUnset
            }, "Story: "));

            fluid.each(aDoc.value.content, function (block, i) {
                invalidStoryReasons = invalidStoryReasons.concat(sjrk.storyUpdate.verifyRequiredKeys(block, {
                    "order": i,
                    "firstInOrder": i === 0,
                    "lastInOrder": i === aDoc.value.content.length - 1
                }, "Block at index " + i + ": "));

                if (block.mediaUrl && !block.mediaUrl.startsWith(sjrk.storyUpdate.uploadsDirectoryPrefix)) {
                    invalidStoryReasons.push("Block at index " + i + ": mediaUrl does not start with " + sjrk.storyUpdate.uploadsDirectoryPrefix);
                }

                // check for obsolete/unused block keys
                fluid.each(fluid.filterKeys(block, sjrk.storyUpdate.blockValuesToRemove), function (blockValue, key) {
                    invalidStoryReasons.push("Block at index " + i + " still has removed value: " + key);
                });
            });

            // check for obsolete/unused story keys
            fluid.each(fluid.filterKeys(aDoc.value, sjrk.storyUpdate.storyValuesToRemove), function (storyValue, key) {
                invalidStoryReasons.push("Story still has removed value: " + key);
            });

            if (invalidStoryReasons.length > 0) {
                fluid.log(fluid.logLevel.WARN, aDoc._id + " is invalid:");

                fluid.each(invalidStoryReasons, function (reason) {
                    fluid.log(fluid.logLevel.WARN, "- " + reason);
                });

                invalidDocs.push(aDoc);
            }
        }
    });

    options.invalidDocs = invalidDocs;

    if (invalidDocs.length > 0) {
        throw {
            isError: true,
            message: "" + invalidDocs.length + " invalid document" + (invalidDocs.length === 1 ? "" : "s") + " detected"
        };
    }

    return invalidDocs;
};

/**
 * Given a set of keys, check a collection for their presence.
 * If any of them is not present, an error message is added to a
 * collection which is returned
 *
 * @param {Object} collectionToVerify - the collection to iterate over and verify
 * @param {Object.<String, Any>} requiredKeys - the keys which are required to be present
 *                                              the expected format is: { keyName: expectedValue }
 * @param {String} messagePrefix - A string with which to prefix any error messages
 *
 * @return {Array} - The messages for all missing values
 */
sjrk.storyUpdate.verifyRequiredKeys = function (collectionToVerify, requiredKeys, messagePrefix) {
    var requiredKeyMissingMessages = [];

    fluid.each(requiredKeys, function (value, key) {
        if (collectionToVerify[key] === undefined) {
            requiredKeyMissingMessages.push(messagePrefix + "Collection does not have the required key " + key);
        } else if (collectionToVerify[key] !== value) {
            requiredKeyMissingMessages.push(messagePrefix + "key '" + key + "' does not have the expected value of '" + value + "' and is instead '" + collectionToVerify[key] + "'");
        }
    });

    return requiredKeyMissingMessages;
};

/**
 * Create and execute the steps to migrate documents.
 */
sjrk.storyUpdate.updateAllStoryData = function () {
    var options = sjrk.storyUpdate.initOptions(process.argv);
    var sequence = [
        sjrk.storyUpdate.retrieveStories,
        sjrk.storyUpdate.updateDB,
        sjrk.storyUpdate.verifyStories
    ];
    fluid.promise.sequence(sequence, options).then(
        function (/*result*/) {
            fluid.log("Done.");
            process.exit(0);
        },
        function (error) {
            fluid.log(fluid.logLevel.WARN, "-- -- --");
            fluid.log(fluid.logLevel.WARN, error);
            fluid.log(fluid.logLevel.WARN, "-- -- --");
            process.exit(1);
        }
    );
};

sjrk.storyUpdate.updateAllStoryData();
