/*
Copyright 2017-2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling-server/master/LICENSE.txt
*/

fluid.defaults("sjrk.storyTelling.server.changeMenuLink", {
    distributeOptions: {
        target: "{that menu}.options.menuConfig.templateValues.menu_browseLinkUrl",
        record: "/storyBrowse.html"
    }
});

fluid.defaults("sjrk.storyTelling.server.changeTemplateConfigResourcePrefix", {
    distributeOptions: {
        target: "{that templateManager}.options.templateConfig.resourcePrefix",
        record: "/node_modules/sjrk-story-telling"
    }
});

fluid.defaults("sjrk.storyTelling.server.changeUIOTermsMessagePrefix", {
    distributeOptions: {
        target: "{that uio}.options.terms.messagePrefix",
        record: "/node_modules/sjrk-story-telling/src/messages/uio"
    }
});

fluid.defaults("sjrk.storyTelling.server.changeResourceLoadingPaths", {
    gradeNames: ["sjrk.storyTelling.server.changeMenuLink", "sjrk.storyTelling.server.changeTemplateConfigResourcePrefix", "sjrk.storyTelling.server.changeUIOTermsMessagePrefix"]
});

fluid.defaults("sjrk.storyTelling.server.karisma.karismaWelcome", {
    gradeNames: ["sjrk.storyTelling.karisma.karismaWelcome", "sjrk.storyTelling.server.changeResourceLoadingPaths"],
    components: {
        karismaWelcomer: {
            options: {
                welcomerConfig: {
                    templateValues: {
                        "welcomer_browseLinkUrl": "storyBrowse.html",
                        "welcomer_editLinkUrl": "storyEdit.html"
                    }
                },
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.base.storyEdit", {
    gradeNames: ["sjrk.storyTelling.server.changeResourceLoadingPaths"],
    components: {
        storyPreviewer: {
            options: {
                events: {
                    onShareRequested: null
                },
                components: {
                },
                selectors: {
                    storyShare: ".sjrkc-storyTelling-storyShare"
                },
                listeners: {
                    "onReadyToBind.bindShareControl": {
                        "this": "{that}.dom.storyShare",
                        "method": "click",
                        "args": ["{that}.events.onShareRequested.fire"]
                    },
                    "onShareRequested.submitStory": {
                        funcName: "sjrk.storyTelling.server.base.submitStory",
                        args: ["{storyEditor}"]
                    }
                }
            }
        }
    }
});


sjrk.storyTelling.server.base.submitStory = function (that) {

    var form = that.container.find("form");

    form.attr("action", "/stories/");
    form.attr("method", "post");
    form.attr("enctype", "multipart/form-data");

    // This is the easiest way to be able to submit form
    // content in the background via ajax
    var formData = new FormData(form[0]);

    // Stores the entire model as a JSON string in one
    // field of the multipart form
    var modelAsJSON = JSON.stringify(that.story.model);
    formData.append("model", modelAsJSON);

    // In the real implementation, this should have
    // proper handling of feedback on success / failure,
    // but currently it just logs to console
    $.ajax({
        url         : form.attr("action"),
        data        : formData ? formData : form.serialize(),
        cache       : false,
        contentType : false,
        processData : false,
        type        : 'POST',
        success     : function(data, textStatus, jqXHR){
            var successResponse = JSON.parse(data);

            var storyUrl = "/storyView.html?id=" + successResponse.id;
            window.location.assign(storyUrl);
        },
        error       : function (jqXHR, textStatus, errorThrown) {
            console.log("Something went wrong");
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
};

fluid.defaults("sjrk.storyTelling.server.karisma.storyEdit", {
    gradeNames: ["sjrk.storyTelling.server.base.storyEdit", "sjrk.storyTelling.karisma.storyEdit"],
});

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyEdit", {
    gradeNames: ["sjrk.storyTelling.server.base.storyEdit", "sjrk.storyTelling.learningReflections.storyEdit"],
});

fluid.defaults("sjrk.storyTelling.server.base.storyView", {
    gradeNames: ["sjrk.storyTelling.server.changeResourceLoadingPaths"],
    components: {
        storyViewer: {
            options: {
                components: {
                    story: {
                        options: {
                            model: null
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.karisma.storyView", {
    gradeNames: ["sjrk.storyTelling.server.base.storyView", "sjrk.storyTelling.karisma.storyView"],
});

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyView", {
    gradeNames: ["sjrk.storyTelling.server.base.storyView", "sjrk.storyTelling.learningReflections.storyView"],
});

// "sjrk.storyTelling.learningReflections.storyView"
// "sjrk.storyTelling.karisma.storyView"

// classic query string parser via
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

sjrk.storyTelling.server.getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

sjrk.storyTelling.server.loadStoryFromParameter = function (theme) {
    var storyId = sjrk.storyTelling.server.getParameterByName("id");
    if (storyId) {
        var storyUrl = "/stories/" + storyId;

            $.get(storyUrl, function (data) {
                var retrievedStory = JSON.parse(data);

                sjrk.storyTelling.server[theme].storyView({
                    distributeOptions: {
                        "target": "{that story}.options.model",
                        "record": retrievedStory
                    }
                });
            });
    }
};

fluid.defaults("sjrk.storyTelling.server.base.storyBrowse", {
    gradeNames: ["sjrk.storyTelling.server.changeResourceLoadingPaths"],
    components: {
        storyBrowser: {
            options: {
                model: {
                    stories: null
                }
            }
        }
    }
});

fluid.defaults("sjrk.storyTelling.server.karisma.storyBrowse", {
    gradeNames: ["sjrk.storyTelling.server.base.storyBrowse", "sjrk.storyTelling.karisma.storyBrowse"]
});

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyBrowse", {
    gradeNames: ["sjrk.storyTelling.server.base.storyBrowse", "sjrk.storyTelling.learningReflections.storyBrowse"]
});

sjrk.storyTelling.server.loadBrowse = function (theme) {
    var browseUrl = "/stories";
    $.get(browseUrl, function (data) {
        var browseResponse = JSON.parse(data);

        sjrk.storyTelling.server[theme].storyBrowse({
            distributeOptions: {
                "target": "{that storyBrowser}.options.model",
                "record": browseResponse
            }
        });
    });
};

var templates = {
    karisma: {
        view: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> <div class="sjrk-introduction-container sjrkc-introduction-container"></div> <div class="sjrk-main-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-viewer sjrkc-storyTelling-story-viewer"></div> </div> </div>',
        edit: '<div class="sjrk-pageBody-container sjrk-pageBody-with-sidebars"> <div class="sjrk-sidebar-left-container sjrkc-sidebar-left-container"></div> <div class="sjrk-story-editor-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-editor sjrkc-storyTelling-story-editor"></div> <div class="sjrk-storyTelling-story-viewer sjrkc-storyTelling-story-previewer"></div> </div> <div class="sjrk-sidebar-right-container sjrkc-sidebar-right-container"></div> </div>',
        browse: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> <div class="sjrk-introduction-container sjrkc-introduction-container"></div> <div class="sjrk-main-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-browser sjrkc-storyTelling-story-browser"></div></div></div>'
    },
    learningReflections: {
        view: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> <div class="sjrk-introduction-container sjrkc-introduction-container"></div> <div class="sjrk-main-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-viewer sjrkc-storyTelling-story-viewer"></div> </div> </div>',
        edit: '<div class="sjrk-pageBody-container"> <div class="sjrk-introduction-container sjrkc-introduction-container"></div> <div class="sjrk-main-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-editor sjrkc-storyTelling-story-editor"></div> <div class="sjrk-storyTelling-story-viewer sjrkc-storyTelling-story-previewer"></div> </div> </div>',
        browse: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> <div class="sjrk-introduction-container sjrkc-introduction-container"></div> <div class="sjrk-main-container"> <div class="sjrk-storyTelling-menu-links sjrkc-storyTelling-menu-links"></div> <div class="sjrk-storyTelling-story-browser sjrkc-storyTelling-story-browser"></div> </div> </div>'
    }
};

sjrk.storyTelling.server.loadThemedPage = function (page, theme, callback) {

    var mainContainer = $(".sjrkc-main-container");

    mainContainer.html(templates[theme][page]);

    var cssUrl = fluid.stringTemplate("/node_modules/sjrk-story-telling/src/%theme/css/%theme.css", {theme: theme}),
    scriptUrl = fluid.stringTemplate("/node_modules/sjrk-story-telling/src/%theme/js/%theme.js", {theme: theme});

    $('<link/>', {
       rel: 'stylesheet',
       type: 'text/css',
       href: cssUrl
       }).appendTo('head');

    $.getScript(scriptUrl, function () {
            callback(theme);
    });
};
