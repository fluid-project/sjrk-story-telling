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
require("../../src/server/db/authors-dbConfiguration");
require("../../src/server/db/story-dbConfiguration");
require("fluid-pouchdb");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.test.storyTelling.server.dataSource");

// NOTE: These mock documents may not include all properties that are included in the real documents. Only those
// required for testing are guaranteed to be present.
sjrk.test.storyTelling.server.dataSource.mockRecords = {
    authors: {
        "author1": {
            "type": "user",
            "email": "test@example.com",
            "authorID": "author1",
            "username": "test@example.com"
        },
        "author2": {
            "type": "user",
            "email": "test2@example.com",
            "authorID": "author2",
            "username": "test2@example.com"
        }
    },
    stories: {
        "story1": {
            "type": "story",
            "authorID": "author1",
            "value": {
                "published": true,
                "id": "story1",
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
        "story2": {
            "type": "story",
            "authorID": "author2",
            "value": {
                "published": true,
                "id": "story2",
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
        "story3": {
            "type": "story",
            "authorID": "author1",
            "value": {
                "published": false,
                "id": "story3",
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
    }
};

sjrk.test.storyTelling.server.dataSource.mockRecords.tagsResponse = {
    "total_rows": 8,
    "offset": 0,
    "rows": [{
        "key": "Example",
        "id": "story1",
        "value": "Sample Story 1"
    }, {
        "key": "Example",
        "id": "story2",
        "value": "Sample Story 2"
    }, {
        "key": "Example",
        "id": "story3",
        "value": "Sample Story 3"
    }, {
        "key": "Example",
        "id": "storyExample",
        "value": "The Story Builder how-to"
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
        "id": "story2",
        "value": "Sample Story 2"
    }, {
        "key": "Test",
        "id": "story1",
        "value": "Sample Story 1"
    }]
};

// options: ids, path, filter, filterExclude
sjrk.test.storyTelling.server.dataSource.recordsToStoryViewResponse = function (records) {
    var filter = ["title", "author", "tags", "content"];

    var response = {
        offset: 0,
        rows: []
    };

    fluid.each(records, function (record, id) {
        var story = fluid.copy(record.value);

        if (story.published) {
            story = fluid.filterKeys(story, filter);

            response.rows.push({
                "key": id,
                "id": id,
                "value": story
            });
        }
    });
    response.total_rows = response.rows.length;

    return response;
};

// a database for file and database tests
fluid.defaults("sjrk.test.storyTelling.server.dataSource.testDB", {
    gradeNames: ["fluid.component"],
    events: {
        authorsDBReady: null,
        storiesDBReady: null,
        onReady: {
            events: {
                authorsDBReady: "authorsDBReady",
                storiesDBReady: "storiesDBReady"
            }
        }
    },
    components: {
        pouchHarness: {
            type: "fluid.pouch.harness",
            options: {
                port: 6789
            }
        },
        authorsDBConfig: {
            type: "sjrk.storyTelling.server.authorsDb",
            createOnEvent: "{pouchHarness}.events.onReady",
            options: {
                listeners: {
                    "onCreate.configureCouch": "{that}.configureCouch",
                    "onSuccess.escalate": "{testDB}.events.authorsDBReady"
                },
                couchOptions: {
                    couchUrl: "http://localhost:6789"
                },
                dbDocuments: sjrk.test.storyTelling.server.dataSource.mockRecords.authors
            }
        },
        storiesDBConfig: {
            type: "sjrk.storyTelling.server.storiesDb",
            createOnEvent: "{pouchHarness}.events.onReady",
            options: {
                listeners: {
                    "onCreate.configureCouch": "{that}.configureCouch",
                    "onSuccess.escalate": "{testDB}.events.storiesDBReady"
                },
                couchOptions: {
                    couchUrl: "http://localhost:6789"
                },
                dbDocuments: sjrk.test.storyTelling.server.dataSource.mockRecords.stories
            }
        }
    }
});

// Test environment - no id provided
fluid.defaults("sjrk.test.storyTelling.server.dataSource.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testDB: {
            type: "sjrk.test.storyTelling.server.dataSource.testDB",
            createOnEvent: "{datasourceTester}.events.onTestCaseStart"
        },
        // a DataSource to get a list of stories
        viewDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.view",
            options: {
                host: "http://localhost:6789"
            }
        },
        // a DataSource to get a stories by author
        storyByAuthorDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.authorStoriesView",
            options: {
                host: "http://localhost:6789"
            }
        },
        // a DataSource to get or save a single story
        storyDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.story",
            options: {
                host: "http://localhost:6789"
            }
        },
        // a DataSource to delete a single story
        deleteStoryDataSource: {
            type: "sjrk.storyTelling.server.dataSource.couch.deleteStory",
            options: {
                host: "http://localhost:6789"
            }
        },
        datasourceTester: {
            type: "sjrk.test.storyTelling.server.dataSource.tester"
        }
    }
});

