# SJRK Story Telling Server

## What Is This?

This is a Kettle-based server that uses the [SJRK Story Telling](https://github.com/fluid-project/sjrk-story-telling) components plus CouchDB to create a web application that allows for the creation and viewing of accessible multimodal stories.

## How Do I Use It?

### Development

* `npm install` to install dependencies
* Run a CouchDB server on `localhost:5984` (Docker is an easy way to do this)
* Run `src/js/db/dbSetup.js` to configure necessary CouchDB databases (this will also ensure your CouchDB instance is set up in [single-node mode](http://docs.couchdb.org/en/latest/install/setup.html))
* Create a `secrets.json` file in the style of `secrets.json.example`
* Run `node index.js` to launch the server

### Theme Customization
Custom themes can be added to the Storytelling Tool by a process detailed in the documentation of the UI project. If you have a set of custom theme grades and files that you would like to use, you need to:
- In the part of storyTellingServerUI.js that defines the `templates` variable, add an entry for your new custom theme that contains any DOM elements that are required to inject markup or templates.
    - e.g.
        ```javascript
        myCustomTheme: {
            view: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> YOUR CUSTOM CONTAINERS GO HERE </div>',
            edit: '<div class="sjrk-pageBody-container sjrk-pageBody-with-sidebars"> YOUR CUSTOM CONTAINERS GO HERE </div>',
            browse: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> YOUR CUSTOM CONTAINERS GO HERE</div>'
        }
        ```
- In each of the HTML files in the `ui` directory, update the call to `sjrk.storyTelling.server.loadThemedPage` to use your desired theme
    - e.g.
        ```javascript
        sjrk.storyTelling.server.loadThemedPage("browse", "myCustomTheme", function (theme) {
            sjrk.storyTelling.server.loadBrowse(theme);
        });
        ```

### Using docker-compose

#### Rebuilding the Containers

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache`

#### Development (for local testing of the Docker-based setup)

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

#### Cloud (for remote deployment usage)

* `docker-compose -f docker-compose.yml -f docker-compose.cloud.yml up`
