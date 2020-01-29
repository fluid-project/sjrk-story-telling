/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testStoryEdit", {
        gradeNames: ["sjrk.storyTelling.base.page.storyEdit"],
        pageSetup: {
            resourcePrefix: "../..",
            authoringEnabled: false
        },
        selectors: {
            mainContainer: "#testMainContainer",
            pageContainer: "#testPageContainer"
        },
        listeners: {
            "onStoryShareRequested.submitStory": {
                funcName: "fluid.identity"
            }
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "../../node_modules/infusion/src/framework/preferences/messages"
                    },
                    "tocMessage": "../../node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json",
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            },
            storyEtiquette: {
                container: "#testStoryEtiquette"
            },
            storyEditor: {
                container: "#testStoryEditor",
                options: {
                    distributeOptions: {
                        notifyTestEvent: {
                            target: "{that blockManager templateManager}.options.listeners",
                            record: {
                                "onTemplateRendered.notifyTestStoryEditor": {
                                    func: "{storyEditor}.events.onNewBlockTemplateRendered.fire",
                                    args: ["{editor}"]
                                }
                            }
                        }
                    },
                    events: {
                        onNewBlockTemplateRendered: null
                    }
                }
            },
            storyPreviewer: {
                container: "#testStoryPreviewer"
            }
        }
    });

    fluid.registerNamespace("sjrk.storyTelling.base.page.storyEditTester");
    sjrk.storyTelling.base.page.storyEditTester.expectedVisibility = {
        prePublish: {
            progressArea: false,
            responseArea: false,
            shareButton: false
        },
        duringPublish: {
            progressArea: true,
            responseArea: false,
            shareButton: true
        },
        postPublish: {
            progressArea: false,
            responseArea: true,
            shareButton: false
        }
    };

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.addBlock", {
        gradeNames: "fluid.test.sequenceElement",
        // blockAddButtonSelector: null, // to be supplied by the implementing test
        sequence: [{
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
        },
        {
            // there is a bug when using an expander here for the jQueryTrigger args
            funcName: "sjrk.storyTelling.base.page.storyEditTester.triggerButtonClick",
            args: ["{storyEdit}.storyEditor", "{that}.options.blockAddButtonSelector"]
        },
        {
            "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
            listener: "fluid.set",
            args: ["{storyEditTester}", "currentBlock", "{arguments}.0"]
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content remains empty after adding block", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        // value: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", "{that}.options.value"]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
            path: "content",
            listener: "jqUnit.assertEquals",
            args: [
                "Story model updated to expected value",
                "{that}.options.value",
                "@expand:sjrk.storyTelling.base.page.storyEditTester.getModelValueFromFieldName({storyEdit}.storyEditor, {that}.options.field)"
            ]
        }]
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.removeValueAndWaitToVerify", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", ""]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
            path: "content",
            listener: "jqUnit.assertDeepEq",
            args: ["Story model empty after removing value", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        // value: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", "{that}.options.value"]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story model remains empty after update", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.clearStoryBlocks", {
        gradeNames: "fluid.test.sequenceElement",
        sequence: [{
            func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
            args: ["{storyEdit}.storyEditor.blockManager"]
        },
        {
            "jQueryTrigger": "click",
            "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
        },
        {
            "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
            listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
            args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
        },
        {
            funcName: "fluid.set",
            args: ["{storyEditTester}", "currentBlock", undefined]
        },
        {
            func: "{storyEdit}.events.onContextChangeRequested.fire"
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty after removing block", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.textBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddTextBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "heading",
                    value: "Rootbeer's text block"
                },
                priority: "after:addBlock"
            },
            removeHeadingAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.removeValueAndWaitToVerify",
                options: {
                    field: "heading"
                },
                priority: "after:changeHeadingAndWaitToVerify"
            },
            changeTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "text",
                    value: "A story about my brother Shyguy"
                },
                priority: "after:removeHeadingAndWaitToVerify"
            },
            removeTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.removeValueAndWaitToVerify",
                options: {
                    field: "text"
                },
                priority: "after:changeTextAndWaitToVerify"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.clearStoryBlocks",
                priority: "after:removeTextAndWaitToVerify"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.imageBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddImageBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's image block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A picture of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cute grey Mackerel Tabby with Bengal spots"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeImageUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "imageUrl",
                    value: "notarealcatphotosadly.jpg"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.audioBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddAudioBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's audio block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A recording of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cat meowing softly"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeMediaUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "mediaUrl",
                    value: "notarealmeowrecordingsadly.wav"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.videoBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddVideoBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's video block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A video of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cat stretching in the sunlight"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeMediaUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "mediaUrl",
                    value: "notarealvideosadly.mp4"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.base.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        members: {
            currentBlock: null // to track dynamic blockUi components
        },
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 18,
                sequence: [{
                    "event": "{storyEditTest storyEdit}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor","storyTitle","Initial test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Editor model updated to expected value", "Initial test title", "{storyEdit}.storyEditor.story.model.title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated to match editor","{storyEdit}.storyEditor.story.model.title","{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor","storyTitle","New test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated","{storyEdit}.storyEditor.story.model.title","{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyEdit}.storyPreviewer.dom.storyTitle", "New test title"]
                }]
            },
            {
                name: "Test saving enabled flag",
                expect: 4,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.assertFromSelector",
                    args: [
                        "{storyEdit}.options.selectors.mainContainer",
                        "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                        ["hidden", true]
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertFromSelector",
                    args: [
                        "{storyEdit}.options.selectors.pageContainer",
                        "sjrk.storyTelling.testUtils.assertElementHasClass",
                        ["{storyEdit}.options.pageSetup.hiddenEditorClass", true]
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{storyEdit}.storyEditor.dom.storyEditorForm", "hidden", true]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                    args: ["{storyEdit}.storyPreviewer.dom.storyShare", "hidden", true]
                }]
            }]
        },
        {
            name: "Test block controls",
            tests: [{
                name: "Test block operations within the page context",
                expect: 17,
                sequence: [{
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onEditorNextRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorNextRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onStorySubmitRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onEditorPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onEditorPreviousRequested event fired."
                },
                // Click to add a text block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit > storyEditor}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New text block template fully rendered (1 of 2)"]
                },
                // Click to add an image block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddImageBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.imageBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New image block template fully rendered"]
                },
                // Add a second text block
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyAddTextBlock"
                },
                {
                    "event": "{storyEdit}.storyEditor.blockManager.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.editor.textBlockEditor"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyEdit}.storyEditor.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New text block template fully rendered (2 of 2)"]
                },
                // Select the checkbox of the first block
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager", true]
                },
                // Click the "remove selected blocks" button
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                // Verify removal
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 2]
                },
                // Remove the other two blocks and verify there are none left
                {
                    func: "sjrk.storyTelling.testUtils.checkBlockCheckboxes",
                    args: ["{storyEdit}.storyEditor.blockManager"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyRemoveSelectedBlocks"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onRemoveBlocksCompleted",
                    listener: "sjrk.storyTelling.testUtils.verifyBlocksRemoved",
                    args: ["{storyEdit}.storyEditor.blockManager", "{arguments}.0", 0]
                }]
            },
            {
                name: "Test isEmptyBlock function",
                expect: 44,
                sequence: [{
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyIsEmptyBlock",
                    args: ["{storyEdit}.options.blockContentValues"]
                }]
            },
            {
                name: "Test block filtering model relay: Text block",
                expect: 8,
                sequenceGrade: "sjrk.storyTelling.base.page.storyEditTester.textBlockModelRelaySequence"
            },
            {
                name: "Test block filtering model relay: Image block",
                expect: 12,
                sequenceGrade: "sjrk.storyTelling.base.page.storyEditTester.imageBlockModelRelaySequence",
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's image block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A picture of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cute grey Mackerel Tabby with Bengal spots", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealcatphotosadly.jpg", "{storyEdit}.storyPreviewer.story.model.content.0.imageUrl"]
                }]
            },
            {
                name: "Test block filtering model relay: Audio block",
                expect: 12,
                sequenceGrade: "sjrk.storyTelling.base.page.storyEditTester.audioBlockModelRelaySequence",
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's audio block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A recording of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cat meowing softly", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealmeowrecordingsadly.wav", "{storyEdit}.storyPreviewer.story.model.content.0.mediaUrl"]
                }]
            },
            {
                name: "Test block filtering model relay: Video block",
                expect: 12,
                sequenceGrade: "sjrk.storyTelling.base.page.storyEditTester.videoBlockModelRelaySequence",
                sequence: [{
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block heading is as expected", "Rootbeer's video block", "{storyEdit}.storyPreviewer.story.model.content.0.heading"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block description is as expected", "A video of my brother Shyguy", "{storyEdit}.storyPreviewer.story.model.content.0.description"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block alternativeText is as expected", "A cat stretching in the sunlight", "{storyEdit}.storyPreviewer.story.model.content.0.alternativeText"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealvideosadly.mp4", "{storyEdit}.storyPreviewer.story.model.content.0.mediaUrl"]
                }]
            }]
        },
        {
            name: "Test progress and server response area",
            tests: [{
                name: "Test progress visibility",
                expect: 10,
                sequence: [{
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates",
                    args: [sjrk.storyTelling.base.page.storyEditTester.expectedVisibility.prePublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyShare"
                },
                {
                    "event": "{storyEdit}.events.onStoryShareRequested",
                    listener: "sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates",
                    args: [sjrk.storyTelling.base.page.storyEditTester.expectedVisibility.duringPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    func: "{storyEdit}.events.onStoryShareComplete.fire",
                    args: ["Story about Shyguy didn't save because Rootbeer got jealous"]
                },
                {
                    "event": "{storyEdit}.events.onStoryShareComplete",
                    listener: "sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates",
                    args: [sjrk.storyTelling.base.page.storyEditTester.expectedVisibility.postPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyResponseText",
                    args: ["{storyEdit}.storyPreviewer.dom.responseArea", "Publishing failed: Story about Shyguy didn't save because Rootbeer got jealous"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.base.page.storyEditTester.triggerButtonClick = function (component, buttonSelector) {
        component.locate(buttonSelector).click();
    };

    sjrk.storyTelling.base.page.storyEditTester.getModelValueFromFieldName = function (component, fieldName) {
        return fluid.get(component, "story.model.content.0." + fieldName);
    };

    sjrk.storyTelling.base.page.storyEditTester.isEmptyBlockTestCases = {
        "blockIsEmptyObject": { expectedEmpty: true, block: {} },
        "blockIsEmptyArray": { expectedEmpty: true, block: [] },
        "blockIsEmptyString": { expectedEmpty: true, block: "" },
        "blockIsTruthyString": { expectedEmpty: true, block: "Not a block" },
        "blockIsNumberZero": { expectedEmpty: true, block: 0 },
        "blockIsTruthyNumber": { expectedEmpty: true, block: 1 },
        "blockIsTrue": { expectedEmpty: true, block: true },
        "blockIsFalse": { expectedEmpty: true, block: false },
        "blockIsEmptyArray_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: [] },
        "blockIsEmptyString_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: "" },
        "blockIsTruthyString_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: "Not a block" },
        "blockIsNumberZero_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: 0 },
        "blockIsTruthyNumber_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: 1 },
        "blockIsTrue_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: true },
        "blockIsFalse_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [], block: false },
        "blockIsEmptyObject_contentValIsNumberZero": { expectedEmpty: true, blockContentValues: 0, block: {} },
        "blockIsEmptyObject_contentValIsTruthyNumber": { expectedEmpty: true, blockContentValues: 1, block: {} },
        "blockIsEmptyObject_contentValIsTrue": { expectedEmpty: true, blockContentValues: true, block: {} },
        "blockIsEmptyObject_contentValIsFalse": { expectedEmpty: true, blockContentValues: false, block: {} },
        "blockIsEmptyObject_contentValIsEmptyString": { expectedEmpty: true, blockContentValues: "", block: {} },
        "blockIsEmptyObject_contentValIsTruthyString": { expectedEmpty: true, blockContentValues: "Useless", block: {} },
        "blockIsTextBlockTextOnly_contentValIsEmptyArray": { expectedEmpty: true, blockContentValues: [],
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsEmptyObject": { expectedEmpty: true, blockContentValues: {},
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsNumberZero": { expectedEmpty: true, blockContentValues: 0,
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsTruthyNumber": { expectedEmpty: true, blockContentValues: 1,
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockNoContent": { expectedEmpty: true,
            block: {
                blockType: "text"
            }
        },
        "blockIsTextBlockEmptyContent": { expectedEmpty: true,
            block: {
                blockType: "text",
                heading: "",
                text: ""
            }
        },
        "blockIsTextBlockTextOnly": { expectedEmpty: false,
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockHeadingOnly": { expectedEmpty: false,
            block: {
                blockType: "text",
                heading: "An actual heading",
                text: ""
            }
        },
        "blockIsImageBlockEmptyContent": { expectedEmpty: true,
            block: {
                blockType: "image",
                heading: "",
                alternativeText: "",
                description: "",
                imageUrl: ""
            }
        },
        "blockIsImageBlockHeadingOnly": { expectedEmpty: true,
            block: {
                blockType: "image",
                heading: "An actual heading",
                alternativeText: "",
                description: "",
                imageUrl: ""
            }
        },
        "blockIsImageBlockAltTextOnly": { expectedEmpty: true,
            block: {
                blockType: "image",
                heading: "",
                alternativeText: "Some alternative text",
                description: "",
                imageUrl: ""
            }
        },
        "blockIsImageBlockDescriptionOnly": { expectedEmpty: true,
            block: {
                blockType: "image",
                heading: "",
                alternativeText: "",
                description: "A real description",
                imageUrl: ""
            }
        },
        "blockIsImageBlockImageUrlOnly": { expectedEmpty: false,
            block: {
                blockType: "image",
                heading: "",
                alternativeText: "",
                description: "",
                imageUrl: "Not really a URL"
            }
        },
        "blockIsAudioBlockEmptyContent": { expectedEmpty: true,
            block: {
                blockType: "audio",
                heading: "",
                alternativeText: "",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsAudioBlockHeadingOnly": { expectedEmpty: true,
            block: {
                blockType: "audio",
                heading: "An actual heading",
                alternativeText: "",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsAudioBlockAltTextOnly": { expectedEmpty: true,
            block: {
                blockType: "audio",
                heading: "",
                alternativeText: "Some alternative text",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsAudioBlockDescriptionOnly": { expectedEmpty: true,
            block: {
                blockType: "audio",
                heading: "",
                alternativeText: "",
                description: "A real description",
                mediaUrl: ""
            }
        },
        "blockIsAudioBlockMediaUrlOnly": { expectedEmpty: false,
            block: {
                blockType: "audio",
                heading: "",
                alternativeText: "",
                description: "",
                mediaUrl: "Not really a URL"
            }
        },
        "blockIsVideoBlockEmptyContent": { expectedEmpty: true,
            block: {
                blockType: "video",
                heading: "",
                alternativeText: "",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsVideoBlockHeadingOnly": { expectedEmpty: true,
            block: {
                blockType: "video",
                heading: "An actual heading",
                alternativeText: "",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsVideoBlockAltTextOnly": { expectedEmpty: true,
            block: {
                blockType: "video",
                heading: "",
                alternativeText: "Some alternative text",
                description: "",
                mediaUrl: ""
            }
        },
        "blockIsVideoBlockDescriptionOnly": { expectedEmpty: true,
            block: {
                blockType: "video",
                heading: "",
                alternativeText: "",
                description: "A real description",
                mediaUrl: ""
            }
        },
        "blockIsVideoBlockMediaUrlOnly": { expectedEmpty: false,
            block: {
                blockType: "video",
                heading: "",
                alternativeText: "",
                description: "",
                mediaUrl: "Not really a URL"
            }
        }
    };

    sjrk.storyTelling.base.page.storyEditTester.verifyIsEmptyBlock = function (defaultBlockContentValues) {
        fluid.each(sjrk.storyTelling.base.page.storyEditTester.isEmptyBlockTestCases, function (testCase, index) {
            var blockContentValuesToTest = fluid.isValue(testCase.blockContentValues) ? testCase.blockContentValues : defaultBlockContentValues;

            var actuallyEmpty = sjrk.storyTelling.base.page.storyEdit.isEmptyBlock(testCase.block, blockContentValuesToTest[testCase.block.blockType]);
            jqUnit.assertEquals("Block emptiness state for test case " + index + " is as expected", testCase.expectedEmpty, actuallyEmpty);
        });
    };

    sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates = function (expectedStates, progressArea, responseArea, shareButton) {
        sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility(progressArea, expectedStates.progressArea);
        sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility(responseArea, expectedStates.responseArea);
        sjrk.storyTelling.base.page.storyEditTester.verifyElementDisabled(shareButton, expectedStates.shareButton);
    };

    sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility = function (el, isExpectedVisible) {
        var isActuallyVisible = el.is(":visible");
        jqUnit.assertEquals("The element's visibility is as expected", isExpectedVisible, isActuallyVisible);
    };

    sjrk.storyTelling.base.page.storyEditTester.verifyElementDisabled = function (el, isExpectedDisabled) {
        var isActuallyDisabled = el.prop("disabled");
        jqUnit.assertEquals("The element's 'disabled' value is as expected", isExpectedDisabled, isActuallyDisabled);
    };

    sjrk.storyTelling.base.page.storyEditTester.verifyResponseText = function (responseArea, expectedText) {
        var actualText = responseArea.text().trim();
        jqUnit.assertEquals("The response text is as expected", expectedText, actualText);
    };

    fluid.defaults("sjrk.storyTelling.base.page.storyEditTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEdit: {
                type: "sjrk.storyTelling.base.page.testStoryEdit",
                container: "#testStoryEdit",
                createOnEvent: "{storyEditTester}.events.onTestCaseStart"
            },
            storyEditTester: {
                type: "sjrk.storyTelling.base.page.storyEditTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.storyEditTest"
        ]);
    });

})(jQuery, fluid);
