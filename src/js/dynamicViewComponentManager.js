/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.dynamicViewComponentManager", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            managedViewComponents: ".sjrk-dynamic-view-component"
        },
        events: {
            viewComponentContainerRequested: null,
            viewComponentContainerAppended: null,
            viewComponentCreated: null,
            viewComponentRegisteredWithManager: null,
            viewComponentDestroyed: null,
            viewComponentContainerRemoved: null,
            viewComponentDeregisteredWithManager: null
        },
        members: {
            // key: compent individual class
            // value: direct reference to the component
            managedViewComponentRegistry: {
            }
        },
        dynamicComponents: {
            managedViewComponents: {
                type: "fluid.viewComponent",
                container: "{arguments}.0",
                createOnEvent: "viewComponentContainerAppended",
                options: {
                    managedViewComponentDetails: {
                        containerSelector: "{arguments}.0",
                        containerIndividualClass: "{arguments}.1",
                        guid: "{arguments}.2"
                    },
                    listeners: {
                        "onCreate.notifyManager": {
                            func: "{dynamicViewComponentManager}.events.viewComponentCreated",
                            args: ["{that}"]
                        },
                        "onDestroy.notifyManager": {
                            func: "{dynamicViewComponentManager}.events.viewComponentDestroyed",
                            args: ["{that}.options.managedViewComponentDetails.containerSelector", "{that}.options.managedViewComponentDetails.containerIndividualClass"]
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
                "args": ["{that}", "{that}.events.viewComponentContainerAppended"]
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

        var componentContainerIndividualClass = managedComponent.options.managedViewComponentDetails.containerIndividualClass;

        that.managedViewComponentRegistry[componentContainerIndividualClass] = managedComponent;

        completionEvent.fire();
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

    sjrk.dynamicViewComponentManager.addComponentContainer = function (that, completionEvent) {

        var guid = fluid.allocateGuid();

        var containerIndividualClass = fluid.stringTemplate(that.options.dynamicViewComponentManagerOptions.containerIndividualClassTemplate, {guid: guid});

        var containerMarkup = sjrk.dynamicViewComponentManager.getContainerMarkup(that.options.dynamicViewComponentManagerOptions.containerGlobalClass, containerIndividualClass);

        that.container.append(containerMarkup);

        var containerSelector = "." + containerIndividualClass;

        completionEvent.fire(containerSelector, containerIndividualClass, guid);
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
