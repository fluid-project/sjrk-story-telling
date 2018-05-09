fluid.defaults("sjrk.storyTelling.server.learningReflections.changeMenuLink", {
    distributeOptions: {
        target: "{that menu}.options.menuConfig.templateValues.menu_browseLinkUrl",
        record: "/storyBrowse.html"
    }
});

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyEdit", {
    gradeNames: ["sjrk.storyTelling.learningReflections.storyEdit", "sjrk.storyTelling.server.learningReflections.changeMenuLink"],
    distributeOptions: {
        target: "{that templateManager}.options.templateConfig.resourcePrefix",
        record: "/node_modules/sjrk-story-telling"
    },
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
                        funcName: "sjrk.storyTelling.server.learningReflections.submitStory",
                        args: ["{storyEditor}"]
                    }
                }
            }
        }
    }
});

sjrk.storyTelling.server.learningReflections.submitStory = function (that) {
    console.log("submitStory called");

    // TODO: add proper selector for form
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

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyView", {
    gradeNames: ["sjrk.storyTelling.learningReflections.storyView", "sjrk.storyTelling.server.learningReflections.changeMenuLink"],
    distributeOptions: {
        target: "{that templateManager}.options.templateConfig.resourcePrefix",
        record: "/node_modules/sjrk-story-telling"
    },
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

sjrk.storyTelling.server.learningReflections.storyView.loadStoryFromParameter = function () {
    var storyId = sjrk.storyTelling.server.getParameterByName("id");
    if (storyId) {
        var storyUrl = "/stories/" + storyId;

            $.get(storyUrl, function (data) {
                var retrievedStory = JSON.parse(data);

                sjrk.storyTelling.server.learningReflections.storyView({
                    distributeOptions: {
                        "target": "{that story}.options.model",
                        "record": retrievedStory
                    }
                });
            });
    }
};

fluid.defaults("sjrk.storyTelling.server.learningReflections.storyBrowse", {
    gradeNames: ["sjrk.storyTelling.learningReflections.storyBrowse", "sjrk.storyTelling.server.learningReflections.changeMenuLink"],
    distributeOptions: {
        target: "{that templateManager}.options.templateConfig.resourcePrefix",
        record: "/node_modules/sjrk-story-telling"
    },
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

sjrk.storyTelling.server.learningReflections.storyBrowse.loadBrowse = function () {
    var browseUrl = "/stories";
    $.get(browseUrl, function (data) {
        var browseResponse = JSON.parse(data);

        sjrk.storyTelling.server.learningReflections.storyBrowse({
            distributeOptions: {
                "target": "{that storyBrowser}.options.model",
                "record": browseResponse
            }
        });
    });
};
