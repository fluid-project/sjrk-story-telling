/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    sjrk.storyTelling.testUtils = {};
    sjrk.storyTelling.testUtils.changeForm = function (component, selector, value) {
        component.locate(selector).val(value).change();
    };

})(jQuery, fluid);
