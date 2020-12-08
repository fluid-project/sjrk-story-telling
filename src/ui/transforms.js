/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    fluid.registerNamespace("sjrk.storyTelling.transforms");

    fluid.defaults("sjrk.storyTelling.transforms.stringToArray", {
        gradeNames: ["fluid.standardTransformFunction"],
        invertConfiguration: "sjrk.storyTelling.transforms.stringToArray.invert"
    });

    /**
     * A transform to turn a delimited string into an array. If input is not a
     * string, then it will return an empty array.
     * It is partly invertible via "sjrk.storyTelling.transforms.arrayToString".
     *
     * @param {Object} input - the input for the transform function, unused
     * @param {Object} [transformSpec] - (optional) specifications for the transformation function. Takes properities:
     * @param {String} [transformSpec.delimiter] - (optional) the delimiter of terms within the given strings, defaults
     *                                             to ","
     * @param {Boolean} [transformSpec.trim] - (optional) flag to trim excess whitespace from each term. defaults to true
     *
     * @return {String[]} - the resulting array of strings split according to the transformSpec
     */
    sjrk.storyTelling.transforms.stringToArray = function (input, transformSpec) {
        if (!input || typeof input !== "string") {
            return [];
        }

        var resultArray = input.split(transformSpec.delimiter || ",");

        var trimTerms = fluid.isValue(transformSpec.trim) ? transformSpec.trim : true;
        if (trimTerms) {
            return fluid.transform(resultArray, function (term) {
                return term.trim();
            });
        }

        return resultArray;
    };

    sjrk.storyTelling.transforms.stringToArray.invert = function (transformSpec) {
        transformSpec.type = "sjrk.storyTelling.transforms.arrayToString";
        return transformSpec;
    };

    fluid.defaults("sjrk.storyTelling.transforms.arrayToString", {
        gradeNames: ["fluid.standardTransformFunction"],
        invertConfiguration: "sjrk.storyTelling.transforms.arrayToString.invert"
    });

    /**
     * A transform to turn an array into a delimited string.
     * Values can also be accessed via a specific object path relative to each term.
     * It is partly invertible via "sjrk.storyTelling.transforms.stringToArray".
     *
     * @param {String[]} input - the input for the transform function, unused
     * @param {Object} [transformSpec] - (optional) specifications for the transformation function
     * @param {String} [transformSpec.delimiter] - (optional) the delimiter to be inserted between each term. defaults to
     *                                              ", "
     * @param {Boolean} [transformSpec.stringOnly] - (optional) flag to allow only non-empty strings. defaults to true
     * @param {String} [transformSpec.path] - (optional) an EL path on each item in the terms collection
     *
     * @return {String} - the resulting string compiled according to the transformSpec
     */
    sjrk.storyTelling.transforms.arrayToString = function (input, transformSpec) {
        var delimiter = transformSpec.delimiter || ", ",
            stringOnly = fluid.isValue(transformSpec.stringOnly) ? transformSpec.stringOnly : true,
            path = transformSpec.path || "";

        var terms = [];

        fluid.each(input, function (term) {
            term = fluid.get(term, path);

            if (!stringOnly || (term !== "" && typeof term === "string")) {
                terms.push(term);
            }
        });

        return terms.join(delimiter);
    };

    sjrk.storyTelling.transforms.arrayToString.invert = function (transformSpec) {
        transformSpec.type = "sjrk.storyTelling.transforms.stringToArray";
        return transformSpec;
    };

    fluid.defaults("sjrk.storyTelling.transforms.valueOrIndex", {
        "gradeNames": ["fluid.standardTransformFunction"],
        "inputVariables": {
            "component": null,
            "path": null,
            "index": null
        }
    });

    /**
     * A transform which, given a collection and an index, will the value of the
     * collection at the specified index or, if that is not truthy, the index itself
     *
     * @param {Object} input - the input for the transform function, unused
     * @param {Object} extraInputs - a collection of extra input values
     * @param {Object} extraInputs.component - the component with the collection
     * @param {String} extraInputs.path - the EL path on the component where the collection resides
     * @param {String|Number} extraInputs.index - the index value to be checked
     *
     * @return {Any} - the value of a collection at a given index or the index itself
     */
    sjrk.storyTelling.transforms.valueOrIndex = function (input, extraInputs) {
        var component = extraInputs.component();
        var path = extraInputs.path();
        var index = extraInputs.index();

        return fluid.get(component, path)[index] || index;
    };

    /*
     * A transform which, given a value, will return the logical `not` of that value
     * This is achieved via a simple "!" (not) operator, there is no fancy logic
     * to deal with particular types of data.
     * - "input": the value to negate
     */
    fluid.defaults("sjrk.storyTelling.transforms.not", {
        gradeNames: ["fluid.standardTransformFunction"],
        invertConfiguration: "sjrk.storyTelling.transforms.not.invert"
    });

    sjrk.storyTelling.transforms.not = function (input) {
        return !input;
    };

    sjrk.storyTelling.transforms.not.invert = function (transformSpec) {
        transformSpec.type = "sjrk.storyTelling.transforms.not";
        return transformSpec;
    };

})(jQuery, fluid);
