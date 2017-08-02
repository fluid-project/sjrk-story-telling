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

    fluid.defaults("sjrk.storyTelling.testTemplatedComponentWithBinder", {
        gradeNames: ["sjrk.storyTelling.templatedComponentWithBinder"],
        model: {
            testValue: "Test value!"
        },
        bindings: {
            testValueInput: "testValue"
        },
        selectors: {
            testValueInput: ".testc-input"
        },
        components: {
            templateLoader: {
                options: {
                    resources: {
                        componentTemplate: "../html//templates/testBinderTemplate.html"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.templatedComponentWithBinderTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test templated component.",
            tests: [{
                name: "Test binding",
                expect: 3,
                sequence: [{
                    "event": "{templatedComponentWithBinderTest templatedComponentWithBinder}.events.onBindingApplied",
                    listener: "sjrk.storyTelling.templatedComponentWithBinderTester.testBinding",
                    args: ["{templatedComponentWithBinder}", "Model and input value are equal at initial creation"]
                }, {
                    "func": "{templatedComponentWithBinder}.applier.change",
                    "args": ["testValue", "New test value!"]
                }, {
                    "changeEvent": "{templatedComponentWithBinder}.applier.modelChanged",
                    "path": "testValue",
                    listener: "sjrk.storyTelling.templatedComponentWithBinderTester.testBinding",
                    args: ["{templatedComponentWithBinder}", "Model and input value are equal when model is changed"]
                }, {
                    "func": "sjrk.storyTelling.testUtils.changeFormElement",
                    args: ["{templatedComponentWithBinder}", "testValueInput", "Test value from changing form"]
                }, {
                    "changeEvent": "{templatedComponentWithBinder}.applier.modelChanged",
                    "path": "testValue",
                    listener: "sjrk.storyTelling.templatedComponentWithBinderTester.testBinding",
                    args: ["{templatedComponentWithBinder}", "Model and input value are equal when form input is changed"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.templatedComponentWithBinderTester.testBinding = function (component, message) {
        var modelValue = fluid.get(component.model, "testValue");
        var inputValue = component.locate("testValueInput").val();
        jqUnit.assertEquals(message, modelValue, inputValue);
    };

    fluid.defaults("sjrk.storyTelling.templatedComponentWithBinderTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            templatedComponentWithBinder: {
                type: "sjrk.storyTelling.testTemplatedComponentWithBinder",
                container: "#testTemplatedComponentWithBinder",
                createOnEvent: "{templatedComponentWithBinderTester}.events.onTestCaseStart"
            },
            templatedComponentWithBinderTester: {
                type: "sjrk.storyTelling.templatedComponentWithBinderTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.templatedComponentWithBinderTest"
        ]);
    });

})(jQuery, fluid);
