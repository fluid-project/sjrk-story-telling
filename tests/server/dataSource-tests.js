/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit");

require("../../src/server/dataSource");
require("../../src/server/db/story-dbConfiguration");
require("./utils/serverTestUtils.js");
require("./utils/mockDatabase.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.test.storyTelling.server.dataSource.mockRecords");

// NOTE: These mock documents may not include all properties that are included in the real documents. Only those
// required for testing are guaranteed to be present.
sjrk.test.storyTelling.server.dataSource.mockRecords.docs = {
    "author1": {
        "type": "user",
        "email": "test@example.com",
        "authorID": "author1"
    },
    "author2": {
        "type": "user",
        "email": "test2@example.com",
        "authorID": "author2"
    },
    "publishedStory": {
        "type": "story",
        "authorID": "author1",
        "value": {
            "published": true,
            "id": "publishedStory",
            "title": "Sample Story 1",
            "author": "IDRC",
            "tags": [
                "Test",
                "Example"
            ],
            "content": [{
                "heading": "Add Content Blocks",
                "blockType": "text",
                "text": "The Story Builder is designed based on building blocks."
            }]
        }
    },
    "storyByOtherAuthor": {
        "type": "story",
        "authorID": "author2",
        "value": {
            "published": true,
            "id": "storyByOtherAuthor",
            "title": "Sample Story 2",
            "content": [{
                "heading": "Reorder Content Blocks",
                "blockType": "text",
                "text": "You can reorder your content blocks using the mouse or keyboard as follows."
            }],
            "author": "SJRK",
            "tags": [
                "Example",
                "Sample"
            ]
        }
    },
    "unpublishedStory": {
        "type": "story",
        "authorID": "author1",
        "value": {
            "published": false,
            "id": "unpublishedStory",
            "title": "Sample Story 3",
            "content": [{
                "heading": "Navigating through Content Blocks",
                "blockType": "text",
                "text": "You can use the up/down arrow keys on your keyboard to move focus from block to block."
            }],
            "author": "Fluid",
            "tags": [
                "Example"
            ]
        }
    }
};

sjrk.test.storyTelling.server.dataSource.mockRecords.tagsResponse = {
    "total_rows": 8,
    "offset": 0,
    "rows": [{
        "key": "Example",
        "id": "publishedStory",
        "value": "Sample Story 1"
    }, {
        "key": "Example",
        "id": "storyByOtherAuthor",
        "value": "Sample Story 2"
    }, {
        "key": "Example",
        "id": "storyExample",
        "value": "The Story Builder how-to"
    }, {
        "key": "Example",
        "id": "unpublishedStory",
        "value": "Sample Story 3"
    }, {
        "key": "Help",
        "id": "storyExample",
        "value": "The Story Builder how-to"
    }, {
        "key": "How-to",
        "id": "storyExample",
        "value": "The Story Builder how-to"
    }, {
        "key": "Sample",
        "id": "storyByOtherAuthor",
        "value": "Sample Story 2"
    }, {
        "key": "Test",
        "id": "publishedStory",
        "value": "Sample Story 1"
    }]
};

/**
 * Converts an object of dbDocuments to a the expected response object from a call to the stories view.
 *
 * @param {Object} records - a set of dbDocuments to convert to the expected stories view response.
 * @return {Object} - a couchDB style view response.
 */
sjrk.test.storyTelling.server.dataSource.recordsToStoryViewResponse = function (records) {
    var filter = ["title", "author", "tags", "content"];

    var response = {
        offset: 0,
        rows: []
    };

    fluid.each(records, function (record, id) {
        if (record.type === "story") {
            var story = fluid.copy(record.value);

            if (story.published) {
                story = fluid.filterKeys(story, filter);

                response.rows.push({
                    "key": id,
                    "id": id,
                    "value": story
                });
            }
        }
    });
    response.total_rows = response.rows.length;

    return response;
};

fluid.defaults("sjrk.test.storyTelling.server.dataSource.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    dbHost: "http://localhost:6789",
    distributeOptions: {
        dataSourceHost: {
            source: "{that}.options.dbHost",
            target: "{that sjrk.storyTelling.server.dataSource.couch.core}.options.host"
        }
    },
    components: {
        testDB: {
            type: "sjrk.test.storyTelling.server.mockDatabase",
            createOnEvent: "{datasourceTester}.events.onTestCaseStart",
            options: {
                components: {
                    storiesDBConfig: {
                        options: {
                            dbDocuments: sjrk.test.storyTelling.server.dataSource.mockRecords.docs
                        }
                    }
                }
            }
        },
        // a DataSource to get a list of stories
        viewDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.view"
        },
        // a DataSource to get a stories by author
        storyByAuthorDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.authorStoriesView"
        },
        // a DataSource to get or save a single story
        storyDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.story"
        },
        // a DataSource to delete a single story
        deleteStoryDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.deleteStory"
        },
        datasourceTester: {
            type: "sjrk.test.storyTelling.server.dataSource.tester"
        }
    }
});

