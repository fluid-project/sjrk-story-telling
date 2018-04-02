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

    fluid.defaults("sjrk.storyTelling.blockUi.imageBlockViewer", {
        gradeNames: ["sjrk.storyTelling.blockUi"],
        components: {
            templateManager: {
                options: {
                    templateConfig: {
                        templatePath: "%resourcePrefix/src/templates/storyBlockImageView.handlebars"
                    }
                }
            },
            block: {
                type: "sjrk.storyTelling.block.imageBlock"
            }
        }
    });

})(jQuery, fluid);