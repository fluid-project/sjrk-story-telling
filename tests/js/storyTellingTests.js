/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    jqUnit.test("Test tagInputStringToArray function", function () {
        jqUnit.expect(2);

        var delimiter = ",";
        var expectedArray = ["tag1","tag2"];
        var tagArray = sjrk.storyTelling.tagInputStringToArray("tag1, tag2",delimiter);
        var tagArrayNoSpace = sjrk.storyTelling.tagInputStringToArray("tag1,tag2",delimiter);

        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArray);
        jqUnit.assertDeepEq("Generated array values are as expected", expectedArray, tagArrayNoSpace);
    });

    jqUnit.test("Test tagArrayToDisplayString function", function () {
        jqUnit.expect(1);

        var expectedString = "tag1, tag2";
        var tagString = sjrk.storyTelling.tagArrayToDisplayString(["tag1","tag2"],", ", true);

        jqUnit.assertEquals("Generated array values are as expected", expectedString, tagString);
    });

})(jQuery, fluid);
