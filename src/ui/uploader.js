/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

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
            currentFile: null,
            // these values configure the file upload server call
            uploadUrl: "/stories/",
            uploadMethod: "POST",
            uploadTimeout: 300000 // 5 minutes, in ms
        },
        model: {
            storyId: null, // to be provided by a parent component or implementing grade
            // uploadState can be one of the following values:
            // "ready" (the initial state), "uploading", "errorReceived"
            uploadState: "ready",
            fileObjectUrl: null, // for the file preview
            previousFileObjectUrl: null // for file deletion on change/upload
        },
        events: {
            onFileSelectionRequested: null,
            onUploadRequested: null,
            onUploadSuccess: null,
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
                changePath: "",
                value: {
                    previousFileObjectUrl: "{that}.model.fileObjectUrl",
                    fileObjectUrl: ""
                }
            },
            "onFileChanged.uploadFileToServer": {
                func: "{that}.uploadFileToServer",
                args: ["{that}.currentFile", "{that}.model.previousFileObjectUrl"]
            },
            "onUploadRequested.setStateUploading": {
                changePath: "uploadState",
                value: "uploading",
                source: "fileUploadOnUploadRequested"
            },
            "onUploadSuccess.resetStateAfterUpload": {
                changePath: "",
                value: {
                    fileObjectUrl: "{arguments}.0",
                    uploadState: "ready"
                },
                source: "fileUploadOnUploadSuccess"
            },
            "onUploadError.setStateErrorReceived": {
                changePath: "uploadState",
                value: "errorReceived",
                source: "fileUploadOnUploadError"
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
                    {
                        uploadUrl: "{that}.uploadUrl",
                        uploadMethod: "{that}.uploadMethod",
                        uploadTimeout: "{that}.uploadTimeout",
                        uploadingEvent: "{that}.events.onUploadRequested",
                        completionEvent: "{that}.events.onUploadSuccess",
                        errorEvent: "{that}.events.onUploadError"
                    }
                ]
            },
            "resetUploadState": {
                func: "{that}.applier.change",
                args: ["uploadState", "ready"]
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
     *  Expected options for configuring the file upload call to the server
     * @typedef {Object} FileUploadOptions
     * @property {String} uploadUrl - the URL to which files are uploaded
     * @property {String} uploadMethod - the HTTP method by which files are uploaded
     * @property {String} uploadTimeout - the time (in ms) to wait for files to upload
     * @property {Object} uploadingEvent - the event to be fired upon starting the upload
     * @property {Object} completionEvent - the event to be fired upon successful completion
     * @property {Object} errorEvent - the event to be fired in case of an error
     */

    /**
     * Uploads the file to the server and sets the URL to the newly-saved
     * dynamic file name upon completion
     *
     * @param {Object} fileToUpload - the file data
     * @param {String} storyId - the story with which the file will be associated
     * @param {String} previousFileUrl - the previous URL for the file, if it exists
     * @param {FileUploadOptions} uploadOptions - options for the upload server call
     */
    sjrk.storyTelling.block.singleFileUploader.uploadFileToServer = function (fileToUpload, storyId, previousFileUrl, uploadOptions) {
        if (fileToUpload) {
            // This is the easiest way to be able to submit form
            // content in the background via ajax
            var formData = new FormData();
            formData.append("file", fileToUpload);

            if (previousFileUrl) {
                formData.append("previousFileUrl", previousFileUrl);
            }

            var fileUploadUrl = uploadOptions.uploadUrl + storyId;

            uploadOptions.uploadingEvent.fire();

            $.ajax({
                url         : fileUploadUrl,
                data        : formData,
                cache       : false,
                contentType : false,
                processData : false,
                type        : uploadOptions.uploadMethod,
                timeout     : uploadOptions.uploadTimeout,
                success     : function (data, textStatus, jqXHR) {
                    fluid.log(jqXHR, textStatus);

                    uploadOptions.completionEvent.fire(data);
                },
                error       : function (jqXHR, textStatus, errorThrown) {
                    fluid.log(fluid.logLevel.WARN, jqXHR, textStatus, errorThrown);

                    var timeoutMessage = fluid.stringTemplate("Connection to the server timed out after %time seconds", {time: uploadOptions.uploadTimeout / 1000});

                    var messageText = fluid.get(jqXHR, ["responseJSON", "message"]) ||
                    (errorThrown === "timeout" ? timeoutMessage : errorThrown) ||
                    (jqXHR.readyState === 0 ? "Unable to connect to the server" : "An unspecified server error occurred");

                    uploadOptions.errorEvent.fire({
                        isError: true,
                        message: messageText
                    });
                }
            });
        }
    };

})(jQuery, fluid);
