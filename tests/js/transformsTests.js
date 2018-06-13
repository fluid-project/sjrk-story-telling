/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, jqUnit */

(function ($, fluid) {

    "use strict";

    jqUnit.test("Test stringToArray transform function", function () {
        jqUnit.expect(2);

        var expectedArray = ["tag1","tag2"];

        var stringToArrayTransform = {
            transform: {
                type: "sjrk.storyTelling.transforms.stringToArray",
                inputPath: "inputString"
            }
        };

        var tagArray = fluid.model.transformWithRules(
            {inputString: "tag1,tag2"},
            {output: stringToArrayTransform}
            ).output;

        var tagArrayNoSpace = fluid.model.transformWithRules(
            {inputString: "tag1, tag2"},
            {output: stringToArrayTransform}
            ).output;

        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArray);
        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArrayNoSpace);
    });

    jqUnit.test("Test tagArrayToDisplayString function", function () {
        jqUnit.expect(1);

        var arrayToStringTransform = {
            transform: {
                type: "sjrk.storyTelling.transforms.arrayToString",
                inputPath: "sourceArray"
            }
        };

        var expectedString = "tag1, tag2";

        var tagString = fluid.model.transformWithRules(
            {sourceArray: ["tag1", "tag2"]},
            {tagString: arrayToStringTransform}
            ).tagString;

        jqUnit.assertEquals("Generated array values are as expected", expectedString, tagString);
    });

})(jQuery, fluid);
