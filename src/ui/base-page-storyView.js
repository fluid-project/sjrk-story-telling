/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    fluid.defaults("sjrk.storyTelling.base.page.storyView", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        events: {
            onAllUiComponentsReady: {
                events: {
                    onViewerReady: "{storyViewer}.events.onControlsBound"
                }
            }
        },
        listeners: {
            "{storyViewer}.events.onStoryListenToRequested": {
                func: "{that}.events.onStoryListenToRequested.fire",
                namespace: "escalate"
            }
        },
        components: {
            storySpeaker: {
                options: {
                    modelRelay: {
                        target: "{that}.model.ttsText",
                        singleTransform: {
                            type: "fluid.transforms.stringTemplate",
                            template: "{storyViewer}.templateManager.options.templateStrings.localizedMessages.message_readStoryText",
                            terms: "{storyViewer}.story.model"
                        }
                    }
                }
            },
            // the story view context
            storyViewer: {
                type: "sjrk.storyTelling.ui.storyViewer",
                container: ".sjrkc-st-story-viewer"
            }
        }
    });

})(jQuery, fluid);
