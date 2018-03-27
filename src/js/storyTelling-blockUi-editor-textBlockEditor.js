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

    fluid.defaults("sjrk.storyTelling.blockUi.editor.textBlockEditor", {
        gradeNames: ["sjrk.storyTelling.blockUi.editor"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockText.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.textBlock"
            },
            binder: {
                options: {
                    selectors: {
                        textBlockText: ".sjrkc-storyblock-text",
                        textBlockSimplifiedText: ".sjrkc-storyblock-simplified-text"
                    },
                    bindings: {
                        textBlockText: "text",
                        textBlockSimplifiedText: "simplifiedText"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
