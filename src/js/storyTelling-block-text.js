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

    fluid.defaults("sjrk.storyTelling.block.textBlock.base", {
        gradeNames: ["sjrk.storyTelling.block.base"],
        model: {
            text: null,
            simplifiedText: null
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockTextView.handlebars"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.block.textBlock.editable", {
        gradeNames: ["sjrk.storyTelling.block.textBlock.base", "sjrk.storyTelling.block.editable"],
        selectors: {
            textBlockText: ".sjrkc-storyblock-text",
            textBlockSimplifiedText: ".sjrkc-storyblock-simplified-text"
        },
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockText.handlebars"
                    },
                    templateStrings: {
                        uiStrings: {
                            blockTextIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockText)",
                            blockSimplifiedTextIdForLabel: "@expand:sjrk.storyTelling.ui.getLabelId(storyBlockSimplifiedText)"
                        }
                    }
                }
            },
            binder: {
                options: {
                    bindings: {
                        textBlockText: "text",
                        textBlockSimplifiedText: "simplifiedText"
                    }
                }
            }
        }
    });

    fluid.defaults("sjrk.storyTelling.block.textBlock", {
        gradeNames: ["sjrk.storyTelling.block.textBlock.editable"]
    });

})(jQuery, fluid);
