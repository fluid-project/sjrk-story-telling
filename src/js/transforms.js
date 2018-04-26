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

    // A transform to turn a delimited string into an array.
    // - "delimiter": the delimiter of terms within the given strings
    // - "trim": if true, trims excess whitespace from each term, otherwise no
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

    // A transform to turn an array into a delimited string
    // - "separator": the string delimiter to be inserted between each term
    fluid.defaults("sjrk.storyTelling.transforms.arrayToString", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "separator": ", "
        }
    });

    // TODO: should test coverage check for null values?
    sjrk.storyTelling.transforms.arrayToString = function (input, extraInputs) {
        return input.join(extraInputs.separator());
    };

    // A transform which, given a collection and an index, will the value of the
    // collection at the specified index, or if that is not truthy, the index itself
    // - "component": the component with the collection
    // - "path": the EL path on the component where the collection resides
    // - "index": the index value to be checked
    fluid.defaults("sjrk.storyTelling.transforms.valueOrIndex", {
        "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
        "inputVariables": {
            "component": null,
            "path": null,
            "index": null
        }
    });

    // returns the value of a collection at a given index, or, failing that, the index itself
    sjrk.storyTelling.transforms.valueOrIndex = function (input, extraInputs) {
        var component = extraInputs.component();
        var path = extraInputs.path();
        var index = extraInputs.index();

        return fluid.get(component, path)[index] || index;
    };

})(jQuery, fluid);
