/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Test component for the Browse page
    fluid.defaults("sjrk.storyTelling.base.page.testStoryBrowse", {
        gradeNames: ["sjrk.storyTelling.base.page.storyBrowse"],
        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
        pageSetup: {
            resourcePrefix: "../../../themes/base"
        },
        components: {
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
            },
            menu: {
                container: "#testMenu"
            },
            storyBrowser: {
                container: "#testStoryBrowser"
            }
        }
    });

    // Test cases and sequences for the Browse page
    fluid.defaults("sjrk.storyTelling.base.page.storyBrowseTester", {
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
        }]
    });

    // Test environment
    fluid.defaults("sjrk.storyTelling.base.page.storyBrowseTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            storyBrowse: {
                type: "sjrk.storyTelling.base.page.testStoryBrowse",
                container: "#testStoryBrowse",
                createOnEvent: "{storyBrowseTester}.events.onTestCaseStart"
            },
            storyBrowseTester: {
                type: "sjrk.storyTelling.base.page.storyBrowseTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.base.page.storyBrowseTest"
        ]);
    });

})(jQuery, fluid);