// Main test sequences for the Edit page
fluid.defaults("sjrk.test.storyTelling.server.dataSource.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    members: {
        rev: null
    },
    testOpts: {
        storiesViewError: {
            "reason": "ddoc _design/stories has no view named notAView",
            "message": "not_found while executing HTTP GET on url http://http://localhost:6789/stories/_design/stories/_view/notAView?limit=500&reduce=false&skip=0",
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
                    storyId: "story1"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author1, story1",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.stories.story1.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author2",
                    storyId: "story2"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author2, story2",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.stories.story2.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "author1",
                    storyId: "story3"
                }],
                resolve: "jqUnit.assertDeepEq",
                resolveArgs: [
                    "The correct story was returned: author1, story3",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.stories.story3.value,
                    "{arguments}.0.rows.0.value"
                ]
            }, {
                task: "{storyByAuthorDataSource}.get",
                args: [{
                    authorID: "noAuthor",
                    storyId: "story3"
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
                args: [{directStoryId: "story1"}],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "Retrieved the published story",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.stories.story1.value,
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "story3"}],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "Retrieved the unpublished story",
                    sjrk.test.storyTelling.server.dataSource.mockRecords.stories.story3.value,
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "invalidStoryID"}],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error returned for invalid story id",
                    "{arguments}.0",
                    {storyId: "invalidStoryID"}
                ]
            }, {
                task: "{storyDataSource}.set",
                args: [{directStoryId: "{that}.options.testOpts.newStory.value.id"}, "{that}.options.testOpts.newStory"],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "The new story should be saved",
                    {
                        "ok": true,
                        "id": "{that}.options.testOpts.newStory.value.id"
                    },
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "{that}.options.testOpts.newStory.value.id"}],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "Retrieved the new story",
                    "{that}.options.testOpts.newStory.value",
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.set",
                args: [{directStoryId: "{that}.options.testOpts.updatedStory.value.id"}, "{that}.options.testOpts.updatedStory"],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "The updated story should be saved",
                    {
                        "ok": true,
                        "id": "{that}.options.testOpts.updatedStory.value.id"
                    },
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "{that}.options.testOpts.updatedStory.value.id"}],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "Retrieved the updated story",
                    "{that}.options.testOpts.updatedStory.value",
                    "{arguments}.0"
                ]
            }]
        }, {
            name: "Test delete story datasource",
            expect: 4,
            sequence: [{
                // save the revision to use for deleting the story
                task: "{storyDataSource}.get",
                args: [{directStoryId: "story1"}],
                resolve: "fluid.set",
                resolveArgs: [
                    "{that}",
                    "rev",
                    "{arguments}.0._rev"
                ]
            }, {
                task: "{deleteStoryDataSource}.set",
                args: [{
                    directStoryId: "story1",
                    directRevisionId: "invalid_rev"
                }],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error thrown for invalid story rev",
                    "{arguments}.0",
                    {
                        storyId: "story1",
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
                    directStoryId: "story1",
                    directRevisionId: "{that}.rev"
                }],
                resolve: "sjrk.test.storyTelling.server.dataSource.tester.assertResponse",
                resolveArgs: [
                    "Story should have been removed",
                    {
                        "ok": true,
                        "id": "story1"
                    },
                    "{arguments}.0"
                ]
            }, {
                task: "{storyDataSource}.get",
                args: [{directStoryId: "story1"}],
                reject: "sjrk.test.storyTelling.server.dataSource.tester.assertMissingError",
                rejectArgs: [
                    "Error thrown for attempting to access a deleted story",
                    "{arguments}.0",
                    {storyId: "story1"}
                ]
            }]
        }]
    }]
});

/**
 * A wrapper around `jqUnit.assertDeepEq` except it strips `_rev` out of the actual response as this is generated value.
 * The remaining properties are compared with `jqUnit.assertDeepEq`.
 *
 * @param {String} msg - The assertion message
 * @param {Object} expected - The expected value to compare against the `actual` value.
 * @param {Object} actual - The actual value, minus `_rev` property, compared against the `expected` value.
 */
sjrk.test.storyTelling.server.dataSource.tester.assertResponse = function (msg, expected, actual) {
    actual = fluid.filterKeys(actual, "_rev", true);
    jqUnit.assertDeepEq(msg, expected, actual);
};

/**
 * A wrapper around `jqUnit.assertDeepEq`, includes construction of the expected error message
 *
 * @param {String} msg - The assertion message
 * @param {Object} actual - The actual error returned
 * @param {Object} [options] - (optional) values to be interpolated into the error message
 * @param {String} [options.method] - (optional) the HTTP method to interpolate into error message; default "GET"
 * @param {String} [options.storyId] - (optional) the storyId to interpolate into the error message; default ""
 * @param {String} [options.rev] - (optional) the rev to interpolate into the error message
 */
sjrk.test.storyTelling.server.dataSource.tester.assertMissingError = function (msg, actual, options) {
    var tokens = fluid.merge("replace", {}, {method: "GET", storyID: ""}, options || {});
    var expected = {
        "reason": "missing",
        "message": fluid.stringTemplate("not_found while executing HTTP %method on url http://http://localhost:6789/stories/%storyId", tokens),
        "isError": true,
        "statusCode": 404
    };

    if (options.rev) {
        expected.message += "?rev=" + options.rev;
    }

    jqUnit.assertDeepEq(msg, expected, actual);
};

fluid.test.runTests([
    "sjrk.test.storyTelling.server.dataSource.testEnvironment"
]);
