/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid, sjrk, loadImage */

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
        // Holds a fileObjectURL for file preview purposes
        model: {
            fileObjectURL: null,
            fileDetails: null
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
            "onFileChanged.updateFileObjectInformation": {
                "func": "sjrk.storyTelling.block.singleFileUploader.updateFileObjectInformation",
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

    /**
     * Updates the uploader's internal file representation with information
     * stored in the DOM's uploader element. If the file is an image, an attempt
     * will be made to rotate it to match any orientation EXIF data it provides.
     *
     * @param {Component} that - an instance of sjrk.storyTelling.block.singleFileUploader
     * @param {jQuery} fileInput - the DOM uploader element
     */
    sjrk.storyTelling.block.singleFileUploader.handleFileInputChange = function (that, fileInput) {
        var fileList = fileInput[0].files;
        var currentFile = fileList[0];

        if (currentFile && currentFile.type.indexOf("image") === 0) {
            // loadImage is the call that rotates the image by virtue of the
            // orientation option in the third argument. Setting the orientation
            // option also means the callback argument is a canvas element,
            // so we call .toBlob to retrieve file data that we can pass along.
            // For more information, please see the documentation for the library:
            // https://github.com/blueimp/JavaScript-Load-Image#options
            loadImage(currentFile, function (img) {
                if (img.type !== "error" && img.toBlob) {
                    img.toBlob(function (blob) {
                        blob.name = currentFile.name;
                        blob.lastModified = currentFile.lastModified;
                        blob.lastModifiedDate = currentFile.lastModifiedDate;
                        sjrk.storyTelling.block.singleFileUploader.processFileChange(that, blob);
                    });
                } else {
                    sjrk.storyTelling.block.singleFileUploader.processFileChange(that, currentFile);
                }
            }, { orientation: true });
        } else {
            sjrk.storyTelling.block.singleFileUploader.processFileChange(that, currentFile);
        }
    };

    /**
     * Updates the uploader's internal file representation with the provided file
     *
     * @param {Component} that - an instance of sjrk.storyTelling.block.singleFileUploader
     * @param {Object} file - the file object in question
     */
    sjrk.storyTelling.block.singleFileUploader.processFileChange = function (that, file) {
        that.currentFile = file;
        that.events.onFileChanged.fire();
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

            URL.revokeObjectURL(that.model.fileObjectURL);
            that.applier.change("fileObjectURL", URL.createObjectURL(currentFile));
            that.applier.change("fileDetails", fileDetails);
        } else {
            that.applier.change("fileObjectURL", "");
            that.applier.change("fileDetails", "");
        }
    };

})(jQuery, fluid);
