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

    // Test component for the storyBrowser grade
    fluid.defaults("sjrk.storyTelling.ui.testStoryBrowser", {
        gradeNames: ["sjrk.storyTelling.ui.storyBrowser"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        // TODO: run tests for each theme. see: https://issues.fluidproject.org/browse/SJRK-303
                        resourcePrefix: "../../../themes/base"
                    }
                }
            }
        }
    });

    // Test cases and sequences for the storyBrowser
    fluid.defaults("sjrk.storyTelling.ui.storyBrowserTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        invokers: {
            verifyViewSetting: {
                funcName: "sjrk.storyTelling.ui.storyBrowserTester.verifyViewSetting",
                args: ["{storyBrowser}.dom.viewList", "{arguments}.0", "{storyBrowser}.options.browserConfig.gridViewClassName"]
            }
        },
        modules: [{
            name: "Test Story Browser UI.",
            tests: [{
                name: "Test UI controls",
                expect: 13,
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
                    "event": "{storyBrowser}.events.onViewChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onViewChangeRequested event fired with expected arguments", "grid", "{arguments}.0.data"]
                },
                {
                    func: "{that}.verifyViewSetting",
                    args: ["grid"]
                },
                {
                    "jQueryTrigger": "click",
                    "element": "{storyBrowser}.dom.listViewLink"
                },
                {
                    "event": "{storyBrowser}.events.onViewChangeRequested",
                    listener: "jqUnit.assertEquals",
                    args: ["onViewChangeRequested event fired with expected arguments", "list", "{arguments}.0.data"]
                },
                {
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: ["grid"]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["grid"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: ["list"]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: [undefined]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: [5]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: [{}]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    func: "{storyBrowser}.changeView",
                    args: [false]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                },
                {
                    funcName: "sjrk.storyTelling.ui.storyBrowser.changeView",
                    args: ["{storyBrowser}",
                        "viewList",
                        "grid",
                        "{storyBrowser}.options.browserConfig.gridViewClassName",
                        "{storyBrowser}.events.onViewChanged"]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["grid"]
                },
                {
                    funcName: "sjrk.storyTelling.ui.storyBrowser.changeView",
                    args: ["{storyBrowser}",
                        "viewList",
                        "list",
                        "{storyBrowser}.options.browserConfig.gridViewClassName",
                        "{storyBrowser}.events.onViewChanged"]
                },
                {
                    "event": "{storyBrowser}.events.onViewChanged",
                    func: "{that}.verifyViewSetting",
                    args: ["list"]
                }]
            }]
        }]
    });

    /**
     * Verifies the current view setting for the list DOM element
     *
     * @param {jQuery} viewListElement - the DOM element that represents the list to check
     * @param {String} expectedViewSetting - the expected setting of the view preference
     * @param {String} gridViewClassName - the class that indicates the grid view is active
     */
    sjrk.storyTelling.ui.storyBrowserTester.verifyViewSetting = function (viewListElement, expectedViewSetting, gridViewClassName) {
        var containsGridClass = viewListElement.hasClass(gridViewClassName);

        if ((containsGridClass && expectedViewSetting === gridViewClassName) ||
            (!containsGridClass && expectedViewSetting !== gridViewClassName)) {
            jqUnit.assert("The view setting is as expected");
        } else {
            jqUnit.fail("The view setting is not as expected");
        }
    };

    // Test environment
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
