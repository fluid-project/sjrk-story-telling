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
        gradeNames: ["fluid.component"],
        components: {
            storyBrowser: {
                type: "sjrk.storyTelling.ui.storyBrowser",
                container: ".sjrkc-storyTelling-story-browser",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../.."
                                }
                            }
                        }
                    }
                }
            },
            pageShell: {
                type: "sjrk.storyTelling.pageShell",
                options: {
                    events: {
                        onAllUiComponentsReady: {
                            events: {
                                onBrowserReady: "{storyBrowser}.events.onControlsBound"
                            }
                        }
                    },
                    modelRelay: [{
                        source: "{that}.model.uiLanguage",
                        target: "{storyBrowser}.templateManager.model.locale",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }]
                }
            }
        }
    });

})(jQuery, fluid);
