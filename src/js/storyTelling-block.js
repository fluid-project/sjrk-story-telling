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
            content: {
                text: "",
                simplifiedText: ""
            },
            id: null,
            language: "",
            timestampCreated: null,
            timestampModified: null
        },
        components: {
            templateManager: {
                type: "sjrk.storyTelling.templateManager",
                options: {
                    templateConfig: {
                        locale: "{block}.language"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
