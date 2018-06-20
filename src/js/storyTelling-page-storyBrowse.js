/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.page"],
        model: {
            storyBrowseDisplayPreference: ""
        },
        events: {
            onAllUiComponentsReady: {
                events: {
                    onBrowserReady: "{storyBrowser}.events.onControlsBound"
                }
            }
        },
        components: {
            storyBrowser: {
                type: "sjrk.storyTelling.ui.storyBrowser",
                container: ".sjrkc-storyTelling-story-browser",
                options: {
                    listeners: {
                        "onViewChangeRequested.savePreference": {
                            func: "{storyBrowse}.applier.change",
                            args: ["storyBrowseDisplayPreference", "{arguments}.0.data"],
                            priority: "first"
                        }
                    },
                    components: {
                        templateManager: {
                            options: {
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{storyBrowser}.model", "{storyBrowser}.options.browserConfig", "{storyBrowse}.model"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
