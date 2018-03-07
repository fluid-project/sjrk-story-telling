fluid.defaults("sjrk.storyTelling.server.ui.blockEditor.learningReflections", {
    gradeNames: ["sjrk.storyTelling.ui.blockEditor.learningReflections"],
    selectors: {
        storyBlockEditor: ".sjrkc-storyTelling-block-editor"
    },
    components: {
        templateManager: {
            options: {
                templateConfig: {
                    resourcePrefix: "node_modules/sjrk-story-telling"
                }
            }
        },
        blockManager: {
            options: {
                dynamicComponents: {
                    managedViewComponents: {
                        options: {
                            components: {
                                templateManager: {
                                    options: {
                                        templateConfig: {
                                            resourcePrefix: "node_modules/sjrk-story-telling"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    listeners: {
        "onStorySubmitRequested.submitStory": {
            funcName: "sjrk.storyTelling.server.ui.blockEditor.learningReflections.submitStory",
            args: ["{that}"]
        }
    }
});

sjrk.storyTelling.server.ui.blockEditor.learningReflections.submitStory = function (that) {
    var form = that.locate("storyBlockEditor");
    form.attr("action", "/binaries/");
    form.attr("method", "post");
    form.attr("enctype", "multipart/form-data");
    var uploaders = form.find(".sjrkc-storyblock-uploader-input");
    form.submit();
};

// classic query string parser via
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// sjrk.storyTelling.server.storyAuthoring.getParameterByName = function (name, url) {
//     if (!url) url = window.location.href;
//     name = name.replace(/[\[\]]/g, "\\$&");
//     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
//         results = regex.exec(url);
//     if (!results) return null;
//     if (!results[2]) return '';
//     return decodeURIComponent(results[2].replace(/\+/g, " "));
// };
//
// sjrk.storyTelling.server.storyAuthoring.loadStoryFromQueryParam = function () {
//     var storyId = sjrk.storyTelling.server.storyAuthoring.getParameterByName("story");
//
//     if(storyId){
//         var storyURL = "http://localhost:8081/story/" + storyId;
//
//         $.get(storyURL, function (data) {
//             var retrievedStory = JSON.parse(data);
//             storyTelling.storyEditor.applier.change("", retrievedStory);
//         });
//     }
// };
//
//
// // TODO: fix the # anchor behaviour of this
// sjrk.storyTelling.server.storyAuthoring.saveNoShare = function (storyViewer) {
//     var storyId = sjrk.storyTelling.server.storyAuthoring.getParameterByName("story");
//     var storyURL = "http://localhost:8081/story/" + (storyId ? storyId : "");
//     console.log(storyURL);
//
//     var modelToSave = fluid.censorKeys(storyViewer.model, ["templateTerms"]);
//
//     $.post(storyURL, modelToSave, function(response) {
//         console.log("it worked!", response.id);
//     });
// };
