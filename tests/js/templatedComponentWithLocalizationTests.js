/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testTemplatedComponentWithLocalization", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalization"],
        selectors: {
            testMessage: ".sjrkc-testTemplatedComponentWithLocalization-testMessage"
        },
        components: {
            resourceLoader: {
                options: {
                    resources: {
                        componentTemplate: "../html/templates/testLocalizationTemplate.html",
                        componentMessages: "../json/messages/testLocalizationMessages.json"
                    }
                }
            }
        }
    });

    // Abstract, see implementations below
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTesterBase", {
        gradeNames: ["fluid.test.testCaseHolder"],
        expectedLocaleMessages: {
            "en": "Hello, world!",
            "fr": "Bonjour le monde!",
            // TODO: need to have a better sense of how to:
            // - handle potential multilingual input (non-Latin character sets)
            // - test multilingual input
            // - store them - HTML entities, unicode, etc?
            // Issues encountered already:
            // - encoding between platforms (local vs server)
            // - testability of multilingual strings when rendering
            // message bundles to DOM
            "es": "\u00A1Hola Mundo!"
        },
        modules: [{
            name: "Test templated component with localization.",
            tests: [{
                name: "Test locale translation",
                expect: 1,
                sequence: [{
                    "event": "{templatedComponentWithLocalizationTestBase templatedComponentWithLocalization}.events.onTemplateRendered",
                    listener: "sjrk.storyTelling.templatedComponentWithLocalizationTesterBase.testLocalization",
                    args: ["{templatedComponentWithLocalization}", "testMessage", "{that}.options.expectedMessage"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templatedComponentWithLocalizationTesterBase.testLocalization = function (component, selector, expected) {
        var text = component.locate(selector).text().trim();
        jqUnit.assertEquals("Selector text matches expected value", expected, text);
    };

    // English localization tester
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTester.en", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTesterBase"],
        expectedMessage: "{that}.options.expectedLocaleMessages.en",
        modules: [{
            name: "Test templated component with localization (en)"
        }]
    });

    // French localization tester
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTester.fr", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTesterBase"],
        expectedMessage: "{that}.options.expectedLocaleMessages.fr",
        modules: [{
            name: "Test templated component with localization (fr)"
        }]
    });

    // Spanish localization tester
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTester.es", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTesterBase"],
        expectedMessage: "{that}.options.expectedLocaleMessages.es",
        modules: [{
            name: "Test templated component with localization (es)"
        }]
    });

    // Abstract, see implementing grades below
    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTestBase", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templatedComponentWithLocalization: {
                type: "sjrk.storyTelling.testTemplatedComponentWithLocalization",
                container: "#testTemplatedComponentWithLocalization",
                createOnEvent: "{templatedComponentWithLocalizationTester}.events.onTestCaseStart",
                options: {
                    components: {
                        resourceLoader: {
                            options: {
                                // locale: "en"
                            }
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTest.en", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTestBase"],
        distributeOptions: [{
            record: "en",
            target: "{that templatedComponentWithLocalization}.options.components.resourceLoader.options.locale"
        }, {
            record: "#testTemplatedComponentWithLocalization_en",
            target: "{that templatedComponentWithLocalization}.container"
        }],
        components: {
            templatedComponentWithLocalizationTester: {
                type: "sjrk.storyTelling.templatedComponentWithLocalizationTester.en"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTest.fr", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTestBase"],
        distributeOptions: [{
            record: "fr",
            target: "{that templatedComponentWithLocalization}.options.components.resourceLoader.options.locale"
        }, {
            record: "#testTemplatedComponentWithLocalization_fr",
            target: "{that templatedComponentWithLocalization}.container"
        }],
        components: {
            templatedComponentWithLocalizationTester: {
                type: "sjrk.storyTelling.templatedComponentWithLocalizationTester.fr"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponentWithLocalizationTest.es", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithLocalizationTestBase"],
        distributeOptions: [{
            record: "es",
            target: "{that templatedComponentWithLocalization}.options.components.resourceLoader.options.locale"
        }, {
            record: "#testTemplatedComponentWithLocalization_es",
            target: "{that templatedComponentWithLocalization}.container"
        }],
        components: {
            templatedComponentWithLocalizationTester: {
                type: "sjrk.storyTelling.templatedComponentWithLocalizationTester.es"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templatedComponentWithLocalizationTest.en",
            "sjrk.storyTelling.templatedComponentWithLocalizationTest.fr",
            "sjrk.storyTelling.templatedComponentWithLocalizationTest.es"
        ]);
    });

})(jQuery, fluid);
