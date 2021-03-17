/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // the "base" grade for all interfaces which render/represent an individual
    // block, regardless of type.
    fluid.defaults("sjrk.storyTelling.blockUi", {
        gradeNames: ["fluid.viewComponent"],
        components: {
            // loads the localized messages and template for the block
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{blockUi}.container",
                options: {
                    model: {
                        dynamicValues: "{block}.model"
                    },
                    templateConfig: {
                        messagesPath: "%resourcePrefix/messages/storyBlockMessages.json"
                    }
                }
            },
            // the data, the block itself
            block: {
                type: "sjrk.storyTelling.block"
            }
        }
    });

})(jQuery, fluid);
