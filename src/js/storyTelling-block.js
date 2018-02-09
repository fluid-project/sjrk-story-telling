/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.block", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            id: null,
            language: "",
            timestampCreated: null,
            timestampModified: null
        },
        events: {
            onReadyToBind: "{templateManager}.events.onAllResourcesLoaded"
        },
        listeners: {
            "onReadyToBind.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}.binder"
            }
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{block}.container",
                options: {
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyBlockMessages.json",
                        locale: "{block}.language"
                    }
                }
            },
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{block}.container",
                options: {
                    model: "{block}.model"
                }
            }
        }
    });

})(jQuery, fluid);
