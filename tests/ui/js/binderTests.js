/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

"use strict";

(function ($, fluid) {

    // Test component for the binder grade
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
        },
        invokers: {
            verifyBinding: {
                funcName: "sjrk.storyTelling.binderTester.verifyBinding",
                args: ["{that}", "testValue", "testValueInput", "{arguments}.0"]
            }
        }
    });

    // Test cases and sequences for the binder
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
                    "listener": "{binder}.verifyBinding",
                    "args": ["Model and input value are equal at initial creation"]
                },
                {
                    "func": "{binder}.applier.change",
                    "args": ["testValue", "New test value!"]
                },
                {
                    "changeEvent": "{binder}.applier.modelChanged",
                    "path": "testValue",
                    "listener": "{binder}.verifyBinding",
                    "args": ["Model and input value are equal when model is changed"]
                },
                {
                    "func": "sjrk.storyTelling.testUtils.changeFormElement",
                    "args": ["{binder}", "testValueInput", "Test value from changing form"]
                },
                {
                    "changeEvent": "{binder}.applier.modelChanged",
                    "path": "testValue",
                    "listener": "{binder}.verifyBinding",
                    "args": ["Model and input value are equal when form input is changed"]
                }]
            }]
        }]
    });

    /**
     * Verifies that the test binding's model and DOM values are the same
     *
     * @param {Component} component - an instance of sjrk.storyTelling.binder
     * @param {String|String[]} modelPath - the infusion model path to the model value
     * @param {String} domSelector - the DOM selector for the input element
     * @param {String} message - the message to display
     */
    sjrk.storyTelling.binderTester.verifyBinding = function (component, modelPath, domSelector, message) {
        var actualModelValue = fluid.get(component.model, modelPath);
        var actualInputValue = component.locate(domSelector).val();
        jqUnit.assertEquals(message, actualModelValue, actualInputValue);
    };

    // Test environment
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
