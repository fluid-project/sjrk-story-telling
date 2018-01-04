/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */


(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.story.base", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            // TODO: add an ID field?
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            categories: [],
            summary: "",
            requestedTranslations: [
                //"es": 2, // a list of language codes as keys with
                //"fr": 5  // the number of requests for that language
            ],
            translationOf: null
        }
    });

})(jQuery, fluid);
