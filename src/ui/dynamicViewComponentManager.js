/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

    // used to create and keep track of dynamic view components
    fluid.defaults("sjrk.dynamicViewComponentManager", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            managedViewComponents: ".sjrk-dynamic-view-component"
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
            containerGlobalClass: "sjrk-dynamic-view-component",
            // Can use %guid
            containerIndividualClassTemplate: "sjrk-dynamic-view-component-%guid"
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

    /* Registers a new view component with the dynamicViewComponentManager and
     * fires a given event upon successful completion
     * - "that": the dynamicViewComponentManager itself
     * - "managedComponent": the new view component to register
     * - "completionEvent": the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.registerManagedViewComponent = function (that, managedComponent, completionEvent) {
        var componentContainerIndividualClass = managedComponent.options.managedViewComponentRequiredConfig.containerIndividualClass;

        that.managedViewComponentRegistry[componentContainerIndividualClass] = managedComponent;

        completionEvent.fire(componentContainerIndividualClass);
    };

    /* De-registers a view component, specified by its CSS control selector, from the
     * dynamicViewComponentManager's managed view component registry
     * - "that": the dynamicViewComponentManager itself
     * - "managedComponentIndividualClass": the CSS control class of the view component
     * - "completionEvent": the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.deregisterManagedViewComponent = function (that, managedComponentIndividualClass, completionEvent) {
        var managedViewComponentRegistry = that.managedViewComponentRegistry;
        fluid.remove_if(managedViewComponentRegistry, function (component, key) {
            return key === managedComponentIndividualClass;
        });

        completionEvent.fire();
    };

    /* Removes the DOM element which contains the view component specified by
     * the CSS control selector
     * - "that": the dynamicViewComponentManager itself
     * - "componentContainerSelector": the CSS selector of the DOM container
     * - "componentContainerIndividualClass": the CSS selector of the view component
     * - "completionEvent": the event to be fired upon successful completion
     */
    sjrk.dynamicViewComponentManager.removeComponentContainer = function (that, componentContainerSelector, componentContainerIndividualClass, completionEvent) {
        var removedComponentContainer = that.container.find(componentContainerSelector);

        removedComponentContainer.remove();

        completionEvent.fire(componentContainerIndividualClass);
    };

    /* Adds a DOM container element to hold a new view component.
     * Each new container is given a unique ID.
     * - "that": the dynamicViewComponentManager itself
     * - "completionEvent": the event to be fired upon successful completion
     * - "type": the fully-qualified grade name of the viewComponent
     * - "additionalConfiguration": used to specify additional configuration keys
     *    on the newly-created view component
     */
    sjrk.dynamicViewComponentManager.addComponentContainer = function (that, completionEvent, type, additionalConfiguration) {
        var guid = fluid.allocateGuid();
        var containerIndividualClass = fluid.stringTemplate(that.options.dynamicViewComponentManagerOptions.containerIndividualClassTemplate, {guid: guid});
        var containerMarkup = sjrk.dynamicViewComponentManager.getContainerMarkup(that.options.dynamicViewComponentManagerOptions.containerGlobalClass, containerIndividualClass);
        var containerSelector = "." + containerIndividualClass;

        that.container.append(containerMarkup);

        completionEvent.fire(containerSelector, containerIndividualClass, guid, type, additionalConfiguration);
    };

    /* Generates the HTML markup for the DOM element in which new view
     * components are held.
     * - "containerGlobalClass": a CSS selector which all of the view components will share
     * - "containerIndividualClass": a CSS selector unique to this particular view component
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
