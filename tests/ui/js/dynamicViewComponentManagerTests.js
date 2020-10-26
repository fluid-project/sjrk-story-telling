/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid, jqUnit, sjrk */

"use strict";

(function ($, fluid) {

    // Test component for the dynamicViewComponentManager grade
    fluid.defaults("sjrk.testDynamicViewComponentManager", {
        gradeNames: ["sjrk.dynamicViewComponentManager"],
        dynamicComponents: {
            managedViewComponents: {
                type: "{arguments}.3"
            }
        }
    });

    // A view component to use as a test
    fluid.defaults("sjrk.testDynamicViewComponent", {
        gradeNames: ["fluid.viewComponent"],
        listeners: {
            "onCreate.appendMarkup": {
                "this": "{that}.container",
                "method": "html",
                "args": ["{that}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
            }
        }
    });

    // A different view component to use as a test
    fluid.defaults("sjrk.testDynamicViewComponent2", {
        gradeNames: ["fluid.viewComponent"],
        listeners: {
            "onCreate.appendMarkup": {
                "this": "{that}.container",
                "method": "html",
                "args": ["I am sjrk.testDynamicViewComponent2"]
            }
        }
    });

    // Test cases and sequences for the DVCM
    fluid.defaults("sjrk.dynamicViewComponentManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test the sjrk.dynamicViewComponentManager component.",
            tests: [{
                expect: 9,
                name: "Test dynamic component container addition and deletion.",
                sequence: [{
                    event: "{dynamicViewComponentManagerTests dynamicViewComponentManager}.events.onCreate",
                    listener: "jqUnit.assert",
                    args: ["dynamicViewComponentManager created"]
                }, // Add one container
                {
                    func: "{dynamicViewComponentManager}.events.viewComponentContainerRequested.fire",
                    args: ["sjrk.testDynamicViewComponent"]
                },
                {
                    event: "{dynamicViewComponentManager}.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentType",
                    args: ["{dynamicViewComponentManager}", "{arguments}.0", "sjrk.testDynamicViewComponent"]
                },
                {
                    funcName: "sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentNumbers",
                    args: ["{dynamicViewComponentManager}", 1]
                }, // Add a second container
                {
                    func: "{dynamicViewComponentManager}.events.viewComponentContainerRequested.fire",
                    args: ["sjrk.testDynamicViewComponent2"]
                },
                {
                    event: "{dynamicViewComponentManager}.events.viewComponentRegisteredWithManager",
                    listener: "sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentType",
                    args: ["{dynamicViewComponentManager}", "{arguments}.0", "sjrk.testDynamicViewComponent2"]
                },
                {
                    funcName: "sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentNumbers",
                    args: ["{dynamicViewComponentManager}", 2]
                },
                {
                    func: "sjrk.dynamicViewComponentManagerTester.destroyFirstManagedComponent",
                    args: ["{dynamicViewComponentManager}"]
                },
                {
                    event: "{dynamicViewComponentManager}.events.viewComponentDeregisteredWithManager",
                    listener: "sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentNumbers",
                    args: ["{dynamicViewComponentManager}", 1]
                }]
            }]
        }]
    });

    /**
     * Verifies that a given view component in the registry has the expected infusion type
     *
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     * @param {String} componentContainerIndividualClass - the CSS selector of dynamic view components
     * @param {String} expectedType - the expected type of the view component
     */
    sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentType = function (that, componentContainerIndividualClass, expectedType) {
        var actualType = that.managedViewComponentRegistry[componentContainerIndividualClass].options.managedViewComponentRequiredConfig.type;
        jqUnit.assertEquals("managedViewComponent element has the expected type of " + expectedType, expectedType, actualType);
    };

    sjrk.dynamicViewComponentManagerTester.verifyManagedViewComponentNumbers = function (that, expectedNumber) {
        var registerAsArray = fluid.hashToArray(that.managedViewComponentRegistry, "componentContainerIndividualClass");

        jqUnit.assertEquals("managedViewComponentRegistry length is " + expectedNumber, expectedNumber, registerAsArray.length);

        var managedViewComponents = that.locate("managedViewComponents");

        jqUnit.assertEquals("number of managedViewComponent elements located is " + expectedNumber, expectedNumber, managedViewComponents.length);
    };

    /**
     * Destroys the first managed component in the registry
     *
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     */
    sjrk.dynamicViewComponentManagerTester.destroyFirstManagedComponent = function (that) {
        var managedComponentRegistryAsArray = fluid.hashToArray(that.managedViewComponentRegistry, "managedComponentKey");

        managedComponentRegistryAsArray[0].destroy();
    };

    // Test environment
    fluid.defaults("sjrk.dynamicViewComponentManagerTests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            dynamicViewComponentManager: {
                type: "sjrk.testDynamicViewComponentManager",
                container: "#sjrkc-dynamicViewComponentManager",
                createOnEvent: "{dynamicViewComponentManagerTester}.events.onTestCaseStart"
            },
            dynamicViewComponentManagerTester: {
                type: "sjrk.dynamicViewComponentManagerTester"
            }
        }
    });

    sjrk.dynamicViewComponentManagerTests();

})(jQuery, fluid);
