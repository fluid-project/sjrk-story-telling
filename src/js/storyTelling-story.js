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

    fluid.defaults("sjrk.storyTelling.story", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            title: "",
            content: "",
            author: "",
            language: "",
            images: [],
            tags: [],
            summary: "",
            translations: []
        }
    });

})(jQuery, fluid);
