fluid.defaults("sjrk.storyTelling.server.storyAuthoring", {
    gradeNames: ["sjrk.storyTelling.storyAuthoring"],
    resourceLoaderConfig: {
        resourcePrefix: "node_modules/sjrk-storytelling"
    },
    listeners: {
        "onStoryEditorReady.loadStoryFromQueryParam":
        {
            funcName: "sjrk.storyTelling.server.storyAuthoring.loadStoryFromQueryParam"
        }
    },
    components: {
        storyViewer: {
            options: {
                listeners: {
                    "onSaveNoShareRequested.saveNoShare": {
                        "func": "sjrk.storyTelling.server.storyAuthoring.saveNoShare",
                        "args": ["{that}"]
                    }
                }
            }
        }
    }
});

// classic query string parser via
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
sjrk.storyTelling.server.storyAuthoring.getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

sjrk.storyTelling.server.storyAuthoring.loadStoryFromQueryParam = function () {
    var storyId = sjrk.storyTelling.server.storyAuthoring.getParameterByName("story");

    if(storyId){
        var storyURL = "http://localhost:8081/story/" + storyId;

        $.get(storyURL, function (data) {
            var retrievedStory = JSON.parse(data);
            storyTelling.storyEditor.applier.change("", retrievedStory);
        });
    }
}


// TODO: fix the # anchor behaviour of this
sjrk.storyTelling.server.storyAuthoring.saveNoShare = function (storyViewer) {
    var storyId = sjrk.storyTelling.server.storyAuthoring.getParameterByName("story");
    var storyURL = "http://localhost:8081/story/" + (storyId ? storyId : "");
    console.log(storyURL);

    var modelToSave = fluid.censorKeys(storyViewer.model, ["templateTerms"]);

    $.post(storyURL, modelToSave, function() {
        console.log("it worked!");
    });
};
