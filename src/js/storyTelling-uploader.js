/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

(function ($, fluid) {

    "use strict";

    // A simple single-file uploader to use with hidden <input type="file">
    // elements
    //
    // presumes indirect usage via the onUploadRequested event
    //
    // maintains a handle on both the current file and a constructed
    // object URL that can be used for client-side preview purposes,
    // presenting information in a custom style, etc
    //
    // This component is expected to be used with existing markup
    fluid.defaults("sjrk.storyTelling.block.singleFileUploader", {
        gradeNames: ["fluid.viewComponent"],
        members: {
            currentFile: null
        },
        // Holds a fileObjectURL for file preview purposes
        model: {
            fileObjectURL: null
        },
        events: {
            onUploadRequested: null,
            onFileChanged: null
        },
        selectors: {
            // Supplied by implementing component; this should be a
            // reference to an appropriate <input type="file">
            fileInput: null
        },
        listeners: {
            "onCreate.addFileInputChangeListener": {
                "this": "{that}.dom.fileInput",
                "method": "change",
                "args": ["{that}.handleFileInputChange"]
            },
            "onUploadRequested.clickHiddenFileInput": {
                "this": "{that}.dom.fileInput",
                "method": "click",
                "args": []
            },
            "onFileChanged.updateFileObjectURL": {
                "func": "sjrk.storyTelling.block.singleFileUploader.updateFileObjectURL",
                "args": ["{that}", "{that}.currentFile"]
            }
        },
        invokers: {
            "handleFileInputChange": {
                funcName: "sjrk.storyTelling.block.singleFileUploader.handleFileInputChange",
                args: ["{that}", "{that}.dom.fileInput"]
            }
        }
    });

    sjrk.storyTelling.block.singleFileUploader.handleFileInputChange = function (that, fileInput) {
        var fileList = fileInput[0].files;
        var currentFile = fileList[0];
        that.currentFile = currentFile;
        that.events.onFileChanged.fire();
    };

    sjrk.storyTelling.block.singleFileUploader.updateFileObjectURL = function (that, currentFile) {
        URL.revokeObjectURL(that.model.fileObjectURL);
        that.applier.change("fileObjectURL", URL.createObjectURL(currentFile));
    };

})(jQuery, fluid);    
