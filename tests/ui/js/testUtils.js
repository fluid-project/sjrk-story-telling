/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global jqUnit, sinon */

"use strict";

(function ($, fluid) {

    fluid.registerNamespace("sjrk.storyTelling.testUtils");

    /**
     * Changes the content of a specified HTML element to the given value.
     * This is abstracted to a utility function in order to use it with fluid-binder
     * when setting up tests. It triggers the change event in order to ensure
     * the form value is relayed to the model, as val on its own does not.
     *
     * @param {Component} component - an instance of fluid.viewComponent
     * @param {String} selector - the infusion selector of the element
     * @param {String} value - the value to which the element will be set using jQuery val()
     */
    sjrk.storyTelling.testUtils.changeFormElement = function (component, selector, value) {
        component.locate(selector).val(value).change();
    };

    /**
     * Verifies that specified UI steps are visible or hidden in the DOM.
     * The steps are DOM elements, but could be entire UI grades or internal to them.
     * Visible is taken to mean "display: block" and hidden is "display: none".
     *
     * @param {jQuery[]} expectedHidden - a collection of elements which should be hidden
     * @param {jQuery[]} expectedVisible - a collection of elements which should be visible
     */
    sjrk.storyTelling.testUtils.verifyStepVisibility = function (expectedHidden, expectedVisible) {
        fluid.each(expectedHidden, function (el) {
            sjrk.storyTelling.testUtils.assertElementVisibility(el, "none");
        });

        fluid.each(expectedVisible, function (el) {
            sjrk.storyTelling.testUtils.assertElementVisibility(el, "block");
        });
    };

    /**
     * Asserts that an individual DOM element has a given visibility state
     * according to its css "display" value. Uses jqUnit for the assertion.
     *
     * @param {jQuery} element - the DOM element to be tested
     * @param {String} expectedVisibility - the display state which is expected
     */
    sjrk.storyTelling.testUtils.assertElementVisibility = function (element, expectedVisibility) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected visibility", expectedVisibility, element.css("display"));
    };

    /**
     * Asserts that an individual DOM element has a given value for a given propery
     * according to the jQuery prop() function. Uses jqUnit for the assertion.
     *
     * @param {jQuery} element - the DOM element to be tested
     * @param {String} propertyName - the property to be checked
     * @param {String} expectedValue - the expected value of the property
     */
    sjrk.storyTelling.testUtils.assertElementPropertyValue = function (element, propertyName, expectedValue) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected property value", expectedValue, element.prop(propertyName));
    };

    /**
     * Asserts that an individual DOM element has a given text value
     * according to the jQuery text() function. Uses jqUnit for the assertion.
     *
     * @param {jQuery} element - the DOM element to be tested
     * @param {String} expectedText - the expected text value of the element
     */
    sjrk.storyTelling.testUtils.assertElementText = function (element, expectedText) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected text", expectedText, element.text());
    };

    /**
     * Asserts that an individual DOM element has a given value
     * according to the jQuery val() function. Uses jqUnit for the assertion.
     * @param {jQuery} element - the DOM element to be tested
     * @param {String} expectedValue - the expected value of the element
     */
    sjrk.storyTelling.testUtils.assertElementValue = function (element, expectedValue) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected value", expectedValue, element.val());
    };

    /**
     * Asserts that an individual DOM element has a given CSS class applied,
     * according to the jQuery hasClass() function. Uses jqUnit for the assertion.
     *
     * @param {jQuery} element - the DOM element to be tested
     * @param {String} className - the name of the class for which to check
     * @param {Boolean} isExpectedToHaveClass - true if the element is expected to have the class
     */
    sjrk.storyTelling.testUtils.assertElementHasClass = function (element, className, isExpectedToHaveClass) {
        jqUnit.assertEquals("The element " + sjrk.storyTelling.testUtils.getElementName(element) + " has expected class", isExpectedToHaveClass, element.hasClass(className));
    };

    /**
     * Runs a given assertion function for an element for which we only have
     * a CSS selector. The assertion function is assumed to take an element
     * as its first argument.
     *
     * @param {String} selector - the CSS selector
     * @param {String} assertFunctionName - the name of the assertion function to call
     * @param {Object} assertionArguments - arguments for the assertionFunction, except "el"
     */
    sjrk.storyTelling.testUtils.assertFromSelector = function (selector, assertFunctionName, assertionArguments) {
        var el = $(selector);

        assertionArguments.unshift(el); //make "el" the first argument

        var assertFunction = fluid.getGlobalValue(assertFunctionName);

        if (typeof assertFunction === "function") {
            assertFunction.apply(null, assertionArguments);
        }
    };

    /**
     * Returns a "friendly" name for the given element, when available
     *
     * @param {jQuery} element - the DOM element for which the friendly name is to be returned
     *
     * @return {String} - the friendly name for the element
     */
    sjrk.storyTelling.testUtils.getElementName = function (element) {
        return element.selectorName || element.selector || element.toString();
    };

    /**
     * Checks the "select block" checkboxes for blockUi's in a given blockManager.
     * It will select either all of the blocks or only the first one.
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {Boolean} checkFirstBlockOnly - if truthy, only checks the first block's box
     */
    sjrk.storyTelling.testUtils.checkBlockCheckboxes = function (blockManager, checkFirstBlockOnly) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");

        if (checkFirstBlockOnly) {
            sjrk.storyTelling.testUtils.checkSingleBlockCheckbox(managedComponentRegistryAsArray[0]);
        } else {
            fluid.each(managedComponentRegistryAsArray, function (managedComponent) {
                sjrk.storyTelling.testUtils.checkSingleBlockCheckbox(managedComponent);
            });
        }
    };

    /**
     * Checks the "select block" checkbox for a given blockUi
     *
     * @param {Component} block - the sjrk.storyTelling.blockUi whose checkbox we wish to become checked
     */
    sjrk.storyTelling.testUtils.checkSingleBlockCheckbox = function (block) {
        var checkBox = block.locate("selectedCheckbox");
        checkBox.prop("checked", true);
    };

    /**
     * Verifies that a given blockUi was indeed added to the blockManager
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {String} addedBlockKey - a unique key which is provided when a new block is added
     * @param {String} expectedGrade - the expected grade/type of the newly-added blockUi
     */
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

    /**
     * Verifies that the blockManager has the expected number of blocks after a
     * call to remove blocks was made
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {Number} expectedNumberOfBlocks - the expected number of blocks after removal
     */
    sjrk.storyTelling.testUtils.verifyBlocksRemoved = function (blockManager, expectedNumberOfBlocks) {
        var managedComponentRegistryAsArray = fluid.hashToArray(blockManager.managedViewComponentRegistry, "managedComponentKey");
        jqUnit.assertEquals("Number of remaining blocks is expected #: " + expectedNumberOfBlocks, expectedNumberOfBlocks, managedComponentRegistryAsArray.length);
    };

    /**
     * Retrieves the specified block component from the blockManager's registry.
     * Since the order is determined by the order of the keys alone, it may not
     * coincide with the block order values or order within the story model
     *
     * @param {Component} blockManager - an instance of sjrk.dynamicViewComponentManager
     * @param {Number} index - the index of the block to retrieve (zero-based)
     *
     * @return {Component} - the sjrk.storyTelling.blockUi at the specified index
     */
    sjrk.storyTelling.testUtils.getBlockByIndex = function (blockManager, index) {
        return Object.values(blockManager.managedViewComponentRegistry)[index].block;
    };

    /**
     * Alters URL without pageload, via code from StackOverflow
     * {@link https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page}
     *
     * @param {String} queryString - the query string to append to the current page URL
     */
    sjrk.storyTelling.testUtils.setQueryString = function (queryString) {
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + queryString;
            window.history.pushState({ path:newurl }, "", newurl);
        }
    };

    // the mock server
    var mockServer;

    /**
     * Sets up a mock server response with given data for a given URL
     *
     * @param {String} url - the URL for which to set up a response
     * @param {Integer} statusCode - HTML status code to return
     * @param {String} contentType - the Content-Type to return in the response header
     * @param {Object} response - the data to include in the server response
     */
    sjrk.storyTelling.testUtils.addPathToMockServer = function (url, statusCode, contentType, response) {
        if (contentType === "application/json" && typeof(response) !== "string") {
            response = JSON.stringify(response);
        }
        mockServer.respondWith(url, [statusCode, { "Content-Type": contentType }, response]);
    };

    /**
     * Sets up a mock server and responding to the specified urls.
     *
     * @param {Object[]} urlConfig - an Object or array of Objects containing configuration for URL and responses.
     *                               e.g.: {url: "url", statusCode: 200, contentType: "application/json", response: ""}
     * @param {Boolean} [respondManually] - (optional) if true, server will respond immediately to requests
     *                               @see {@link https://sinonjs.org/releases/v9.2.1/fake-xhr-and-server/#serverrespondimmediately--true}
     */
    sjrk.storyTelling.testUtils.setupMockServer = function (urlConfig, respondManually) {
        mockServer = sinon.createFakeServer();

        mockServer.respondImmediately = !respondManually;

        // Prevents the ajax requests from appending a time stamp to prevent caching.
        // This timestamp prevents sinon mockserver from matching the requests.
        $.ajaxPrefilter(function (options) {
            options.cache = true;
        });

        urlConfig = fluid.makeArray(urlConfig);

        fluid.each(urlConfig, function (config) {
            sjrk.storyTelling.testUtils.addPathToMockServer(
                config.url,
                config.statusCode || 200,
                config.contentType || "application/json",
                config.response || "{}"
            );
        });
    };

    /**
     * Directs the mock server to send all queued responses. For more info,
     * @see {@link https://sinonjs.org/releases/v9.2.1/fake-xhr-and-server/#serverrespond}
     */
    sjrk.storyTelling.testUtils.sendMockServerResponse = function () {
        mockServer.respond();
    };

    /**
     * Stops the remote server and hands any previously set-up routes back to Kettle
     */
    sjrk.storyTelling.testUtils.teardownMockServer = function () {
        mockServer.restore();
    };

    /**
     * Resets the specified cookie
     *
     * @param {Component} cookieName - the cookie to be reset
     */
    sjrk.storyTelling.testUtils.resetCookie = function (cookieName) {
        // setting the cookie expiry to epoch in order to delete it
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    /**
     * Resets the page preferences and clears the page model, with event hooks
     * before and after the reset
     *
     * @param {Component} pageComponent - the `sjrk.storyTelling.base.page` to be reset
     */
    sjrk.storyTelling.testUtils.resetPreferences = function (pageComponent) {
        var transaction = pageComponent.applier.initiate();
        pageComponent.events.beforePreferencesReset.fire(pageComponent);
        transaction.fireChangeRequest({path: "", type: "DELETE"});
        transaction.change("", fluid.copy(pageComponent.initialModel));
        transaction.commit();

        sjrk.storyTelling.testUtils.resetCookie(pageComponent.cookieStore.options.cookie.name);

        pageComponent.events.onPreferencesReset.fire(pageComponent);
    };

})(jQuery, fluid);
