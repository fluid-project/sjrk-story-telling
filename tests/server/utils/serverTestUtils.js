/*
Copyright The Storytelling Tool copyright holders
See the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/master/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

"use strict";

var jqUnit = fluid.registerNamespace("jqUnit"),
    sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.storyTelling.server");

sjrk.storyTelling.server.verifyGetClientConfigSuccessful = function (data, that, expectedTheme) {
    jqUnit.assertEquals("Successful GET request for clientConfig endpoint", 200, that.nativeResponse.statusCode);

    var responseData = JSON.parse(data);
    jqUnit.assertEquals("Retrieved theme is as expected", expectedTheme, responseData.theme);
};

sjrk.storyTelling.server.verifyGetThemeFileSuccessful = function (data, that, expectedMarkup) {
    jqUnit.assertEquals("Successful GET request for theme file 1/2: expected file retrieved", expectedMarkup, data.trim());
    jqUnit.assertEquals("Successful GET request for theme file 2/2: file loaded", 200, that.nativeResponse.statusCode);
};

sjrk.storyTelling.server.verifyGetThemeFileUnsuccessful = function (data, that) {
    jqUnit.assertEquals("Unsuccessful GET request for theme file 1/2: file not loaded", 404, that.nativeResponse.statusCode);

    var responseData = JSON.parse(data);
    jqUnit.assertTrue("Unsuccessful GET request for theme file 2/2: error was returned", responseData.isError);
};
