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

    fluid.defaults("sjrk.storyTelling.block.text", {
        gradeNames: ["sjrk.storyTelling.block"],
        model: {
            content: {
                text: "",
                simplifiedText: ""
            }
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockText.handlebars",
                        messagesPath: "%resourcePrefix/src/messages/storyBlockText.json"
                    },
                    templateStrings: {
                        uiStrings: {
                            blockClasses: "@expand:sjrk.storyTelling.ui.getClasses(storyBlock-text)",
                            blockIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockText)"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
