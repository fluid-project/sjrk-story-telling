/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk, jqUnit */

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("sjrk.storyTelling.testUtils");

    /* Changes the content of a specified HTML element to the given value.
     * This is abstracted to a utility function in order to use it with gpii-binder
     * when setting up tests. It triggers the change event in order to ensure
     * the form value is relayed to the model, as val on its own does not.
     * - "component": the infusion component containing the element
     * - "selector": the infusion selector of the element
     * - "value": the value to which the element will be set using jQuery val()
     */
    sjrk.storyTelling.testUtils.changeFormElement = function (component, selector, value) {
        component.locate(selector).val(value).change();
    };

    /* Verifies that specified UI "pages" are visible or hidden in the DOM.
     * The pages are DOM elements, but could be entire UI grades or internal to them.
     * Visible is taken to mean "display: block" and hidden is "display: none".
     * - "expectedHidden": a collection of elements which should be hidden
     * - "expectedVisible": a collection of elements which should be visible
     */
    sjrk.storyTelling.testUtils.verifyPageVisibility = function (expectedHidden, expectedVisible) {
        fluid.each(expectedHidden, function (el) {
            sjrk.storyTelling.testUtils.assertElementVisibility(el, "none");
        });

        fluid.each(expectedVisible, function (el) {
            sjrk.storyTelling.testUtils.assertElementVisibility(el, "block");
        });
    };

    /* Asserts that an individual DOM element has a given visibility state
     * according to its css "display" value. Uses jqUnit for the assertion.
     * - "element": the DOM element to be tested
     * - "expectedVisibility": the display state which is expected
     */
    sjrk.storyTelling.testUtils.assertElementVisibility = function (element, expectedVisibility) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected visibility", expectedVisibility, element.css("display"));
    };

    /* Asserts that an individual DOM element has a given text value
     * according to the jQuery text() function. Uses jqUnit for the assertion.
     * - "element": the DOM element to be tested
     * - "expectedText": the expected text value of the element
     */
    sjrk.storyTelling.testUtils.assertElementText = function (element, expectedText) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected text", expectedText, element.text());
    };

    /* Asserts that an individual DOM element has a given value
     * according to the jQuery val() function. Uses jqUnit for the assertion.
     * - "element": the DOM element to be tested
     * - "expectedValue": the expected value of the element
     */
    sjrk.storyTelling.testUtils.assertElementValue = function (element, expectedValue) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected value", expectedValue, element.val());
    };

    /* Returns a "friendly" name for the given element, when available
     * - "element": the DOM element for which the friendly name is to be returned
     */
    sjrk.storyTelling.testUtils.getElementName = function (element) {
        return element.selectorName || element.selector || element.toString();
    };

    // TODO: this doesn't work because of speed of execution and asynchronous
    // template loading - need to delay on this until the blocks have loaded
    // their content, because until then they don't have checkboxes!
    // TODO: document this function
    sjrk.storyTelling.testUtils.checkFirstBlockCheckbox = function (blockManager) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");
        var checkBox = managedComponentRegistryAsArray[0].locate("selectedCheckbox");

        checkBox.prop("checked", true);
    };

    // TODO: document this function
    sjrk.storyTelling.testUtils.verifyBlockAdded = function (blockManager, addedBlockKey, expectedGrade) {

        var blockComponent = blockManager.managedViewComponentRegistry[addedBlockKey];

        // Verify the block is added to the manager's registry
        jqUnit.assertNotNull("New block added to manager's registry", blockComponent);

        // Verify the block's type is correct
        jqUnit.assertEquals("Block's dynamicComponent type is expected " + expectedGrade, expectedGrade,  blockComponent.options.managedViewComponentRequiredConfig.type);

        // Verify the block is added to the DOM
        var newBlock = blockManager.container.find("." + addedBlockKey);
        jqUnit.assertTrue("New block added to DOM", newBlock.length > 0);
    };

    // TODO: document this function
    sjrk.storyTelling.testUtils.verifyBlocksRemoved = function (blockManager, removedBlockKeys, expectedNumberOfBlocks) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");
        jqUnit.assertEquals("Number of remaining blocks is expected #: " + expectedNumberOfBlocks, expectedNumberOfBlocks, managedComponentRegistryAsArray.length);
    };

})(jQuery, fluid);
