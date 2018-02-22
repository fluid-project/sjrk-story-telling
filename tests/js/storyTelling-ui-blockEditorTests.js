/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.ui.testBlockEditor", {
        gradeNames: ["sjrk.storyTelling.ui.blockEditor"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        resourcePrefix: "../.."
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.ui.blockEditorTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Block Editor UI.",
            tests: [{
                name: "Test UI controls",
                expect: 5,
                sequence: [{
                    "event": "{blockEditorTest blockEditor}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["Block editor's onControlsBound event fired"]
                },{
                    func: "fluid.identity"
                },
                // TODO: waiting for this seems necessary because the block manager isn't fully created by the time onControlsBound fires; this should be fixed
                {
                    "event": "{blockEditor blockManager}.events.onCreate",
                    listener: "jqUnit.assert",
                    args: ["Block manager ready"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{blockEditor}.dom.storyAddTextBlock"
                }, {
                    "event": "{blockEditor}.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.ui.blockEditorTester.verifyBlockAdded",
                    args: ["{blockEditor}.blockManager", "{arguments}.0", "sjrk.storyTelling.block.textBlock"]
                }]
            }]
            // TODO: add tests for each field's bindings, see text block tests
        }]
    });


    sjrk.storyTelling.ui.blockEditorTester.verifyBlockAdded = function (blockManager, blockKey, expectedGrade) {

        var blockComponent = blockManager.managedViewComponentRegistry[blockKey];

        // Verify the block is added to the manager's registry
        jqUnit.assertNotNull("New block added to manager's registry", blockComponent);

        // Verify the block's type is correct
        jqUnit.assertEquals("Block's dynamicComponent type is expected " + expectedGrade, expectedGrade,  blockComponent.options.managedViewComponentRequiredConfig.type);

        // Verify the block is added to the DOM
        var newBlock = blockManager.container.find("." + blockKey);
        jqUnit.assertTrue("New block added to DOM", newBlock.length > 0);
    };

    fluid.defaults("sjrk.storyTelling.ui.blockEditorTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            blockEditor: {
                type: "sjrk.storyTelling.ui.testBlockEditor",
                container: "#testBlockEditor",
                createOnEvent: "{blockEditorTester}.events.onTestCaseStart"
            },
            blockEditorTester: {
                type: "sjrk.storyTelling.ui.blockEditorTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.blockEditorTest"
        ]);
    });

})(jQuery, fluid);
