/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // Test component for the storyViewer grade
    fluid.defaults("sjrk.storyTelling.ui.testStoryViewer", {
        gradeNames: ["sjrk.storyTelling.ui.storyViewer"],
        events: {
            onNewBlockTemplateRendered: null
        },
        members: {
            oratorRecord: "",
            textToRead: "A story about cats\n            by Cat friend\n\n        Rootbeer\nRootbeer is a cute kitty."
        },
        components: {
            story: {
                options: {
                    model: {
                        title: "A story about cats",
                        author: "Cat friend",
                        content: [{
                            blockType: "text",
                            heading: "Rootbeer",
                            text: "Rootbeer is a cute kitty."
                        }]
                    }
                }
            },
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            isEditorPreview: true // added to test viewer buttons
                        }
                    },
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            },
            blockManager: {
                options: {
                    dynamicComponents: {
                        managedViewComponents: {
                            options: {
                                components: {
                                    templateManager: {
                                        options: {
                                            templateConfig: {
                                                // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                                                resourcePrefix: "../../../themes/base"
                                            },
                                            listeners: {
                                                "onTemplateRendered.notifyTestStoryViewer": {
                                                    func: "{testStoryViewer}.events.onNewBlockTemplateRendered.fire",
                                                    args: ["{that}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
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
        distributeOptions: [{
            record: {
                "onQueueSpeech.queueSpeech": {
                    listener: "fluid.set",
                    args: ["{testStoryViewer}", ["oratorRecord"], "{arguments}.0"],
                    priority: "after:removeExtraWhiteSpace"
                }
            },
            target: "{that orator domReader}.options.listeners"
        }]
    });

    // Test cases and sequences for the storyViewer
    fluid.defaults("sjrk.storyTelling.ui.storyViewerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story Viewer UI.",
            tests: [{
                name: "Test UI controls",
                expect: 5,
                sequence: [{
                    "event": "{storyViewerTest storyViewer}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["Story viewer's onControlsBound event fired"]
                },
                {
                    func: "fluid.identity"
                },
                // verify blocks have been rendered in the correct order
                {
                    "event": "{storyViewerTest storyViewer blockManager}.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.storyTelling.testUtils.verifyBlockAdded",
                    args: ["{storyViewer}.blockManager", "{arguments}.0", "sjrk.storyTelling.blockUi.textBlockViewer"]
                },
                {
                    func: "fluid.identity"
                },
                // Wait for block to fully render
                {
                    "event": "{storyViewer}.events.onNewBlockTemplateRendered",
                    listener: "jqUnit.assert",
                    args: ["New block template fully rendered"]
                }]
            },
            {
                name: "Test buttons on page",
                expect: 1,
                sequence: [{
                    "jQueryTrigger": "click",
                    "element": "{storyViewer}.dom.storyViewerPrevious"
                },
                {
                    "event": "{storyViewer}.events.onStoryViewerPreviousRequested",
                    listener: "jqUnit.assert",
                    args: "onStorySubmitRequested event fired."
                }]
            },
            {
                name: "Test story content rendering",
                expect: 2,
                sequence: [{
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyViewer}.dom.storyTitle", "A story about cats"]
                },
                {
                    funcName: "sjrk.storyTelling.testUtils.assertElementText",
                    args: ["{storyViewer}.dom.storyAuthor", "by Cat friend"]
                }]
            },
            {
                name: "Test orator",
                expect: 3,
                sequence: [{
                    funcName: "jqUnit.isVisible",
                    args: ["The orator play button should be rendered.", "{storyViewer}.orator.controller.dom.playToggle"]
                },
                {
                    funcName: "jqUnit.assertNodeExists",
                    args: ["The orator can locate the content element", "{storyViewer}.orator.dom.content"]
                },
                {
                    jQueryTrigger: "click",
                    element: "{storyViewer}.orator.controller.dom.playToggle"
                },
                {
                    funcName: "jqUnit.assertEquals",
                    args: ["The queue populated correctly", "{storyViewer}.textToRead", "{storyViewer}.oratorRecord"]
                }]
            }]
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.ui.storyViewerTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyViewer: {
                type: "sjrk.storyTelling.ui.testStoryViewer",
                container: "#testStoryViewer",
                createOnEvent: "{storyViewerTester}.events.onTestCaseStart"
            },
            storyViewerTester: {
                type: "sjrk.storyTelling.ui.storyViewerTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.storyViewerTest"
        ]);
    });

})(jQuery, fluid);
