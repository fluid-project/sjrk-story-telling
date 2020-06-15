/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    // the base blockUi for editing individual blocks, contains shared elements
    fluid.defaults("sjrk.storyTelling.blockUi.editor", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        model: {
            // reorder buttons are disabled depending on the block's order:
            // if the block is first in the order, the "up" button is disabled
            // if the block is last in the order, the "down" button is disabled
            moveBlockDownDisabled: "{block}.model.lastInOrder",
            moveBlockUpDisabled: "{block}.model.firstInOrder"
        },
        modelListeners: {
            "moveBlockDownDisabled": {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockDownButton", "{change}.value"],
                excludeSource: ["init"],
                namespace: "setMoveBlockDownDisabled"
            },
            "moveBlockUpDisabled": {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockUpButton", "{change}.value"],
                excludeSource: ["init"],
                namespace: "setMoveBlockUpDisabled"
            }
        },
        selectors: {
            moveBlockDownButton: ".sjrkc-st-reorderer-move-down",
            moveBlockUpButton: ".sjrkc-st-reorderer-move-up",
            selectedCheckbox: ".sjrkc-st-block-selection-checkbox"
        },
        events: {
            onReadyToBind: null,
            onMoveBlock: null
        },
        invokers: {
            setButtonDisabled: "sjrk.storyTelling.blockUi.editor.setButtonDisabled"
        },
        listeners: {
            "onReadyToBind": [{
                this: "{that}.dom.moveBlockDownButton",
                method: "click",
                args: [fluid.direction.DOWN, "{that}.events.onMoveBlock.fire"],
                namespace: "bindBlockDownButton"
            },
            {
                this: "{that}.dom.moveBlockUpButton",
                method: "click",
                args: [fluid.direction.UP, "{that}.events.onMoveBlock.fire"],
                namespace: "bindBlockUpButton"
            },
            {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockDownButton", "{that}.model.moveBlockDownDisabled"],
                namespace: "setMoveBlockDownDisabledOnReady"
            },
            {
                func: "{that}.setButtonDisabled",
                args: ["{that}.dom.moveBlockUpButton", "{that}.model.moveBlockUpDisabled"],
                namespace: "setMoveBlockUpDisabledOnReady"
            }]
        },
        components: {
            // binds user input DOM elements to model values on the block
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{blockUi}.container",
                options: {
                    model: "{block}.model",
                    selectors: {
                        heading: ".sjrkc-st-block-heading"
                    },
                    bindings: {
                        heading: "heading"
                    },
                    events: {
                        onUiReadyToBind: "{editor}.events.onReadyToBind"
                    }
                }
            },
            // loads the localized messages and template for the block
            templateManager: {
                options: {
                    listeners: {
                        "onTemplateRendered.escalate": "{editor}.events.onReadyToBind.fire"
                    }
                }
            }
        }
    });

    sjrk.storyTelling.blockUi.editor.setButtonDisabled = function (button, isDisabled) {
        $(button).prop("disabled", isDisabled);
    };

})(jQuery, fluid);