fluid.defaults("sjrk.test.storyTelling.server.dataSource.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    members: {
        rev: null
    },
    testOpts: {
        storiesViewError: {
            "reason": "ddoc _design/stories has no view named notAView",
            "message": "not_found while executing HTTP GET on url http://localhost:6789/stories/_design/stories/_view/notAView?limit=500&reduce=false&skip=0",
            "isError": true,
            "statusCode": 404
        },
        storyMissingError: {
            "reason": "missing",
            "message": "not_found while executing HTTP %method on url http://localhost:6789/stories/%storyId",
            "isError": true,
            "statusCode": 404
        },
        newStory: {
            "value": {
                "published": true,
                "id": "newStory",
                "title": "Sample Story New",
                "author": "IDRC",
                "tags": [
                    "New",
                    "Example"
                ],
                "content": [{
                    "heading": "New Content",
                    "blockType": "text",
                    "text": "New Content"
                }]
            }
        },
        updatedStory: {
            "value": {
                "published": true,
                "id": "newStory",
                "title": "Sample Story Updated",
                "author": "IDRC",
                "tags": [
                    "Updated",
                    "Example"
                ],
                "content": [{
                    "heading": "Updated Content",
                    "blockType": "text",
                    "text": "Updated Content"
                }]
            }
        }
    },
    invokers: {
        getPublishedStories: "sjrk.test.storyTelling.server.dataSource.recordsToStoryViewResponse"
    },
    modules: [{
        name: "Test Storytelling Datasources",
        tests: [{
            name: "Test that database was initialized",
            expect: 1,
            sequence: [{
                event: "{testEnvironment testDB}.events.onReady",
                listener: "jqUnit.assert",
                args: ["The testDB has been initialized with the requested database configurations"]
            }]
        }, {
            name: "Test story view datasource",
            expect: 3,
            sequence: [{
                task: "{viewDataSource}.get",
                args: [{directViewId: "storiesById"}],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "All published stories were returned",
                    {
                        expander: {
                            func: "{that}.getPublishedStories",
                            args: ["{testDB}.storiesDBConfig.options.dbDocuments"]
                        }
                    },
                    "{arguments}.0"
                ]
            }, {
                task: "{viewDataSource}.get",
                args: [{directViewId: "storyTags"}],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "All the story tags were returned",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.tagsResponse,
                    "{arguments}.0"
                ]
            }, {
                task: "{viewDataSource}.get",
                args: [{directViewId: "notAView"}],
                reject: "jqUnit.assertDeepEq",
                rejectArgs: ["An error was returned for the missing view", "{that}.options.testOpts.storiesViewError", "{arguments}.0"]
            }]
        }, {
            name: "Test authors stories view datasource",
            expect: 5,
            sequence: [{
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author1",
                    storyId: "publishedStory"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author1, publishedStory",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.docs.publishedStory.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author2",
                    storyId: "storyByOtherAuthor"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author2, storyByOtherAuthor",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.docs.storyByOtherAuthor.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author1",
                    storyId: "unpublishedStory"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author1, unpublishedStory",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.docs.unpublishedStory.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "noAuthor",
                    storyId: "unpublishedStory"
                }],
                resolve: "jqUnit.assertUndefined",
                resolveArgs: [
                    "No story returned - author not found",
                    "{arguments}.0.rows.0"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author1",
                    storyId: "notAStory"
                }],
                resolve: "jqUnit.assertUndefined",
                resolveArgs: [
                    "No story returned - story not found",
                    "{arguments}.0.rows.0"
                ]
            }]
        }, {
            name: "Test stories datasource",
            expect: 7,
            sequence: [{
                task: "{storyDataSource}.get",
                args: [{directStoryId: "publishedStory"}],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "Retrieved the published story",
                    fluid.extend(
                        {authorID: sjrk.test.storyTelling.server.dataSource.mockRecords.docs.publishedStory.authorID},
                        sjrk.test.storyTelling.server.dataSource.mockRecords.docs.publishedStory.value
                    ),
                    "{arguments}.0",
                    {filter: "_rev"}
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "unpublishedStory"}],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "Retrieved the unpublished story",
                    fluid.extend(
                        {authorID: sjrk.test.storyTelling.server.dataSource.mockRecords.docs.unpublishedStory.authorID},
                        sjrk.test.storyTelling.server.dataSource.mockRecords.docs.unpublishedStory.value
                    ),
                    "{arguments}.0",
                    {filter: "_rev"}
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "invalidStoryID"}],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error returned for invalid story id",
                    "{that}.options.testOpts.storyMissingError",
                    "{arguments}.0",
                    {storyId: "invalidStoryID"}
                ]
            }, {
                task: "{storyDataSource}.set",
                args: [{directStoryId: "{that}.options.testOpts.newStory.value.id"}, "{that}.options.testOpts.newStory"],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "The new story should be saved",
                    {
                        "ok": true,
                        "id": "{that}.options.testOpts.newStory.value.id"
                    },
                    "{arguments}.0",
                    {filter: "rev"}
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "{that}.options.testOpts.newStory.value.id"}],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "Retrieved the new story",
                    "{that}.options.testOpts.newStory.value",
                    "{arguments}.0",
                    {filter: "_rev"}
                ]
            }, {
                task: "{storyDataSource}.set",
                args: [{directStoryId: "{that}.options.testOpts.updatedStory.value.id"}, "{that}.options.testOpts.updatedStory"],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "The updated story should be saved",
                    {
                        "ok": true,
                        "id": "{that}.options.testOpts.updatedStory.value.id"
                    },
                    "{arguments}.0",
                    {filter: "rev"}
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "{that}.options.testOpts.updatedStory.value.id"}],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "Retrieved the updated story",
                    "{that}.options.testOpts.updatedStory.value",
                    "{arguments}.0",
                    {filter: "_rev"}
                ]
            }]
        }, {
            name: "Test delete story datasource",
            expect: 4,
            sequence: [{
                // save the revision to use for deleting the story
                task: "{storyDataSource}.get",
                args: [{directStoryId: "publishedStory"}],
                resolve: "fluid.set",
                resolveArgs: [
                    "{that}",
                    "rev",
                    "{arguments}.0._rev"
                ]
            }, {
                task: "{deleteStoryDataSource}.set",
                args: [{
                    directStoryId: "publishedStory",
                    directRevisionId: "invalid_rev"
                }],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error thrown for invalid story rev",
                    "{that}.options.testOpts.storyMissingError",
                    "{arguments}.0",
                    {
                        storyId: "publishedStory",
                        rev: "invalid_rev",
                        method: "DELETE"
                    }
                ]
            }, {
                task: "{deleteStoryDataSource}.set",
                args: [{
                    directStoryId: "invalid_story_id",
                    directRevisionId: "{that}.rev"
                }],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error thrown for invalid story id",
                    "{that}.options.testOpts.storyMissingError",
                    "{arguments}.0",
                    {
                        storyId: "invalid_story_id",
                        rev: "{that}.rev",
                        method: "DELETE"
                    }
                ]
            }, {
                task: "{deleteStoryDataSource}.set",
                args: [{
                    directStoryId: "publishedStory",
                    directRevisionId: "{that}.rev"
                }],
                resolve: "sjrk.storyTelling.server.assertFilteredDeepEq",
                resolveArgs: [
                    "Story should have been removed",
                    {
                        "ok": true,
                        "id": "publishedStory"
                    },
                    "{arguments}.0",
                    {filter: "rev"}
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "publishedStory"}],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error thrown for attempting to access a deleted story",
                    "{that}.options.testOpts.storyMissingError",
                    "{arguments}.0",
                    {storyId: "publishedStory"}
                ]
            }]
        }]
    }]
});

/**
 * A wrapper around `jqUnit.assertDeepEq`, includes construction of the expected error message
 *
 * @param {String} msg - The assertion message
 * @param {Object} expected - The expected error message.
 * @param {Object} actual - The actual error returned
 * @param {Object} [options] - (optional) values to be interpolated into the error message. The key matches the token
 *                             to be replaced with the associated value.
 * @param {String} [options.rev] - (optional) the rev to interpolate into the error message
 */
sjrk.test.storyTelling.server.dataSource.tester.assertMissingError = function (msg, expected, actual, options) {
    var tokens = fluid.extend({}, {method: "GET", storyID: ""}, options || {});
    expected = fluid.copy(expected);
    expected.message = fluid.stringTemplate(expected.message, tokens);

    if (options.rev) {
        expected.message += "?rev=" + options.rev;
    }

    jqUnit.assertDeepEq(msg, expected, actual);
};

fluid.test.runTests([
    "sjrk.test.storyTelling.server.dataSource.testEnvironment"
]);
