/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the UI grade
    fluid.defaults("sjrk.storyTelling.ui.testStoryUi", {
        gradeNames: ["sjrk.storyTelling.ui.storyUi"],
        components: {
            story: {
                options: {
                    model: {
                        title: "cat story",
                        author: "Shyguy & Rootbeer",
                        content: [], // no content to begin with
                        tags: []
                    }
                }
            },
            blockManager: {
                options: {
                    blockTypeLookup: {
                        "text": "sjrk.storyTelling.blockUi.textBlockViewer"
                    }
                }
            },
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyViewer.handlebars",
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.ui.testStoryUi.testStoryInitial = {
        title: "cat story",
        author: "Shyguy & Rootbeer",
        content: [],
        tags: []
    };

    sjrk.storyTelling.ui.testStoryUi.testStoryPopulated = {
        author: "Shyguy & Rootbeer",
        content: [
            {
                blockType: "text",
                heading: "cat",
                text: "orange fur",
                order: 0
            },
            {
                blockType: "text",
                heading: "cat",
                text: "spotted fur",
                order: 1
            },
            {
                blockType: "text",
                heading: "otherCat",
                text: "no fur",
                order: 2
            }
        ],
        tags: [],
        title: "cat story"
    };

    sjrk.storyTelling.ui.testStoryUi.testStoryAfterChange = {
        author: "Shyguy & Rootbeer",
        content: [
            {
                blockType: "text",
                firstInOrder: true,
                heading: "A new cat",
                id: null,
                language: null,
                lastInOrder: true,
                order: 0,
                text: "orange fur"
            },
            {
                blockType: "text",
                firstInOrder: true,
                heading: "cat",
                id: null,
                language: null,
                lastInOrder: true,
                order: 1,
                text: "spotted fur"
            },
            {
                blockType: "text",
                firstInOrder: true,
                heading: "otherCat",
                id: null,
                language: null,
                lastInOrder: true,
                order: 2,
                text: "no fur"
            }
        ],
        tags: [],
        title: "cat story"
    };

    // Test cases and sequences for the UI grade
    fluid.defaults("sjrk.storyTelling.ui.storyUiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story UI.",
            tests: [{
                name: "Test createBlocksFromData function",
                expect: 7,
                sequence: [{
                    event: "{storyUiTest storyUi}.events.onStoryUiReady",
                    listener: "jqUnit.assertDeepEq",
                    args: ["StoryUi is ready, initial story is as expected", sjrk.storyTelling.ui.testStoryUi.testStoryInitial, "{storyUi}.story.model"]
                },
                {
                    funcName: "sjrk.storyTelling.ui.storyUi.createBlocksFromData",
                    args: [sjrk.storyTelling.ui.testStoryUi.testStoryPopulated.content, "{storyUi}.blockManager.options.blockTypeLookup", "{storyUi}.blockManager.events.viewComponentContainerRequested"]
                },
                {
                    event: "{storyUi}.blockManager.events.viewComponentContainerRequested",
                    listener: "sjrk.storyTelling.ui.storyUiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "sjrk.storyTelling.blockUi.textBlockViewer", {blockType: "text", heading: "cat", text: "orange fur", order: 0}]
                },
                {
                    event: "{storyUi}.blockManager.events.viewComponentContainerRequested",
                    listener: "sjrk.storyTelling.ui.storyUiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "sjrk.storyTelling.blockUi.textBlockViewer", {blockType: "text", heading: "cat", text: "spotted fur", order: 1}]
                },
                {
                    event: "{storyUi}.blockManager.events.viewComponentContainerRequested",
                    listener: "sjrk.storyTelling.ui.storyUiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "sjrk.storyTelling.blockUi.textBlockViewer", {blockType: "text", heading: "otherCat", text: "no fur", order: 2}]
                }]
            },
            {
                name: "Test block model listener",
                expect: 3,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model is as expected before model change is triggered", sjrk.storyTelling.ui.testStoryUi.testStoryInitial, "{storyUi}.story.model"]
                },
                {
                    // Trigger a block model change without a source specified
                    func: "sjrk.storyTelling.ui.storyUiTester.changeFirstBlockModel",
                    args: ["{storyUi}.blockManager", "heading", "A new cat", null]
                },
                {
                    // verify that the first block did change
                    funcName: "sjrk.storyTelling.ui.storyUiTester.verifyFirstBlockModel",
                    args: ["{storyUi}.blockManager", {
                        blockType: "text",
                        firstInOrder: true,
                        heading: "A new cat",
                        id: null,
                        language: null,
                        lastInOrder: true,
                        order: 0,
                        text: "orange fur"
                    }]
                },
                {
                    // verify that the story did change
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story model has changed after block change with no source", sjrk.storyTelling.ui.testStoryUi.testStoryAfterChange, "{storyUi}.story.model"]
                }]
            }]
        }]
    });

    /**
     * Changes the model of the first block in the story specifying the change source
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {String} path - the path to change
     * @param {Object} newValue - the value to change it to
     * @param {String} changeSource - the source of the change
     */
    sjrk.storyTelling.ui.storyUiTester.changeFirstBlockModel = function (blockManager, path, newValue, changeSource) {
        var firstBlock = sjrk.storyTelling.testUtils.getBlockByIndex(blockManager, 0);
        firstBlock.applier.change(path, newValue, null, changeSource);
    };

    /**
     * Verifies that the first block's model is as expected
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {Object} expectedBlockModel - the expected model of the first block
     */
    sjrk.storyTelling.ui.storyUiTester.verifyFirstBlockModel = function (blockManager, expectedBlockModel) {
        var firstBlock = sjrk.storyTelling.testUtils.getBlockByIndex(blockManager, 0);
        jqUnit.assertDeepEq("The first block's model is as expected", expectedBlockModel, firstBlock.model);
    };

    /**
     * Verifies that a block has been created as expected
     *
     * @param {Array} gradeNames - the actual gradeNames of the created block
     * @param {Object} blockData - the model data of the given block
     * @param {Array} expectedGradeNames - the expected grade names
     * @param {Object} expectedModelValues - the expected model values
     */
    sjrk.storyTelling.ui.storyUiTester.verifyBlocksCreated = function (gradeNames, blockData, expectedGradeNames, expectedModelValues) {
        jqUnit.assertEquals("The grade names are as expected", expectedGradeNames, gradeNames);
        jqUnit.assertDeepEq("The model values are as expected", expectedModelValues, blockData.modelValues);
    };

    // Test environment
    fluid.defaults("sjrk.storyTelling.storyUiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyUi: {
                type: "sjrk.storyTelling.ui.testStoryUi",
                container: "#testStoryUi",
                createOnEvent: "{storyUiTester}.events.onTestCaseStart"
            },
            storyUiTester: {
                type: "sjrk.storyTelling.ui.storyUiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.storyUiTest"
        ]);
    });

})(jQuery, fluid);
