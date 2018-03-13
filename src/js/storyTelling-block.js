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
            //blockType: "", // to be supplied by implementing block formats
            id: null,
            language: null,
            heading: null
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                container: "{block}.container",
                options: {
                    templateConfig: {
                        messagesPath: "%resourcePrefix/src/messages/storyBlockMessages.json",
                        locale: "{block}.language"
                    },
                    listeners: {
                        "onAllResourcesLoaded.renderTemplateOnSelf": {
                            funcName: "{that}.renderTemplateOnSelf",
                            args: ["{block}.model"]
                        }
                    }
                }
            }
        }
    });

    // mix-in grade
    fluid.defaults("sjrk.storyTelling.block.editable", {
        gradeNames: ["sjrk.storyTelling.block"],
        selectors: {
            heading: ".sjrkc-storyblock-heading",
            selectedCheckbox: ".sjrkc-storyblock-selection-checkbox"
        },
        events: {
            onReadyToBind: "{templateManager}.events.onAllResourcesLoaded"
        },
        // TODO: use the binder's onUiReadyToBind event
        listeners: {
            "onReadyToBind.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args: "{that}.binder"
            }
        },
        components: {
            templateManager: {
                options: {
                    templateStrings: {
                        uiStrings: {
                            // TODO: think about the usage/location of this function
                            // TODO: perhaps it could be set up as a handlebars helper (see SJRK-52 Jira)
                            blockHeadingIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockHeading)",
                            blockSelectionCheckboxIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storySelectionCheckbox)"
                        }
                    }
                }
            },
            binder: {
                type: "sjrk.storyTelling.binder",
                container: "{block}.container",
                options: {
                    model: "{block}.model",
                    selectors: "{block}.options.selectors",
                    bindings: {
                        heading: "heading"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
