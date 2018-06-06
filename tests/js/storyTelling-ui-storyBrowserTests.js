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

    fluid.defaults("sjrk.storyTelling.ui.testStoryBrowser", {
        gradeNames: ["sjrk.storyTelling.ui.storyBrowser"],
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

    fluid.defaults("sjrk.storyTelling.ui.storyBrowserTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test Story Browser UI.",
            tests: [{
                name: "Test UI controls",
                expect: 3,
                sequence: [{
                    "event": "{storyBrowserTest storyBrowser}.events.onControlsBound",
                    listener: "jqUnit.assert",
                    args: ["Story browser's onControlsBound event fired"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyBrowser}.dom.gridViewLink"
                },
                {
                    "event": "{storyBrowser}.events.onGridViewRequested",
                    listener: "jqUnit.assert",
                    args: "onGridViewRequested event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyBrowser}.dom.listViewLink"
                },
                {
                    "event": "{storyBrowser}.events.onListViewRequested",
                    listener: "jqUnit.assert",
                    args: "onListViewRequested event fired."
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.ui.storyBrowserTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyBrowser: {
                type: "sjrk.storyTelling.ui.testStoryBrowser",
                container: "#testStoryBrowser",
                createOnEvent: "{storyBrowserTester}.events.onTestCaseStart"
            },
            storyBrowserTester: {
                type: "sjrk.storyTelling.ui.storyBrowserTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.ui.storyBrowserTest"
        ]);
    });

})(jQuery, fluid);
