/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("sjrk.storyTelling.transforms");

    fluid.defaults("sjrk.storyTelling.transforms.stringToArray", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "delimiter": ",",
            "trim": true
        }
    });

    sjrk.storyTelling.transforms.stringToArray = function (input, extraInputs) {
        var sourceString = input,
            delimiter = extraInputs.delimiter(),
            trim = extraInputs.trim();

        return fluid.transform(sourceString.split(delimiter), function (tag) {
            if (trim) {
                return tag.trim();
            } else {
                return tag;
            }
        });
    };

    fluid.defaults("sjrk.storyTelling.transforms.arrayToString", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "separator": ", "
        }
    });

    sjrk.storyTelling.transforms.arrayToString = function (input, extraInputs) {
        return input.join(extraInputs.separator());
    };

})(jQuery, fluid);
