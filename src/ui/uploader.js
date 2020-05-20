/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid, sjrk */

"use strict";

(function ($, fluid) {

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
        model: {
            fileDetails: null,
            fileObjectUrl: null, // for file preview purposes
            serverUploadUrl: "/stories/",
            storyId: null // to be provided by implementing grade
        },
        events: {
            onFileSelectionRequested: null,
            onUploadRequested: null,
            onUploadComplete: null,
            onUploadError: null,
            onFileChanged: null
        },
        selectors: {
            // Supplied by implementing component; this should be a
            // reference to an appropriate <input type="file">
            fileInput: null
        },
        listeners: {
            "onCreate.addFileInputChangeListener": {
                this: "{that}.dom.fileInput",
                method: "change",
                args: ["{that}.handleFileInputChange"]
            },
            "onFileSelectionRequested.clickHiddenFileInput": {
                this: "{that}.dom.fileInput",
                method: "click",
                args: []
            },
            "onFileChanged.updateFileObjectInformation": {
                func: "sjrk.storyTelling.block.singleFileUploader.updateFileObjectInformation",
                args: ["{that}", "{that}.currentFile"]
            },
            "onFileChanged.uploadFileToServer": {
                func: "{that}.uploadFileToServer",
                args: ["{that}.currentFile"]
            },
            "onUploadComplete.updateFileURL": {
                func: "{that}.applier.change",
                args: ["fileObjectUrl", "{arguments}.0"]
            }
        },
        invokers: {
            "handleFileInputChange": {
                funcName: "sjrk.storyTelling.block.singleFileUploader.handleFileInputChange",
                args: ["{that}", "{that}.dom.fileInput"]
            },
            "uploadFileToServer": {
                funcName: "sjrk.storyTelling.block.singleFileUploader.uploadFileToServer",
                args: [
                    "{arguments}.0",
                    "{that}.model.storyId",
                    "{arguments}.1",
                    "{that}.model.serverUploadUrl",
                    "{that}.events.onUploadRequested",
                    "{that}.events.onUploadComplete",
                    "{that}.events.onUploadError"
                ]
            }
        }
    });

    /**
     * Updates the uploader's internal file representation with information
     * stored in the DOM's uploader element.
     *
     * @param {Component} that - an instance of sjrk.storyTelling.block.singleFileUploader
     * @param {jQuery} fileInput - the DOM uploader element
     */
    sjrk.storyTelling.block.singleFileUploader.handleFileInputChange = function (that, fileInput) {
        var fileList = fileInput[0].files;
        that.currentFile = fileList[0];
        that.events.onFileChanged.fire();
    };

    /**
     * Uploads the file to the server and sets the URL to the newly-saved
     * dynamic file name upon completion
     */
    sjrk.storyTelling.block.singleFileUploader.uploadFileToServer = function (fileToUpload, storyId, previousFile, serverUploadUrl, uploadingEvent, completionEvent, errorEvent) {
        if (fileToUpload) {
            // This is the easiest way to be able to submit form
            // content in the background via ajax
            var formData = new FormData();
            formData.append("file", fileToUpload);

            var fileUploadUrl = serverUploadUrl + storyId;

            uploadingEvent.fire();

            $.ajax({
                url         : fileUploadUrl,
                data        : formData,
                cache       : false,
                contentType : false,
                processData : false,
                type        : "POST",
                success     : function (data, textStatus, jqXHR) {
                    fluid.log(jqXHR, textStatus);

                    completionEvent.fire(data);
                },
                error       : function (jqXHR, textStatus, errorThrown) {
                    fluid.log(jqXHR, textStatus, errorThrown);

                    errorEvent.fire({
                        isError: true,
                        message: fluid.get(jqXHR, ["responseJSON", "message"]) ||
                        errorThrown ||
                        "Server error occurred while uploading file"
                    });
                }
            });
        }
    };

    /**
     * Given a file, updates the file's metadata as held on the uploader's model
     *
     * @param {Component} that - an instance of sjrk.storyTelling.block.singleFileUploader
     * @param {Object} currentFile - the file whose details are being updated
     */
    sjrk.storyTelling.block.singleFileUploader.updateFileObjectInformation = function (that, currentFile) {
        if (currentFile) {
            var fileDetails = {
                lastModified: currentFile.lastModified,
                lastModifiedDate: currentFile.lastModifiedDate,
                name: currentFile.name,
                size: currentFile.size,
                type: currentFile.type
            };

            that.applier.change("fileDetails", fileDetails);
        } else {
            that.applier.change("fileDetails", "");
        }

        that.applier.change("fileObjectUrl", "");
    };

})(jQuery, fluid);
