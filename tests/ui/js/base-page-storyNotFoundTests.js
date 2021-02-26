/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global jqUnit */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.testStoryNotFound", {
        gradeNames: ["sjrk.storyTelling.base.page.storyNotFound"],
        storyId: "test-id",
        pageSetup: {
            resourcePrefix: "../../../themes/base"
        },
        components: {
            notFound: {
                options: {
                    // These selectors are not used in the component, as the rendering is handled by fluid-handlebars.
                    // However, they have been provided here as a convenience for the tests.
                    selectors: {
                        title: ".sjrkc-st-story-notFound-heading",
                        notice: ".sjrkc-st-story-notFound-notice",
                        heading: ".sjrkc-st-story-notFound-notice-heading",
                        storyId: ".sjrkc-st-story-notFound-notice-storyId",
                        content: ".sjrkc-st-story-notFound-notice-content"
                    }
                }
            },
            uio: {
                options: {
                    auxiliarySchema: {
                        terms: {
                            "messagePrefix": "../../../node_modules/infusion/src/framework/preferences/messages",
                            "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html"
                        },
                        "fluid.prefs.tableOfContents": {
                            enactor: {
                                "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
                                "tocMessage": "../../../node_modules/infusion/src/framework/preferences/messages/tableOfContents-enactor.json"
                            }
                        }
                    }
                }
            }
        }
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.storyNotFoundTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: ".sjrkc-st-markupFixture",
        components: {
            storyNotFound: {
                type: "sjrk.storyTelling.base.page.testStoryNotFound",
                createOnEvent: "{storyNotFoundTester}.events.onTestCaseStart"
            },
            storyNotFoundTester: {
                type: "sjrk.storyTelling.base.page.storyNotFoundTester",
                options: {
                    testOpts: {
                        expectedMessages: {
                            title: "Story not found",
                            heading: "Story not found",
                            storyId: "test-id",
                            content: [
                                "No story could be found with the id test-id",
                                "This story may have been deleted, or your id may be incorrect."
                            ]
                        }
                    }
                }
            }
        }
    });

    // Test environment - no id provided
    fluid.defaults("sjrk.storyTelling.base.page.storyNotFoundNoIdTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        markupFixture: ".sjrkc-st-markupFixture",
        components: {
            storyNotFound: {
                type: "sjrk.storyTelling.base.page.testStoryNotFound",
                createOnEvent: "{storyNotFoundTester}.events.onTestCaseStart",
                options: {
                    storyId: ""
                }
            },
            storyNotFoundTester: {
                type: "sjrk.storyTelling.base.page.storyNotFoundTester",
                options: {
                    testOpts: {
                        expectedMessages: {
                            title: "Story not found",
                            heading: "Story not found",
                            content: "No story id provided"
                        }
                    }
                }
            }
        }
    });

    // Main test sequences for the Edit page
    fluid.defaults("sjrk.storyTelling.base.page.storyNotFoundTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                sequence: [{
                    event: "{testEnvironment > sjrk.storyTelling.base.page.testStoryNotFound}.events.onAllUiComponentsReady",
                    listener: "sjrk.storyTelling.base.page.storyNotFoundTester.assertRendering",
                    args: ["{storyNotFound}.notFound", "{that}.options.testOpts.expectedMessages"]
                }]
            }]
        }]
    });

    /**
     * Removes whitespace from the ends, and collapses interior whitespace down to a single " ". This is needed when
     * comparing a reference string to text pulled from the DOM; which may contain the formatting whitespace characters
     * used in the markup.
     *
     * @param {String} str - the string for which the whitespace shoudl be collapsed
     * @return {String} - a new string with the whitespace collapsed
     */
    sjrk.storyTelling.base.page.storyNotFoundTester.collapseText = function (str) {
        return str.trim().replace(/\s+/g, " ");
    };

    /**
     * Asserts that the expected messages have been rendered into the associated selectors for the provided component.
     *
     * @param {Component} that - an instance of `sjrk.storyTelling.ui.storyNotFound`
     * @param {Object} expectedMessages - key/value pairs where the key matches a selector name, and the value is the
     *                                    expected text associated with that selector. If the value is an array it is
     *                                    iterated over and expected to match a similar array of elements retrieved from
     *                                    the associated selector.
     */
    sjrk.storyTelling.base.page.storyNotFoundTester.assertRendering = function (that, expectedMessages) {
        fluid.each(expectedMessages, function (expectedMessage, key) {
            if (typeof(expectedMessage) === "string") {
                var actual = sjrk.storyTelling.base.page.storyNotFoundTester.collapseText(that.locate(key).text());
                jqUnit.assertEquals("The message for " + key + " has been rendered correctly.", expectedMessage, actual);
            } else {
                fluid.each(expectedMessage, function (message, index) {
                    var actual = sjrk.storyTelling.base.page.storyNotFoundTester.collapseText(that.locate(key).eq(index).text());
                    jqUnit.assertEquals("The message for " + key + ", at index " + index + ", has been rendered correctly.", message, actual);
                });
            }
        });
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.storyNotFoundTest",
            "sjrk.storyTelling.base.page.storyNotFoundNoIdTest"
        ]);
    });

})(jQuery, fluid);
