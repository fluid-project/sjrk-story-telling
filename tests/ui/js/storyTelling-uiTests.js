/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.testUi", {
        gradeNames: ["sjrk.storyTelling.ui"],
        events: {
            blockCreateEvent: null
        },
        blockTypeLookup: {
            "cat": "cat.grade.name",
            "otherCat": "cat.other.grade.name"
        },
        storyBlocks: [
            {
                blockType: "cat",
                fur: "orange"
            },
            {
                blockType: "cat",
                fur: "spotted"
            },
            {
                blockType: "otherCat",
                fur: "none"
            }
        ],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyViewer.handlebars",
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.uiTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story UI.",
            tests: [{
                name: "Test createBlocksFromData function",
                expect: 6,
                sequence: [{
                    funcName: "sjrk.storyTelling.ui.createBlocksFromData",
                    args: ["{ui}.options.storyBlocks", "{ui}.options.blockTypeLookup", "{ui}.events.blockCreateEvent"]
                },
                {
                    event: "{ui}.events.blockCreateEvent",
                    listener: "sjrk.storyTelling.uiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "cat.grade.name", {blockType: "cat", fur: "orange"}]
                },
                {
                    event: "{ui}.events.blockCreateEvent",
                    listener: "sjrk.storyTelling.uiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "cat.grade.name", {blockType: "cat", fur: "spotted"}]
                },
                {
                    event: "{ui}.events.blockCreateEvent",
                    listener: "sjrk.storyTelling.uiTester.verifyBlocksCreated",
                    args: ["{arguments}.0", "{arguments}.1", "cat.other.grade.name", {blockType: "otherCat", fur: "none"}]
                }]
            }]
        }]
    });

    sjrk.storyTelling.uiTester.verifyBlocksCreated = function (gradeNames, blockData, expectedGradeNames, expectedModelValues) {
        jqUnit.assertEquals("The grade names are as expected", expectedGradeNames, gradeNames);
        jqUnit.assertDeepEq("The model values are as expected", expectedModelValues, blockData.modelValues);
    };

    fluid.defaults("sjrk.storyTelling.uiTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            ui: {
                type: "sjrk.storyTelling.testUi",
                container: "#testUi",
                createOnEvent: "{uiTester}.events.onTestCaseStart"
            },
            uiTester: {
                type: "sjrk.storyTelling.uiTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.uiTest"
        ]);
    });

})(jQuery, fluid);
