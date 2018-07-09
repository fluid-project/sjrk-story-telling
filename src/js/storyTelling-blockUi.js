/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

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
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyBlockMessages.json"
                    },
                    listeners: {
                        "onAllResourcesLoaded.renderTemplate": {
                            funcName: "{that}.renderTemplate",
                            args: ["{block}.model"]
                        }
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
