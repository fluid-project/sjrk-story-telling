/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

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
                        templatePath: "%resourcePrefix/src/templates/storyViewer.handlebars",
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
                expect: 0,
                sequence: [{
                    funcName: "sjrk.storyTelling.ui.createBlocksFromData",
                    args: ["{ui}.options.storyBlocks", "{ui}.options.blockTypeLookup", "{ui}.events.blockCreateEvent"]
                }]
            }]
        }]
    });

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
