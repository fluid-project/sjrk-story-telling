/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

(function ($, fluid) {

    // a UI for listing and browsing stories
    fluid.defaults("sjrk.storyTelling.ui.storyBrowser", {
        gradeNames: ["sjrk.storyTelling.ui"],
        model: {
            // the list of stories to be browsed (actually just models)
            stories: null
            // This content is here to aid in work on styling/aesthetics
            // {
            //     story1: {
            //         title: "First story about something",
            //         author: "First Author",
            //         tags: ["Heart","Book"],
            //         contentTypes: ["text","image"]
            //     },
            //     story2: {
            //         title: "Second story about other things",
            //         author: "Second Author",
            //         tags: ["Cats"]
            //     },
            //     story3: {
            //         title: "Third story to try out a different thumbnail image",
            //         tags: ["Dots","Yayoi Kusama"],
            //         thumbnailUrl: "/tests/img/obliterationroom.jpg"
            //     },
            //     story4: {
            //         title: "Fourth story",
            //         author: "Fourth Author"
            //     },
            //     story5: {
            //         title: "Fifth story",
            //         tags: ["Dots"],
            //         thumbnailUrl: "/tests/img/obliterationroom.jpg"
            //     }
            // }
        },
        selectors: {
            linkList: ".sjrkc-st-browser-view-control-container",
            viewList: ".sjrkc-st-browser-stories",
            gridViewLink: ".sjrkc-st-browser-view-control-grid",
            listViewLink: ".sjrkc-st-browser-view-control-list"
        },
        events: {
            onViewChangeRequested: null,
            onViewChanged: null
        },
        listeners: {
            "onReadyToBind.bindGridViewRequest": {
                "this": "{that}.dom.gridViewLink",
                "method": "click",
                "args": ["grid", "{that}.events.onViewChangeRequested.fire"]
            },
            "onReadyToBind.bindListViewRequest": {
                "this": "{that}.dom.listViewLink",
                "method": "click",
                "args": ["list", "{that}.events.onViewChangeRequested.fire"]
            },
            "onViewChangeRequested.changeView": {
                func: "{that}.changeView",
                args: ["{arguments}.0.data"]
            }
        },
        browserConfig: {
            placeholderThumbnailUrl: "../img/icons/icon-globe.png",
            gridViewClassName: "grid"
        },
        invokers: {
            changeView: {
                "funcName": "sjrk.storyTelling.ui.storyBrowser.changeView",
                args: ["{that}",
                    "viewList",
                    "{arguments}.0",
                    "{that}.options.browserConfig.gridViewClassName",
                    "{that}.events.onViewChanged"]
            }
        },
        components: {
            // the templateManager for this UI
            templateManager: {
                options: {
                    model: {
                        dynamicValues: {
                            stories: "{storyBrowser}.model.stories",
                            placeholderThumbnailUrl: "{storyBrowser}.options.browserConfig.placeholderThumbnailUrl",
                            gridViewClassName: "{storyBrowser}.options.browserConfig.gridViewClassName"
                        }
                    },
                    templateConfig: {
                        templatePath: "%resourcePrefix/templates/storyBrowser.hbs"
                    }
                }
            }
        }
    });

    /**
     * Changes the view in the storyBrowser to be either a list or a grid of stories.
     * The default view is a list unless "grid" specified
     *
     * @param {Component} component - an instance of sjrk.storyTelling.ui.storyBrowser
     * @param {String} selector - the CSS selector for the view list
     * @param {String} displayPreference - the preference of which view to display ("grid" or "list")
     * @param {String} className - the class name that denotes the grid view is active
     * @param {Object} completionEvent - an event to fire upon completion
     */
    sjrk.storyTelling.ui.storyBrowser.changeView = function (component, selector, displayPreference, className, completionEvent) {
        if (displayPreference === "grid") {
            component.locate(selector).addClass(className);
            component.locate("linkList").addClass(className);
        } else {
            component.locate(selector).removeClass(className);
            component.locate("linkList" ).removeClass(className);
        }

        completionEvent.fire();
    };

})(jQuery, fluid);
