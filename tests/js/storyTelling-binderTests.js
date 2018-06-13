/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.testBinder", {
        gradeNames: ["sjrk.storyTelling.binder"],
        model: {
            testValue: "Test value!"
        },
        bindings: {
            testValueInput: "testValue"
        },
        selectors: {
            testValueInput: ".testc-input"
        }
    });

    fluid.defaults("sjrk.storyTelling.binderTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Test binder.",
            tests: [{
                name: "Test binding",
                expect: 3,
                sequence: [{
                    "func": "{binder}.events.onUiReadyToBind.fire"
                },
                {
                    "event": "{binder}.events.onBindingApplied",
                    "listener": "sjrk.storyTelling.binderTester.testBinding",
                    "args": ["{binder}", "Model and input value are equal at initial creation"]
                },
                {
                    "func": "{binder}.applier.change",
                    "args": ["testValue", "New test value!"]
                },
                {
                    "changeEvent": "{binder}.applier.modelChanged",
                    "path": "testValue",
                    "listener": "sjrk.storyTelling.binderTester.testBinding",
                    "args": ["{binder}", "Model and input value are equal when model is changed"]
                },
                {
                    "func": "sjrk.storyTelling.testUtils.changeFormElement",
                    "args": ["{binder}", "testValueInput", "Test value from changing form"]
                },
                {
                    "changeEvent": "{binder}.applier.modelChanged",
                    "path": "testValue",
                    "listener": "sjrk.storyTelling.binderTester.testBinding",
                    "args": ["{binder}", "Model and input value are equal when form input is changed"]
                }]
            }]
        }]
    });

    sjrk.storyTelling.binderTester.testBinding = function (component, message) {
        var modelValue = fluid.get(component.model, "testValue");
        var inputValue = component.locate("testValueInput").val();
        jqUnit.assertEquals(message, modelValue, inputValue);
    };

    fluid.defaults("sjrk.storyTelling.binderTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            binder: {
                type: "sjrk.storyTelling.testBinder",
                container: "#testBinder"
            },
            binderTester: {
                type: "sjrk.storyTelling.binderTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "sjrk.storyTelling.binderTest"
        ]);
    });

})(jQuery, fluid);
