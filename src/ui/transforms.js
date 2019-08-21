/*
Copyright 2017-2019 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    fluid.registerNamespace("sjrk.storyTelling.transforms");

    /* A transform to turn a delimited string into an array. If input is not a
     * string, then it will return an empty array.
     * It is partly invertible via "sjrk.storyTelling.transforms.arrayToString".
     * - "delimiter": the delimiter of terms within the given strings
     * - "trim": if true, trims excess whitespace from each term, otherwise no
     */
    fluid.defaults("sjrk.storyTelling.transforms.stringToArray", {
        gradeNames: ["fluid.standardTransformFunction"],
        invertConfiguration: "sjrk.storyTelling.transforms.stringToArray.invert"
    });

    sjrk.storyTelling.transforms.stringToArray = function (input, transformSpec) {
        var sourceString = input,
            delimiter = transformSpec.delimiter || ",",
            trim = transformSpec.trim;

        trim = trim === undefined ? true : trim;

        return typeof sourceString === "string" ? fluid.transform(sourceString.split(delimiter), function (tag) {
            if (trim) {
                return tag.trim();
            } else {
                return tag;
            }
        }) : [];
    };

    sjrk.storyTelling.transforms.stringToArray.invert = function (transformSpec) {
        transformSpec.type = "sjrk.storyTelling.transforms.arrayToString";
        return transformSpec;
    };

    /* A transform to turn an array into a delimited string.
     * Values can also be accessed via a specific object path relative to each term.
     * It is partly invertible via "sjrk.storyTelling.transforms.stringToArray".
     * - "delimiter" (optional): the delimiter to be inserted between each term
     * - "stringOnly" (optional): flag to allow only non-empty strings
     * - "path" (optional): an EL path on each item in the terms collection
     */
    fluid.defaults("sjrk.storyTelling.transforms.arrayToString", {
        gradeNames: ["fluid.standardTransformFunction"],
        invertConfiguration: "sjrk.storyTelling.transforms.arrayToString.invert"
    });

    sjrk.storyTelling.transforms.arrayToString = function (input, transformSpec) {
        var delimiter = transformSpec.delimiter || ", ",
            stringOnly = transformSpec.stringOnly,
            path = transformSpec.path || "";

        stringOnly = stringOnly === undefined ? true : stringOnly;

        var terms = [];

        fluid.each(input, function (term) {
            term = fluid.get(term, path);

            if (!stringOnly || (term !== "" && typeof term === "string")) {
                terms.push(term);
            }
        });

        return terms.join(delimiter || "");
    };

    sjrk.storyTelling.transforms.arrayToString.invert = function (transformSpec) {
        transformSpec.type = "sjrk.storyTelling.transforms.stringToArray";
        return transformSpec;
    };

    /* A transform which, given a collection and an index, will the value of the
     * collection at the specified index, or if that is not truthy, the index itself
     * - "component": the component with the collection
     * - "path": the EL path on the component where the collection resides
     * - "index": the index value to be checked
     */
    fluid.defaults("sjrk.storyTelling.transforms.valueOrIndex", {
        "gradeNames": ["fluid.standardTransformFunction"],
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
