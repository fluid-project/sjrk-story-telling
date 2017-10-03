/*
Copyright 2017 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/waharnum/sjrk-storyTelling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    fluid.defaults("sjrk.storyTelling.handlebars", {
        gradeNames: ["gpii.handlebars.renderer.standalone", "sjrk.storyTelling.storyAuthoring"],
        // gradeNames: ["gpii.handlebars.serverAware", "sjrk.storyTelling.storyAuthoring"],
        listeners: {
            "onStoryEditorReady.logit": {
                "this": "console",
                "method": "log",
                "args": ["{that}"]
            },
            "onStoryEditorReady.renderTemplate": {
                "funcName": "{that}.html",
                "args": [
                    "{that}.dom.storyTestArea",
                    "myPage",
                    "@expand:JSON.parse({that}.storyEditor.resourceLoader.resources.componentMessages.resourceText)"]
            }
        },
        templates: {
            layouts: {
                main: "{{body}}"
            },
            pages: {
                myPage: "<div><p>{{message_storyHeading}}</p></div>"
            },
            partials: {
                item: "{{test}}"
            }
        }
        //templateUrl:  "src/views/partials/test.handlebars"
    });

})(jQuery, fluid);
