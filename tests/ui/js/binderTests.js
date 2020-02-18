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
