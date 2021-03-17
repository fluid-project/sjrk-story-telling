/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // used to create and keep track of dynamic view components
    fluid.defaults("sjrk.dynamicViewComponentManager", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            managedViewComponents: ".sjrkc-dynamic-view-component"
        },
        events: {
            // single-argument event - requires a specified "type" for the
            // viewComponent
            viewComponentContainerRequested: null,
            viewComponentContainerAppended: null,
            viewComponentCreated: null,
            viewComponentRegisteredWithManager: null,
            viewComponentDestroyed: null,
            viewComponentContainerRemoved: null,
            viewComponentDeregisteredWithManager: null
        },
        members: {
            managedViewComponentRegistry: {
                // key: component individual class
                // value: direct reference to the component
            }
        },
        dynamicComponents: {
            managedViewComponents: {
                type: "{arguments}.3",
                container: "{arguments}.0",
                createOnEvent: "viewComponentContainerAppended",
                options: {
                    managedViewComponentRequiredConfig: {
                        containerSelector: "{arguments}.0",
                        containerIndividualClass: "{arguments}.1",
                        guid: "{arguments}.2",
                        type: "{arguments}.3"
                    },
                    // An endpoint for storing additional configuration
                    // options by an implementing grade
                    additionalConfiguration: "{arguments}.4",
                    listeners: {
                        "onCreate.notifyManager": {
                            func: "{dynamicViewComponentManager}.events.viewComponentCreated",
                            args: ["{that}"]
                        },
                        "onDestroy.notifyManager": {
                            func: "{dynamicViewComponentManager}.events.viewComponentDestroyed",
                            args: ["{that}.options.managedViewComponentRequiredConfig.containerSelector", "{that}.options.managedViewComponentRequiredConfig.containerIndividualClass"]
                        }
                    }
                }
            }
        },
        dynamicViewComponentManagerOptions: {
            containerGlobalClass: "sjrkc-dynamic-view-component sjrk-dynamic-view-component",
            // Can use %guid
            containerIndividualClassTemplate: "sjrkc-dynamic-view-component-%guid"
        },
        listeners: {
            "viewComponentContainerRequested.addComponentContainer": {
                "funcName": "sjrk.dynamicViewComponentManager.addComponentContainer",
                "args": ["{that}", "{that}.events.viewComponentContainerAppended", "{arguments}.0", "{arguments}.1"]
            },
            "viewComponentCreated.registerManagedViewComponent": {
                func: "sjrk.dynamicViewComponentManager.registerManagedViewComponent",
                args: ["{that}", "{arguments}.0", "{dynamicViewComponentManager}.events.viewComponentRegisteredWithManager"]
            },
            "viewComponentDestroyed.removeComponentContainer": {
                "funcName": "sjrk.dynamicViewComponentManager.removeComponentContainer",
                "args": ["{that}", "{arguments}.0", "{arguments}.1", "{that}.events.viewComponentContainerRemoved"]
            },
            "viewComponentContainerRemoved.deregisterManagedViewComponent": {
                func: "sjrk.dynamicViewComponentManager.deregisterManagedViewComponent",
                args: ["{that}", "{arguments}.0", "{dynamicViewComponentManager}.events.viewComponentDeregisteredWithManager"]
            }
        }
    });

    /**
     * Registers a new view component with the dynamicViewComponentManager and
     * fires a given event upon successful completion
     *
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     * @param {Component} newViewComponent - the new fluid.viewComponent to register
     * @param {Object} completionEvent - the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.registerManagedViewComponent = function (that, newViewComponent, completionEvent) {
        var componentContainerIndividualClass = newViewComponent.options.managedViewComponentRequiredConfig.containerIndividualClass;

        that.managedViewComponentRegistry[componentContainerIndividualClass] = newViewComponent;

        completionEvent.fire(componentContainerIndividualClass);
    };

    /**
     * De-registers a view component, specified by its CSS control selector, from the
     * dynamicViewComponentManager's managed view component registry
     *
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     * @param {String} managedComponentIndividualClass - the CSS control class of the view component
     * @param {Object} completionEvent - the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.deregisterManagedViewComponent = function (that, managedComponentIndividualClass, completionEvent) {
        var managedViewComponentRegistry = that.managedViewComponentRegistry;
        fluid.remove_if(managedViewComponentRegistry, function (component, key) {
            return key === managedComponentIndividualClass;
        });

        completionEvent.fire();
    };

    /**
     * Removes the DOM element which contains the view component specified by
     * the CSS control selector
     *
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     * @param {String} componentContainerSelector - the CSS selector of the DOM container
     * @param {String} componentContainerIndividualClass - the CSS selector of the view component
     * @param {Object} completionEvent - the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.removeComponentContainer = function (that, componentContainerSelector, componentContainerIndividualClass, completionEvent) {
        var removedComponentContainer = that.container.find(componentContainerSelector);

        removedComponentContainer.remove();

        completionEvent.fire(componentContainerIndividualClass);
    };

    /**
     * Adds a DOM container element to hold a new view component.
     * Each new container is given a unique ID.
     * @param {Component} that - an instance of sjrk.dynamicViewComponentManager
     * @param {Object} completionEvent - the event to be fired upon successful completion
     * @param {String} type - the fully-qualified grade name of the viewComponent
     * @param {Object} additionalConfiguration - used to specify additional configuration keys on the newly-created view component
     */
    sjrk.dynamicViewComponentManager.addComponentContainer = function (that, completionEvent, type, additionalConfiguration) {
        var guid = fluid.allocateGuid();
        var containerIndividualClass = fluid.stringTemplate(that.options.dynamicViewComponentManagerOptions.containerIndividualClassTemplate, {guid: guid});
        var containerMarkup = sjrk.dynamicViewComponentManager.getContainerMarkup(that.options.dynamicViewComponentManagerOptions.containerGlobalClass, containerIndividualClass);
        var containerSelector = "." + containerIndividualClass;

        that.container.append(containerMarkup);

        completionEvent.fire(containerSelector, containerIndividualClass, guid, type, additionalConfiguration);
    };

    /**
     * Generates the HTML markup for the DOM element in which new view
     * components are held.
     *
     * @param {String} containerGlobalClass - a CSS selector which all of the view components will share
     * @param {String} containerIndividualClass - a CSS selector unique to this particular view component
     *
     * @return {String} - the generated markup content
     */
    sjrk.dynamicViewComponentManager.getContainerMarkup = function (containerGlobalClass, containerIndividualClass) {
        var guid = fluid.allocateGuid();

        var containerMarkup = fluid.stringTemplate("<div class='%globalClass %indivualClass'></div>", {
            globalClass: containerGlobalClass,
            indivualClass: containerIndividualClass,
            guid: guid
        });

        return containerMarkup;
    };

})(jQuery, fluid);
