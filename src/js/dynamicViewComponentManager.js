/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

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

    sjrk.dynamicViewComponentManager.registerManagedViewComponent = function (that, managedComponent, completionEvent) {

        var componentContainerIndividualClass = managedComponent.options.managedViewComponentRequiredConfig.containerIndividualClass;

        that.managedViewComponentRegistry[componentContainerIndividualClass] = managedComponent;

        completionEvent.fire(componentContainerIndividualClass);
    };

    sjrk.dynamicViewComponentManager.deregisterManagedViewComponent = function (that, managedComponentIndividualClass, completionEvent) {
        var managedViewComponentRegistry = that.managedViewComponentRegistry;
        fluid.remove_if(managedViewComponentRegistry, function (component, key) {
            return key === managedComponentIndividualClass;
        });

        completionEvent.fire();
    };

    sjrk.dynamicViewComponentManager.removeComponentContainer = function (that, componentContainerSelector, componentContainerIndividualClass, completionEvent) {

        var removedComponentContainer = that.container.find(componentContainerSelector);

        removedComponentContainer.remove();

        completionEvent.fire(componentContainerIndividualClass);
    };

    sjrk.dynamicViewComponentManager.addComponentContainer = function (that, completionEvent, type, additionalConfiguration) {

        var guid = fluid.allocateGuid();

        var containerIndividualClass = fluid.stringTemplate(that.options.dynamicViewComponentManagerOptions.containerIndividualClassTemplate, {guid: guid});

        var containerMarkup = sjrk.dynamicViewComponentManager.getContainerMarkup(that.options.dynamicViewComponentManagerOptions.containerGlobalClass, containerIndividualClass);

        that.container.append(containerMarkup);

        var containerSelector = "." + containerIndividualClass;

        completionEvent.fire(containerSelector, containerIndividualClass, guid, type, additionalConfiguration);
    };

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
