/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    fs = require("fs"),
    exif = require("jpeg-exif"),
    path = require("path");

require("../../src/server/storyRequestHandlers");
require("./utils/serverTestUtils.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");

fluid.registerNamespace("sjrk.tests.storyTelling.server.media");

sjrk.tests.storyTelling.server.media.imageRotationTestCases = {
    "null file": {
        fileName: null,
        options: null,
        error: {
            "code": "ERR_INVALID_ARG_TYPE"
        }
    },
    "empty file null opts": {
        fileName: "",
        options: null,
        error: {
            "errno": -2,
            "syscall": "access",
            "code": "ENOENT"
        }
    },
    "empty file empty opts": {
        fileName: "",
        options: "",
        error: {
            "errno": -2,
            "syscall": "access",
            "code": "ENOENT"
        }
    },
    "correct orientation null opts": {
        fileName: "./tests/testData/correctOrientation.jpg",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 1064578, finalFileSize: 1064578}
    },
    "incorrect orientation null opts": {
        fileName: "./tests/testData/incorrectOrientation.jpeg",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 1143772, finalFileSize: 2331730, initialOrientation: 6, finalOrientation: 1}
    },
    "gif null opts": {
        fileName: "./tests/testData/test_gif.gif",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 99303, finalFileSize: 99303}
    },
    "png null opts": {
        fileName: "./tests/testData/logo_small_fluid_vertical.png",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 3719, finalFileSize: 3719}
    },
    "mp3 null opts": {
        fileName: "./tests/testData/Leslie_s_Strut_Sting.mp3",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 365968, finalFileSize: 365968}
    },
    "mp4 null opts": {
        fileName: "./tests/testData/shyguy_and_rootbeer.mp4",
        options: null,
        expectedResolution: true,
        expectedDetails: {initialFileSize: 3017238, finalFileSize: 3017238}
    },
    "correct orientation with opts": {
        fileName: "./tests/testData/correctOrientation.jpg",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 1064578, finalFileSize: 1064578}
    },
    "incorrect orientation with opts": {
        fileName: "./tests/testData/incorrectOrientation.jpeg",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 1143772, finalFileSize: 144091, initialOrientation: 6, finalOrientation: 1}
    },
    "gif with opts": {
        fileName: "./tests/testData/test_gif.gif",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 99303, finalFileSize: 99303}
    },
    "png with opts": {
        fileName: "./tests/testData/logo_small_fluid_vertical.png",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 3719, finalFileSize: 3719}
    },
    "mp3 with opts": {
        fileName: "./tests/testData/Leslie_s_Strut_Sting.mp3",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 365968, finalFileSize: 365968}
    },
    "mp4 with opts": {
        fileName: "./tests/testData/shyguy_and_rootbeer.mp4",
        options: {quality: 1},
        expectedResolution: true,
        expectedDetails: {initialFileSize: 3017238, finalFileSize: 3017238}
    }
};

sjrk.tests.storyTelling.server.media.uploadsDir = "./tests/server/uploads/";

fluid.each(sjrk.tests.storyTelling.server.media.imageRotationTestCases, function (testCase, name) {
    jqUnit.asyncTest("sjrk.storyTelling.server.rotateImageFromExif tests - " + name, function () {
        var filePath = testCase.fileName;

        // copy the file to the test uploads dir, if a filename was provided
        // this way we don't modifiy the original files in the test
        if (filePath) {
            filePath = path.join(sjrk.tests.storyTelling.server.media.uploadsDir, path.basename(filePath));
            fs.copyFileSync(testCase.fileName, filePath);

            jqUnit.assertEquals("The file size is as expected", testCase.expectedDetails.initialFileSize, fs.statSync(filePath).size);

            if (testCase.expectedDetails.initialOrientation) {
                jqUnit.assertEquals("The file orientation is as expected for test case", testCase.expectedDetails.initialOrientation, exif.parseSync(filePath).Orientation);
            }
        }

        // call the function passing the new copy's path and options
        sjrk.storyTelling.server.rotateImageFromExif({path: filePath}, testCase.options).then(function (imageData) {
            jqUnit.assertEquals("The file size is as expected for the processed image", testCase.expectedDetails.finalFileSize, fs.statSync(filePath).size);

            if (testCase.expectedDetails.finalOrientation) {
                // imageData.orientation is the original orientation, so we have to check the returned file (via the jpeg-exif package)
                jqUnit.assertEquals("The file orientation is as expected for the processed image", testCase.expectedDetails.finalOrientation, exif.fromBuffer(imageData.buffer).Orientation);
            }

            // clean up
            if (filePath) {
                fs.unlinkSync(filePath);
            }
            jqUnit.start();

        }, function (rejection) {
            jqUnit.assertDeepEq("Expected rejection returned for failed rotation", testCase.error, rejection);

            // clean up
            if (filePath) {
                fs.unlinkSync(filePath);
            }
            jqUnit.start();
        });
    });
});

sjrk.tests.storyTelling.server.media.fileNameTestCases = {
    "null file name": {input: null, expected: false},
    "undefined file name": {input: undefined, expected: false},
    "0 as file name": {input: 0, expected: false},
    "empty object as file name": {input: {}, expected: false},
    "empty array as file name": {input: [], expected: false},
    "array as file name": {input: [0], expected: false},
    "empty string as file name": {input: "", expected: false},
    "directory path as file name": {input: "../", expected: false},
    "invalid file name without extension": {input: "FailingFileName", expected: false},
    "invalid file name with extension": {input: "FailingFileName.ext", expected: false},
    "invalid UUID format without extension": {input: "1f4EAE4020CF11E9975C2103755D20B8.mp4", expected: false},
    "invalid UUID format with extension": {input: "1f4eae4020cf11e9975c2103755d20b8.mp4", expected: false},
    "UUID after extension": {input: "jpg.1f4845a0-20cf-11e9-975c-2103755d20b8", expected: false},
    "file path as file name": {input: "/uploads/1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: false},
    "relative file path as file name": {input: "../1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: false},
    "multiple extensions": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8.jpg.exe", expected: false},
    "valid UUID": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8", expected: true},
    "valid UUID with jpg extension": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8.jpg", expected: true},
    "valid UUID with mp4 extension": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8.mp4", expected: true},
    "valid UUID with _jpeg extension": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8._jpg", expected: true},
    "valid UUID with long extension": {input: "1f4845a0-20cf-11e9-975c-2103755d20b8.somethingVeryLong", expected: true}
};

jqUnit.test("sjrk.storyTelling.server.isValidMediaFilename tests", function () {
    fluid.each(sjrk.tests.storyTelling.server.media.fileNameTestCases, function (testCase, name) {
        var actualResult = sjrk.storyTelling.server.isValidMediaFilename(testCase.input);
        var message = name + ": \"" + testCase.input + "\", should be " + (testCase.expected ? "a valid" : "an invalid") + " file name";
        jqUnit.assertEquals(message, testCase.expected, actualResult);
    });
});
