/* global fluid, jqUnit, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.testDynamicViewComponentManager", {
        gradeNames: ["sjrk.dynamicViewComponentManager"],
        dynamicComponents: {
            managedViewComponents: {
                type: "sjrk.testDynamicViewComponent"
            }
        }
    });

    fluid.defaults("sjrk.testDynamicViewComponent", {
        gradeNames: ["fluid.viewComponent"],
        listeners: {
            "onCreate.appendMarkup": {
                "this": "{that}.container",
                "method": "html",
                "args": ["{that}.options.managedViewComponentDetails.containerIndividualClass"]
            }
        }
    });

    fluid.defaults("sjrk.dynamicViewComponentManagerTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test the sjrk.dynamicViewComponentManager component.",
            tests: [{
                expect: 7,
                name: "Test dynamic component container addition and deletion.",
                sequence: [{
                    listener: "sjrk.dynamicViewComponentManagerTester.testInit",
                    "event": "{dynamicViewComponentManagerTests dynamicViewComponentManager}.events.onCreate",
                    args: ["{dynamicViewComponentManager}"]
                }, // Add one container
                {
                    func: "{dynamicViewComponentManager}.events.viewComponentContainerRequested.fire"
                }, {
                    listener: "sjrk.dynamicViewComponentManagerTester.testManagedViewComponentNumbers",
                    event: "{dynamicViewComponentManager}.events.viewComponentRegisteredWithManager",
                    args: ["{dynamicViewComponentManager}", 1]
                }, // Add a second container
                {
                    func: "{dynamicViewComponentManager}.events.viewComponentContainerRequested.fire"
                }, {
                    listener: "sjrk.dynamicViewComponentManagerTester.testManagedViewComponentNumbers",
                    event: "{dynamicViewComponentManager}.events.viewComponentRegisteredWithManager",
                    args: ["{dynamicViewComponentManager}", 2]
                }, {
                    func: "sjrk.dynamicViewComponentManagerTester.destroyFirstManagedComponent",
                    args: ["{dynamicViewComponentManager}"]
                }, {
                    listener: "sjrk.dynamicViewComponentManagerTester.testManagedViewComponentNumbers",
                    event: "{dynamicViewComponentManager}.events.viewComponentDeregisteredWithManager",
                    args: ["{dynamicViewComponentManager}", 1]
                }]
            }]
        }]
    });

    sjrk.dynamicViewComponentManagerTester.testInit = function () {
        jqUnit.assert("dynamicViewComponentManager created");
    };

    sjrk.dynamicViewComponentManagerTester.testManagedViewComponentNumbers = function (that, expectedNumber) {
        var registerAsArray = fluid.hashToArray(that.managedViewComponentRegistry, "componentContainerIndividualClass");

        jqUnit.assertEquals("managedViewComponentRegistry length is " + expectedNumber, expectedNumber, registerAsArray.length);

        var managedViewComponents = that.locate("managedViewComponents");

        jqUnit.assertEquals("number of managedViewComponent elements located is " + expectedNumber, expectedNumber, managedViewComponents.length);
    };

    // Destroy the first managed component
    sjrk.dynamicViewComponentManagerTester.destroyFirstManagedComponent = function (that) {
        var managedComponentRegistryAsArray = fluid.hashToArray(that.managedViewComponentRegistry, "managedComponentKey");

        managedComponentRegistryAsArray[0].destroy();
    };

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
