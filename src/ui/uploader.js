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
            // uploadState can be one of the following values:
            // "ready" (the initial state), "uploading", "errorReceived"
            uploadState: "ready",
            fileObjectUrl: null, // for the file preview
            previousFileObjectUrl: null, // for file deletion on change/upload
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
            "onFileChanged.clearFileUrl": {
                func: "sjrk.storyTelling.block.singleFileUploader.updateFileObjectInformation",
                args: ["{that}"]
            },
            "onFileChanged.uploadFileToServer": {
                func: "{that}.uploadFileToServer",
                args: ["{that}.currentFile", "{that}.model.previousFileObjectUrl"]
            },
            "onUploadRequested": {
                func: "{that}.applier.change",
                args: ["uploadState", "uploading"],
                namespace: "setStateUploading"
            },
            "onUploadComplete": [
                {
                    func: "{that}.applier.change",
                    args: ["fileObjectUrl", "{arguments}.0"],
                    namespace: "updateFileURL"
                },
                {
                    func: "{that}.applier.change",
                    args: ["uploadState", "ready"],
                    namespace: "setStateReady"
                }
            ],
            "onUploadError": {
                func: "{that}.applier.change",
                args: ["uploadState", "errorReceived"],
                namespace: "setStateErrorReceived"
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
     *
     * @param {Object} fileToUpload - the file data
     * @param {String} storyId - the story with which the file will be associated
     * @param {String} previousFileUrl - the previous URL for the file, if it exists
     * @param {String} serverUploadUrl - the URL to which files are uploaded
     * @param {Object} uploadingEvent - the event to be fired upon starting the upload
     * @param {Object} completionEvent - the event to be fired upon successful completion
     * @param {Object} errorEvent - the event to be fired in case of an error
     */
    sjrk.storyTelling.block.singleFileUploader.uploadFileToServer = function (fileToUpload, storyId, previousFileUrl, serverUploadUrl, uploadingEvent, completionEvent, errorEvent) {
        if (fileToUpload) {
            // This is the easiest way to be able to submit form
            // content in the background via ajax
            var formData = new FormData();
            formData.append("file", fileToUpload);

            if (previousFileUrl) {
                formData.append("previousFileUrl", previousFileUrl);
            }

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
     */
    sjrk.storyTelling.block.singleFileUploader.updateFileObjectInformation = function (that) {
        that.applier.change("previousFileObjectUrl", that.model.fileObjectUrl);
        that.applier.change("fileObjectUrl", "");
    };

})(jQuery, fluid);
