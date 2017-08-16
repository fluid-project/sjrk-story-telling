// classic query string parser via
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

sjrk.storyTelling.storyAuthoring.loadStoryFromQueryParam = function () {

    var storyId = getParameterByName("story");
    var storyURL = "http://localhost:8081/story/" + storyId;

    $.get(storyURL, function (data) {
        var retrievedStory = JSON.parse(data);
        storyTelling.storyEditor.applier.change("", retrievedStory);
    });
}

fluid.defaults("sjrk.storyTelling.server.storyAuthoring", {
    gradeNames: ["sjrk.storyTelling.storyAuthoring"],
    resourceLoaderConfig: {
        resourcePrefix: "node_modules/sjrk-storytelling"
    },
    listeners: {
        "onStoryEditorReady.loadStoryFromQueryParam":
        {
            funcName: "sjrk.storyTelling.storyAuthoring.loadStoryFromQueryParam"
        }
    },
    components: {
        storyViewer: {
            options: {
                selectors: {
                    storySaveNoShare: ".sjrkc-storyTelling-storySaveNoShare"
                },
                events: {
                    onSaveNoShareRequested: null
                },
                listeners: {
                    "onTemplateRendered.bindSaveNoShareControl": {
                        "this": "{that}.dom.storySaveNoShare",
                        "method": "click",
                        "args": ["{that}.events.onSaveNoShareRequested.fire"]
                    },
                    "onSaveNoShareRequested.saveNoShare": {
                        "func": "sjrk.storyTelling.server.storyAuthoring.saveNoShare",
                        "args": ["{that}"]
                    }
                }
            }
        }
    }
});

// TODO: fix the # anchor behaviour of this
sjrk.storyTelling.server.storyAuthoring.saveNoShare = function (storyViewer) {
        console.log("saveNoShare", storyViewer);
};
