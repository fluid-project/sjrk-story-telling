/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.page.testStoryBrowse", {
        gradeNames: ["sjrk.storyTelling.page.storyBrowse"],
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
            },
            storyBrowser: {
                container: "#testStoryBrowser"
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.page.storyBrowseTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test browse stories page",
            tests: [{
                name: "Test browser page events",
                expect: 4,
                sequence: [{
                    "event": "{storyBrowseTest storyBrowse}.events.onPreferencesLoaded",
                    "listener": "jqUnit.assert",
                    "args": "onPreferencesLoaded event fired."
                },
                {
                    "event": "{storyBrowseTest storyBrowse}.events.onAllUiComponentsReady",
                    "listener": "jqUnit.assert",
                    "args": "onAllUiComponentsReady event fired."
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyBrowse}.storyBrowser.dom.gridViewLink"
                },
                {
                    "event": "{storyBrowse}.storyBrowser.events.onViewChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onViewChangeRequested event fired with expected arguments", "grid", "{arguments}.0.data"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyBrowse}.storyBrowser.dom.listViewLink"
                },
                {
                    "event": "{storyBrowse}.storyBrowser.events.onViewChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onViewChangeRequested event fired with expected arguments", "list", "{arguments}.0.data"]
                }]
            }]
        },
        {
            name: "Test browse stories page",
            tests: [{
                name: "Test loading and saving view preference",
                expect: 0,
                sequence: [{
                    funcName: "fluid.identity"
                }]
            }]
        }]
    });

    fluid.defaults("sjrk.storyTelling.page.storyBrowseTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyBrowse: {
                type: "sjrk.storyTelling.page.testStoryBrowse",
                container: "#testStoryBrowse",
                createOnEvent: "{storyBrowseTester}.events.onTestCaseStart"
            },
            storyBrowseTester: {
                type: "sjrk.storyTelling.page.storyBrowseTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.page.storyBrowseTest"
        ]);
    });

})(jQuery, fluid);
