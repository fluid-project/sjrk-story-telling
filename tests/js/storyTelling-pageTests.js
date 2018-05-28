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

    fluid.defaults("sjrk.storyTelling.testPage", {
        gradeNames: ["sjrk.storyTelling.page"],
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                container: "#testMenu"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.pageTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test combined story authoring interface",
            tests: [{
                name: "Test editor and previewer model binding and updating",
                expect: 1,
                sequence: [{
                    "event": "{pageTest page}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                }]
                // TODO: Add tests for uiLanguage changing and events
                // TODO: Add tests for onContextChangeRequested event
                // TODO: Add tests for loading language from cookieStore
                // TODO: Add tests for all functions in the file
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.pageTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            page: {
                type: "sjrk.storyTelling.testPage",
                container: "#testPage",
                createOnEvent: "{pageTester}.events.onTestCaseStart"
            },
            pageTester: {
                type: "sjrk.storyTelling.pageTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.pageTest"
        ]);
    });

})(jQuery, fluid);
