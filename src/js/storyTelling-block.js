/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // the common, shared data model of all blocks
    fluid.defaults("sjrk.storyTelling.block", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            //blockType: "", // to be supplied by implementing block formats
            id: null,
            language: null,
            heading: null
        }
    });

    // TODO: turn this into a transform and put it in transforms.js or combine with arrayToString
    /* given a set of terms and a separator, will produce a concatenated string
     * of all the terms separated by the separator. Where a term is not truthy,
     * it simply won't appear in the final result.
     * - terms: a collection of terms to be combined
     * - separator: the string to be inserted after each term
     */
    sjrk.storyTelling.block.updateContentString = function (terms, separator) {
        var contentString = "";

        fluid.each(terms, function (term) {
            if (term) {
                contentString += term + (separator || "");
            }
        });

        return contentString;
    };

})(jQuery, fluid);
