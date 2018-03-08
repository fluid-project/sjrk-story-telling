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

    //
    form.attr("action", "/binaries/");
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
            console.log(data, textStatus, jqXHR);
        },
        error       : function (jqXHR, textStatus, errorThrown) {
            console.log("Something went wrong");
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
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
