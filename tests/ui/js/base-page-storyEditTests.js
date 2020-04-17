/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the Edit page, adds an event for test purposes
    // authoring is disabled in this component, regardless of the server setting
    fluid.defaults("sjrk.storyTelling.base.page.testStoryEdit", {
        gradeNames: ["sjrk.storyTelling.base.page.storyEdit"],
        pageSetup: {
            resourcePrefix: "../..",
            authoringEnabled: false,
            storyAutosaveKey: "testStoryAutosave"
        },
        selectors: {
            mainContainer: "#testMainContainer",
            pageContainer: "#testPageContainer"
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

    // The expected visibility states of parts of the previewer in these cases
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

    // The expected model values of the page's historian component for each step
    sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates = {
        editStoryStep: {
            editStoryStepVisible: true,
            editorVisible: true
        },
        metadataStep: {
            editStoryStepVisible: false,
            editorVisible: true
        },
        previewerStep: {
            editStoryStepVisible: false,
            editorVisible: false
        }
    };

    // A test story before it is saved
    sjrk.storyTelling.base.page.storyEditTester.testStoryPreSave = {
        "title": "A story about the cutest cats in the world",
        "content": [
            {
                "blockType": "image",
                "imageUrl": "Rootbeer and Shyguy.jpeg",
                "description": "Two cats, maybe even the cutest",
                "altText": "Two brown/grey Mackerel Tabbies with Bengal spots",
                "fileDetails": {
                    "name": "Rootbeer and Shyguy.jpeg",
                    "size": 1,
                    "type": "image/jpeg"
                }
            },
            {
                "blockType": "video",
                "imageUrl": "Feeding Time.mp4",
                "description": "A video of two cats eagerly awaiting delicious food",
                "fileDetails": {
                    "name": "Feeding Time.mp4",
                    "size": 2,
                    "type": "video/mp4"
                }
            }
        ],
        "tags": ["cute", "cats"],
        "author": "RB & SG"
    };

    // A test story after it is loaded
    sjrk.storyTelling.base.page.storyEditTester.testStoryPostLoad = {
        "title": "A story about the cutest cats in the world",
        "content": [
            {
                "blockType": "image",
                "imageUrl": null,
                "description": "Two cats, maybe even the cutest",
                "altText": "Two brown/grey Mackerel Tabbies with Bengal spots",
                "fileDetails": {
                    "name": "Rootbeer and Shyguy.jpeg",
                    "size": 1,
                    "type": "image/jpeg"
                }
            },
            {
                "blockType": "video",
                "imageUrl": null,
                "description": "A video of two cats eagerly awaiting delicious food",
                "fileDetails": {
                    "name": "Feeding Time.mp4",
                    "size": 2,
                    "type": "video/mp4"
                }
            }
        ],
        "tags": ["cute", "cats"],
        "author": "RB & SG"
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

    // Test sequence element for changing a value in a block and waiting for a model change
    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.changeValueAndWaitToVerify", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        // value: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", "{that}.options.value"]
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

    // Test sequence element for removing a value in a block and waiting for a model change
    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.removeValueAndWaitToVerify", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", ""]
        },
        {
            changeEvent: "{storyEdit}.storyPreviewer.story.applier.modelChanged",
            path: "content",
            listener: "jqUnit.assertDeepEq",
            args: ["Story model empty after removing value", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    // Test sequence element for changing a value in a block and confirming no changes to the story model
    fluid.defaults("sjrk.storyTelling.base.page.storyEditTester.changeBlockAndConfirmNoChange", {
        gradeNames: "fluid.test.sequenceElement",
        // field: null, // to be supplied by the implementing test
        // value: null, // to be supplied by the implementing test
        sequence: [{
            func: "{storyEditTester}.currentBlock.block.applier.change",
            args: ["{that}.options.field", "{that}.options.value"]
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story model remains empty after update", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    // Test sequence element for removing all blocks in the story
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
            args: ["{storyEdit}.storyEditor.blockManager", 0]
        },
        {
            funcName: "fluid.set",
            args: ["{storyEditTester}", "currentBlock", undefined]
        },
        {
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty after removing block", [], "{storyEdit}.storyPreviewer.story.model.content"]
        }]
    });

    // Test sequence for adding and testing a text block
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

    // Test sequence for adding and testing an image block
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

    // Test sequence for adding and testing an audio block
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

    // Test sequence for adding and testing a video block
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

    // Main test sequences for the Edit page
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
                    jQueryTrigger: "click",
                    element: "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.applier.modelChanged",
                    path: "editStoryStepVisible",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor", "storyTitle", "Initial test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Editor model updated to expected value", "Initial test title", "{storyEdit}.storyEditor.story.model.title"]
                },
                {
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated to match editor", "{storyEdit}.storyEditor.story.model.title", "{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    changeEvent: "{storyEdit}.applier.modelChanged",
                    path: "editorVisible",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    jQueryTrigger: "click",
                    element: "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    changeEvent: "{storyEdit}.applier.modelChanged",
                    path: "editorVisible",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor", "storyTitle", "New test title"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    func: "jqUnit.assertEquals",
                    args: ["Previewer model updated", "{storyEdit}.storyEditor.story.model.title", "{storyEdit}.storyPreviewer.story.model.title"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    changeEvent: "{storyEdit}.applier.modelChanged",
                    path: "editorVisible",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyEdit}.storyPreviewer.dom.storyTitle", "New test title"]
                },
                // reset the title for subsequent tests
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor", "storyTitle", ""]
                }]
            },
            {
                name: "Test saving enabled flag",
                expect: 3,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.assertFromSelector",
                    args: [
                        "{storyEdit}.options.selectors.pageContainer",
                        "sjrk.storyTelling.testUtils.assertElementPropertyValue",
                        ["hidden", true]
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
                expect: 16,
                sequence: [{
                    // set the currently-visible part of the page back to the block editor
                    jQueryTrigger: "click",
                    element: "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assert",
                    args: "onContextChangeRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assert",
                    args: "onContextChangeRequested event fired."
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
                    args: ["{storyEdit}.storyEditor.blockManager", 2]
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
                    args: ["{storyEdit}.storyEditor.blockManager", 0]
                }]
            },
            {
                name: "Test isEmptyBlock function",
                expect: 44,
                sequence: [{
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyIsEmptyBlock",
                    args: ["{storyEdit}.options.blockFields"]
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
                expect: 21,
                sequence: [{
                    // set the currently-visible part of the page to the previewer
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates",
                    args: [sjrk.storyTelling.base.page.storyEditTester.expectedVisibility.prePublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: ["/stories/", "", "application/json"]
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
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
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
                },
                // reset the visibility to the edit story step
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "sjrk.storyTelling.testUtils.verifyStepVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyMetadataStep", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditStoryStep"]
                    ]
                }]
            }]
        },
        {
            name: "Test story autosave functionality",
            tests: [{
                name: "Test autosave wiring",
                expect: 9,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Story is empty to begin with", {
                        author: "",
                        title: "",
                        content: [],
                        tags: []
                    }, "{storyEdit}.storyEditor.story.model"]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEdit.clearAutosave",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey"]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", null]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor", "storyTitle", "Rootbeer is testing autosave"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", {
                        author: "",
                        title: "Rootbeer is testing autosave",
                        content: [],
                        tags: []
                    }]
                },
                {
                    func: "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{storyEdit}.storyEditor", "storyAuthor", "Rootbeer"]
                },
                {
                    changeEvent: "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "author",
                    listener: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", {
                        author: "Rootbeer",
                        title: "Rootbeer is testing autosave",
                        content: [],
                        tags: []
                    }]
                },
                // publish the story (using a mocked response)
                {
                    funcName: "sjrk.storyTelling.testUtils.setupMockServer",
                    args: ["/stories/", "", "application/json"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyShare"
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.teardownMockServer"
                },
                // ensures the story was deleted upon successful publishing
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", null]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEdit.saveStoryToAutosave",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", sjrk.storyTelling.base.page.storyEditTester.testStoryPreSave]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", sjrk.storyTelling.base.page.storyEditTester.testStoryPreSave]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEdit.loadStoryFromAutosave",
                    args: [
                        "{storyEdit}.options.pageSetup.storyAutosaveKey",
                        "{storyEdit}.storyEditor",
                        "",
                        "{storyEdit}.options.pageSetup.storyAutoloadSourceName"
                    ]
                },
                {
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Editor story is as expected after loading", sjrk.storyTelling.base.page.storyEditTester.testStoryPostLoad, "{storyEdit}.storyEditor.story.model"]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.clearMediaBlockUrlsTest",
                    args: [
                        sjrk.storyTelling.base.page.storyEditTester.testStoryPreSave.content,
                        sjrk.storyTelling.base.page.storyEditTester.testStoryPostLoad.content
                    ]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEdit.clearAutosave",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey"]
                },
                {
                    funcName: "sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState",
                    args: ["{storyEdit}.options.pageSetup.storyAutosaveKey", null]
                }]
            }]
        },
        {
            name: "Test page history state management",
            tests: [{
                name: "Test historian component model state",
                expect: 5,
                sequence: [{
                    funcName: "jqUnit.assertDeepEq",
                    args: ["Historian model is as expected", sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates.editStoryStep, "{storyEdit}.historian.model"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Historian model is as expected", sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates.metadataStep, "{storyEdit}.historian.model"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storySubmit"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Historian model is as expected", sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates.previewerStep, "{storyEdit}.historian.model"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Historian model is as expected", sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates.metadataStep, "{storyEdit}.historian.model"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorPrevious"
                },
                {
                    "event": "{storyEdit}.events.onContextChangeRequested",
                    listener: "jqUnit.assertDeepEq",
                    args: ["Historian model is as expected", sjrk.storyTelling.base.page.storyEditTester.expectedHistoryStates.editStoryStep, "{storyEdit}.historian.model"]
                }]
            }]
        }]
    });

    /**
     * Triggers a click on a given element
     *
     * @param {Component} component - the fluid.viewComponent that contains the element
     * @param {String} buttonSelector - infusion selector name for the element to be clicked
     */
    sjrk.storyTelling.base.page.storyEditTester.triggerButtonClick = function (component, buttonSelector) {
        component.locate(buttonSelector).click();
    };

    /**
     * Gets the value of a given field from the contents of the first block of a story model
     *
     * @param {Component} component - an sjrk.storyTelling.ui component that has a story subcomponent (e.g. storyEditor or storyViewer)
     * @param {String} fieldName - the name of the value/field to be retrieved
     *
     * @return {Object} - the value of the field
     */
    sjrk.storyTelling.base.page.storyEditTester.getModelValueFromFieldName = function (component, fieldName) {
        return fluid.get(component, "story.model.content.0." + fieldName);
    };

    // Test cases for the empty block filter
    sjrk.storyTelling.base.page.storyEditTester.isEmptyBlockTestCases = {
        "blockIsEmptyObject": { expectedEmpty: true, block: {} },
        "blockIsEmptyArray": { expectedEmpty: true, block: [] },
        "blockIsEmptyString": { expectedEmpty: true, block: "" },
        "blockIsTruthyString": { expectedEmpty: true, block: "Not a block" },
        "blockIsNumberZero": { expectedEmpty: true, block: 0 },
        "blockIsTruthyNumber": { expectedEmpty: true, block: 1 },
        "blockIsTrue": { expectedEmpty: true, block: true },
        "blockIsFalse": { expectedEmpty: true, block: false },
        "blockIsEmptyArray_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: [] },
        "blockIsEmptyString_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: "" },
        "blockIsTruthyString_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: "Not a block" },
        "blockIsNumberZero_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: 0 },
        "blockIsTruthyNumber_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: 1 },
        "blockIsTrue_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: true },
        "blockIsFalse_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [], block: false },
        "blockIsEmptyObject_contentValIsNumberZero": { expectedEmpty: true, blockFields: 0, block: {} },
        "blockIsEmptyObject_contentValIsTruthyNumber": { expectedEmpty: true, blockFields: 1, block: {} },
        "blockIsEmptyObject_contentValIsTrue": { expectedEmpty: true, blockFields: true, block: {} },
        "blockIsEmptyObject_contentValIsFalse": { expectedEmpty: true, blockFields: false, block: {} },
        "blockIsEmptyObject_contentValIsEmptyString": { expectedEmpty: true, blockFields: "", block: {} },
        "blockIsEmptyObject_contentValIsTruthyString": { expectedEmpty: true, blockFields: "Useless", block: {} },
        "blockIsTextBlockTextOnly_contentValIsEmptyArray": { expectedEmpty: true, blockFields: [],
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsEmptyObject": { expectedEmpty: true, blockFields: {},
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsNumberZero": { expectedEmpty: true, blockFields: 0,
            block: {
                blockType: "text",
                heading: "",
                text: "An actual text value"
            }
        },
        "blockIsTextBlockTextOnly_contentValIsTruthyNumber": { expectedEmpty: true, blockFields: 1,
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

    /**
     * Runs through the empty block test cases and tests the filter function directly
     *
     * @param {Object.<String, String[]>} defaultblockFields - a collection of block types and fields that, if not empty,
     * indicate whether a given block of that type is also empty
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyIsEmptyBlock = function (defaultblockFields) {
        fluid.each(sjrk.storyTelling.base.page.storyEditTester.isEmptyBlockTestCases, function (testCase, index) {
            var blockFieldsToTest = fluid.isValue(testCase.blockFields) ? testCase.blockFields : defaultblockFields;

            var actuallyEmpty = sjrk.storyTelling.base.page.storyEdit.isEmptyBlock(testCase.block, blockFieldsToTest[testCase.block.blockType]);
            jqUnit.assertEquals("Block emptiness state for test case " + index + " is as expected", testCase.expectedEmpty, actuallyEmpty);
        });
    };

    /**
     * Represents a progress state as the visibility of three parts of the page
     * @typedef {Object} PublishingState
     * @property {boolean} progressArea - the visibility of the progress area
     * @property {boolean} responseArea - the visibility of the server response area
     * @property {boolean} shareButton - the visibility of the share story button
     */

    /**
     * Given a set of expected visibility values for various publishing states,
     * will evaluate the actual visibility of the relevant bits of the previewer
     *
     * @param {Object.<String, PublishingState>} expectedStates - the expected visibility of the elements for each publishing state
     * @param {jQuery} progressArea - the jQueryable representing the progress area
     * @param {jQuery} responseArea - the jQueryable representing the server response area
     * @param {jQuery} shareButton - the jQueryable representing the "share story" button
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyPublishStates = function (expectedStates, progressArea, responseArea, shareButton) {
        sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility(progressArea, expectedStates.progressArea);
        sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility(responseArea, expectedStates.responseArea);
        sjrk.storyTelling.base.page.storyEditTester.verifyElementDisabled(shareButton, expectedStates.shareButton);
    };

    /**
     * Verifies a single HTML element's visibility is as expected
     *
     * @param {jQuery} el - the element in question
     * @param {Boolean} isExpectedVisible - the element's expected visibility state
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyElementVisibility = function (el, isExpectedVisible) {
        var isActuallyVisible = el.is(":visible");
        jqUnit.assertEquals("The element's visibility is as expected", isExpectedVisible, isActuallyVisible);
    };

    /**
     * Verifies whether a single HTML element is enabled or disabled and how
     * that compares to its expected state
     *
     * @param {jQuery} el - the element in question
     * @param {Boolean} isExpectedDisabled - the element's expected visibility state
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyElementDisabled = function (el, isExpectedDisabled) {
        var isActuallyDisabled = el.prop("disabled");
        jqUnit.assertEquals("The element's 'disabled' value is as expected", isExpectedDisabled, isActuallyDisabled);
    };

    /**
     * Verifies the text contained within a single HTML element
     *
     * @param {jQuery} el - the server response area element
     * @param {String} expectedText - the element's expected text contents, trimmed for whitespace
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyResponseText = function (el, expectedText) {
        var actualText = el.text().trim();
        jqUnit.assertEquals("The response text is as expected", expectedText, actualText);
    };

    /**
     * Clears the autosave state
     *
     * @param {String} storyAutosaveKey - the localStorage key to clear
     */
    sjrk.storyTelling.base.page.storyEditTester.clearAutosaveState = function (storyAutosaveKey) {
        window.localStorage.removeItem(storyAutosaveKey);
    };

    /**
     * Verifies the state of the autosave data
     *
     * @param {String} storyAutosaveKey - the localStorage key the story content is saved to
     * @param {Object} expectedAutosaveState - the expected value of the data
     */
    sjrk.storyTelling.base.page.storyEditTester.verifyAutosaveState = function (storyAutosaveKey, expectedAutosaveState) {
        var rawAutosaveState = window.localStorage.getItem(storyAutosaveKey);
        var actualAutosaveState = JSON.parse(rawAutosaveState);
        jqUnit.assertDeepEq("Story autosave data is in the expected state", expectedAutosaveState, actualAutosaveState);
    };

    /**
     * Verifies whether the clearMediaBlockUrls function behaves as expected
     *
     * @param {Component[]} blocks - a collection of story blocks (sjrk.storyTelling.block)
     * @param {Component[]} expectedClearedBlocks - the expected resulting collection of blocks
     */
    sjrk.storyTelling.base.page.storyEditTester.clearMediaBlockUrlsTest = function (blocks, expectedClearedBlocks) {
        var actualClearedBlocks = sjrk.storyTelling.base.page.storyEdit.clearMediaBlockUrls(blocks);
        jqUnit.assertDeepEq("Media blocks have URLs removed as expected", expectedClearedBlocks, actualClearedBlocks);
    };

    // Test environment
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
