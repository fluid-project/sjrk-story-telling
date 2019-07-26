/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.baseTheme.page.testStoryEdit", {
        gradeNames: ["sjrk.storyTelling.baseTheme.page.storyEdit"],
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
                        "messagePrefix": "../../messages/uio"
                    },
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
                    events: {
                        onNewBlockTemplateRendered: null
                    },
                    components: {
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        listeners: {
                                                            "onTemplateRendered.notifyTestStoryEditor": {
                                                                func: "{storyEditor}.events.onNewBlockTemplateRendered.fire",
                                                                args: ["{editor}"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            storyPreviewer: {
                container: "#testStoryPreviewer"
            }
        }
    });

    var expectedVisibility = {
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.addBlock", {
        gradeNames: "fluid.test.sequenceElement",
        // blockAddButtonSelector: null, // to be supplied by the implementing test
        sequence: [{
            funcName: "jqUnit.assertDeepEq",
            args: ["Story content is empty to begin with", [], "{storyEdit}.storyPreviewer.story.model.content"]
        },
        {
            // there is a bug when using an expander here for the jQueryTrigger args
            funcName: "sjrk.storyTelling.baseTheme.page.storyEditTester.triggerButtonClick",
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify", {
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
                "@expand:sjrk.storyTelling.baseTheme.page.storyEditTester.getModelValueFromFieldName({storyEdit}.storyEditor,{that}.options.field)"
            ]
        }]
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.removeValueAndWaitToVerify", {
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange", {
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.clearStoryBlocks", {
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

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.textBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddTextBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "heading",
                    value: "Rootbeer's text block"
                },
                priority: "after:addBlock"
            },
            removeHeadingAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.removeValueAndWaitToVerify",
                options: {
                    field: "heading"
                },
                priority: "after:changeHeadingAndWaitToVerify"
            },
            changeTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "text",
                    value: "A story about my brother Shyguy"
                },
                priority: "after:removeHeadingAndWaitToVerify"
            },
            removeTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.removeValueAndWaitToVerify",
                options: {
                    field: "text"
                },
                priority: "after:changeTextAndWaitToVerify"
            },
            changeSimplifiedTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "simplifiedText",
                    value: "My brother Shyguy"
                },
                priority: "after:removeTextAndWaitToVerify"
            },
            removeSimplifiedTextAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.removeValueAndWaitToVerify",
                options: {
                    field: "simplifiedText"
                },
                priority: "after:changeSimplifiedTextAndWaitToVerify"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.clearStoryBlocks",
                priority: "after:removeSimplifiedTextAndWaitToVerify"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.imageBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddImageBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's image block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A picture of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cute grey Mackerel Tabby with Bengal spots"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeImageUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "imageUrl",
                    value: "notarealcatphotosadly.jpg"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.audioBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddAudioBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's audio block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A recording of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cat meowing softly"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeTranscriptAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "transcript",
                    value: "Mrraow"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            changeMediaUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "mediaUrl",
                    value: "notarealmeowrecordingsadly.wav"
                },
                priority: "after:changeTranscriptAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester.videoBlockModelRelaySequence", {
        gradeNames: "fluid.test.sequence",
        sequenceElements: {
            addBlock: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.addBlock",
                options: {
                    blockAddButtonSelector: "storyAddVideoBlock"
                },
                priority: "before:sequence"
            },
            changeHeadingAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "heading",
                    value: "Rootbeer's video block"
                },
                priority: "after:addBlock"
            },
            changeDescriptionAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "description",
                    value: "A video of my brother Shyguy"
                },
                priority: "after:changeHeadingAndConfirmNoChange"
            },
            changeAlternativeTextAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "alternativeText",
                    value: "A cat stretching in the sunlight"
                },
                priority: "after:changeDescriptionAndConfirmNoChange"
            },
            changeTranscriptAndConfirmNoChange: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeBlockAndConfirmNoChange",
                options: {
                    field: "transcript",
                    value: "<No audio>"
                },
                priority: "after:changeAlternativeTextAndConfirmNoChange"
            },
            changeMediaUrlAndWaitToVerify: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.changeValueAndWaitToVerify",
                options: {
                    field: "mediaUrl",
                    value: "notarealvideosadly.mp4"
                },
                priority: "after:changeTranscriptAndConfirmNoChange"
            },
            clearStoryBlocks: {
                gradeNames: "sjrk.storyTelling.baseTheme.page.storyEditTester.clearStoryBlocks",
                priority: "after:sequence"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        members: {
            currentBlock: null // to track dynamic blockUi components
        },
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 20,
                sequence: [{
                    "event": "{storyEditTest storyEdit}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    func: "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    args: [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1"]
                    ]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyEditor.dom.storyEditorNext"
                },
                {
                    "event": "{storyEdit}.storyEditor.events.onVisibilityChanged",
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2"]
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
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
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
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.dom.storyEditorPage1", "{storyEdit}.storyPreviewer.container"],
                        ["{storyEdit}.storyEditor.dom.storyEditorPage2"]
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
                    "listener": "sjrk.storyTelling.testUtils.verifyPageVisibility",
                    "args": [
                        ["{storyEdit}.storyEditor.container"],
                        ["{storyEdit}.storyPreviewer.container"]
                    ]
                },
                {
                    func: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyEdit}.storyPreviewer.dom.storyTitle", "New test title"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyListenTo"
                },
                {
                    "event": "{storyEdit}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from editor."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyListenTo"
                },
                {
                    "event": "{storyEdit}.events.onStoryListenToRequested",
                    "listener": "jqUnit.assert",
                    "args": "onStoryListenToRequested event fired from previewer."
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
            name: "Test storySpeaker",
            tests: [{
                name: "Test storySpeaker",
                expect: 4,
                sequence: [{
                    func: "{storyEdit}.storyEditor.story.applier.change",
                    args: ["author", "Rootbeer"]
                },
                {
                    "changeEvent": "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "author",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "New test title, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    func: "{storyEdit}.storyEditor.story.applier.change",
                    args: ["title", "My brother Shyguy"]
                },
                {
                    "changeEvent": "{storyEdit}.storyEditor.story.applier.modelChanged",
                    path: "title",
                    listener: "jqUnit.assertEquals",
                    args: ["Model ttsText value relayed from author field", "My brother Shyguy, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.menu.dom.languageLinkSpanish"
                },
                {
                    "event": "{storyEdit}.events.onAllUiComponentsReady",
                    listener: "jqUnit.assertEquals",
                    args: ["ttsText value updated with language change", "My brother Shyguy, de Rootbeer. Palabras claves: . ", "{storyEdit}.storySpeaker.model.ttsText"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.menu.dom.languageLinkEnglish"
                },
                {
                    "event": "{storyEdit}.events.onAllUiComponentsReady",
                    listener: "jqUnit.assertEquals",
                    args: ["ttsText value updated with language change", "My brother Shyguy, by Rootbeer. Keywords: . ", "{storyEdit}.storySpeaker.model.ttsText"]
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
                    args: ["New block template fully rendered"]
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
                    args: ["New block template fully rendered"]
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
                    args: ["New block template fully rendered"]
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
                name: "Test block filtering model relay: Text block",
                expect: 10,
                sequenceGrade: "sjrk.storyTelling.baseTheme.page.storyEditTester.textBlockModelRelaySequence"
            },
            {
                name: "Test block filtering model relay: Image block",
                expect: 12,
                sequenceGrade: "sjrk.storyTelling.baseTheme.page.storyEditTester.imageBlockModelRelaySequence",
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
                expect: 14,
                sequenceGrade: "sjrk.storyTelling.baseTheme.page.storyEditTester.audioBlockModelRelaySequence",
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
                    args: ["Story model block transcript is as expected", "Mrraow", "{storyEdit}.storyPreviewer.story.model.content.0.transcript"]
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["Story model block imageUrl is as expected", "notarealmeowrecordingsadly.wav", "{storyEdit}.storyPreviewer.story.model.content.0.mediaUrl"]
                }]
            },
            {
                name: "Test block filtering model relay: Video block",
                expect: 14,
                sequenceGrade: "sjrk.storyTelling.baseTheme.page.storyEditTester.videoBlockModelRelaySequence",
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
                    args: ["Story model block transcript is as expected", "<No audio>", "{storyEdit}.storyPreviewer.story.model.content.0.transcript"]
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
                    funcName: "sjrk.storyTelling.baseTheme.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.prePublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyEdit}.storyPreviewer.dom.storyShare"
                },
                {
                    "event": "{storyEdit}.events.onStoryShareRequested",
                    listener: "sjrk.storyTelling.baseTheme.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.duringPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    func: "{storyEdit}.events.onStoryShareComplete.fire",
                    args: ["Story about Shyguy didn't save because Rootbeer got jealous"]
                },
                {
                    "event": "{storyEdit}.events.onStoryShareComplete",
                    listener: "sjrk.storyTelling.baseTheme.page.storyEditTester.verifyPublishStates",
                    args: [expectedVisibility.postPublish, "{storyEdit}.storyPreviewer.dom.progressArea", "{storyEdit}.storyPreviewer.dom.responseArea", "{storyEdit}.storyPreviewer.dom.storyShare"]
                },
                {
                    funcName: "sjrk.storyTelling.baseTheme.page.storyEditTester.verifyResponseText",
                    args: ["{storyEdit}.storyPreviewer.dom.responseArea", "Publishing failed: Story about Shyguy didn't save because Rootbeer got jealous"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.baseTheme.page.storyEditTester.triggerButtonClick = function (component, buttonSelector) {
        component.locate(buttonSelector).click();
    };

    sjrk.storyTelling.baseTheme.page.storyEditTester.getModelValueFromFieldName = function (component, fieldName) {
        return fluid.get(component, "story.model.content.0." + fieldName);
    };

    sjrk.storyTelling.baseTheme.page.storyEditTester.verifyPublishStates = function (expectedStates, progressArea, responseArea, shareButton) {
        sjrk.storyTelling.baseTheme.page.storyEditTester.verifyElementVisibility(progressArea, expectedStates.progressArea);
        sjrk.storyTelling.baseTheme.page.storyEditTester.verifyElementVisibility(responseArea, expectedStates.responseArea);
        sjrk.storyTelling.baseTheme.page.storyEditTester.verifyElementDisabled(shareButton, expectedStates.shareButton);
    };

    sjrk.storyTelling.baseTheme.page.storyEditTester.verifyElementVisibility = function (el, isExpectedVisible) {
        var isActuallyVisible = el.is(":visible");
        jqUnit.assertEquals("The element's visibility is as expected", isExpectedVisible, isActuallyVisible);
    };

    sjrk.storyTelling.baseTheme.page.storyEditTester.verifyElementDisabled = function (el, isExpectedDisabled) {
        var isActuallyDisabled = el.prop("disabled");
        jqUnit.assertEquals("The element's 'disabled' value is as expected", isExpectedDisabled, isActuallyDisabled);
    };

    sjrk.storyTelling.baseTheme.page.storyEditTester.verifyResponseText = function (responseArea, expectedText) {
        var actualText = responseArea.text().trim();
        jqUnit.assertEquals("The response text is as expected", expectedText, actualText);
    };

    fluid.defaults("sjrk.storyTelling.baseTheme.page.storyEditTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyEdit: {
                type: "sjrk.storyTelling.baseTheme.page.testStoryEdit",
                container: "#testStoryEdit",
                createOnEvent: "{storyEditTester}.events.onTestCaseStart"
            },
            storyEditTester: {
                type: "sjrk.storyTelling.baseTheme.page.storyEditTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.baseTheme.page.storyEditTest"
        ]);
    });

})(jQuery, fluid);
