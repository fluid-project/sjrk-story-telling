/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // Represents the story categories to be chosen from during authoring
    // This file contains the keys and stringTemplate values, while the actual
    // category names are defined for each localization in a messages file
    // e.g. for English category names, see src\messages\storyCategories_en.json
    fluid.defaults("srjk.storyTelling.story.categories", {
        gradeNames: ["fluid.component"],
        categories: {
            childhood: "%category_childhood",
            immigration: "%category_immigration",
            education: "%category_education"
        },
        components: {
            messageLoader: {
                type: "sjrk.storyTelling.messageLoaderWithLocalization",
                options: {
                    resources: {
                        componentMessages: "%resourcePrefix/src/messages/storyCategories_en.json"
                    }
                }
            }
        }
    });

})(jQuery, fluid);
