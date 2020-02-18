/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.base.page"],
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
                container: ".sjrkc-st-story-browser",
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
                                model: {
                                    dynamicValues: {
                                        storyBrowseDisplayPreference: "{storyBrowse}.model.storyBrowseDisplayPreference",
                                        templateConfig: "{that}.options.templateConfig"
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
