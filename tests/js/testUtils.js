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

    fluid.registerNamespace("sjrk.storyTelling.testUtils");

    /*
     * Used to change the content of a specified HTML element to the given value.
     * This is abstracted to a utility function in order to use it with gpii-binder
     * when setting up tests. It triggers the change event in order to ensure
     * the form value is relayed to the model, as val on its own does not.
     */
    sjrk.storyTelling.testUtils.changeFormElement = function (component, selector, value) {
        component.locate(selector).val(value).change();
    };

})(jQuery, fluid);
