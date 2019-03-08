# The Storytelling Tool

## Social Justice Repair Kit
https://sojustrepairit.org/
The goal of the SJRK is to help youth movements and social justice initiatives to become welcoming environments for youth with learning differences, and benefit from the advantages of inclusive design. The resources available in the SJRK are intended to be lightweight and easy to deploy, share, repurpose and reuse. The kit will also be openly available to any group or individual hosting youth movements, youth action events and social justice movements.

## The Storytelling Tool
Overall documentation for this project is available at:
https://wiki.fluidproject.org/display/fluid/Web+Storytelling+Tools

This repository represents the Storytelling Tool, a project which anyone can use to share their story with the world in a way that is inclusive, multimodal and accessible. The project primarily uses [Fluid Infusion](https://fluidproject.org/infusion.html), so it is assumed that anyone working on it will have some familiarity with Infusion's syntax and philosophy.

This project also uses [Node.js](https://nodejs.org), [Kettle](https://github.com/fluid-project/kettle) and [CouchDB](http://couchdb.apache.org/) to build the web-hosting environment that drives the tool.

## How Do I Use It?

### Development
* `npm install` to install dependencies
* Run a CouchDB server on `localhost:5984` (Docker is an easy way to do this, we recommend the `apache/couchdb` image)
* Run `server/src/js/db/dbSetup.js` to configure necessary CouchDB databases (this will also ensure your CouchDB instance is set up in [single-node mode](https://docs.couchdb.org/en/stable/setup/single-node.html))
    * If you have an [admin user](https://docs.couchdb.org/en/stable/intro/security.html) configured on you CouchDB instance, you will need to provide the credentials to `dbSetup.js`. This can be done by setting the `COUCHDB_URL` environment variable. `dbSetup.js` will use the URL specified in `COUCHDB_URL` when connecting to CouchDB. For example: `COUCHDB_URL=http://admin:adminpassword@localhost:5984`
* Create a `secrets.json` file in the style of `secrets.json.example`
    * `secrets.json` specifies credentials for the story deletion endpoint
* Run `node index.js` to launch the server

### Infusion grades defined in this project
- `sjrk.dynamicViewComponentManager` handles the dynamic creation, manipulation and removal of dynamic components from a given DOM container. It will automatically register and un-register view components with itself.
- `sjrk.storyTelling.templateManager` renders [handlebars](https://handlebarsjs.com/) templates to HTML, substituting in localized messages as well as any dynamic values to be included.
  - Template and message bundle options are configured at `{that}.options.templateConfig`
  - Localized messages are loaded to the key `{that}.options.templateStrings.localizedMessages`
  - Localization of content is specified at `{that}.options.templateConfig.locale`, but this is set at the highest level by the `uiManager` (more on this below)
- `sjrk.storyTelling.binder` is an implementation of [`gpii.binder`](https://github.com/GPII/gpii-binder) that links DOM elements to model values and provides a couple of events to tie into the `ui` grade (see below).
- `sjrk.storyTelling.story` is the data model for all stories. It contains metadata and content in the form of individual story block contents (see below for more on blocks).
- `sjrk.storyTelling.ui` can be used to set up UI contexts (pages or parts of a page).
- `sjrk.storyTelling.block` and its derivatives represent a part of the content of a story, and each block has a type related to its use and presentation:
    - `sjrk.storyTelling.block.textBlock` is for text content
    - `sjrk.storyTelling.block.imageBlock` is for graphical content (images, photos, etc.)
    - `sjrk.storyTelling.block.timeBased` is for time-based content that generally use a media player:
        - `sjrk.storyTelling.block.audioBlock` is for audio content
        - `sjrk.storyTelling.block.videoBlock` is for video content
- `sjrk.storyTelling.blockUi`, much like the `ui` grade, provides a user interface for a given individual block. Each `blockUi` has `templateManager` to load its unique template and messages and `block` components (one each) and manages communication between the two.
- Grades for block viewing `blockUI`'s: `sjrk.storyTelling.blockUi.audioBlockViewer`, `sjrk.storyTelling.blockUi.imageBlockViewer`, `sjrk.storyTelling.blockUi.textBlockViewer` and `sjrk.storyTelling.blockUi.videoBlockViewer`
- `sjrk.storyTelling.blockUi.timeBased` for the common shared controls related to playback of audio and video media
- `sjrk.storyTelling.blockUi.editor` is for setting up a user interface to edit a block. Not much use on its own, though it represents the shared elements for the different block type editors. This file also contains some basic configuration to enable the detection of cameras on mobile devices, with specific implementations being handled by the particular editor grades. The current editor grades are:
    - `sjrk.storyTelling.blockUi.editor.textBlockEditor` for text blocks
    - `sjrk.storyTelling.blockUi.editor.imageBlockEditor` for image blocks. This grade also has some additional configuration which uses context awareness to determine whether to load a slightly different editor that can capture from a camera.
    - `sjrk.storyTelling.blockUi.editor.mediaBlockEditor` for time-based media types:
        - `sjrk.storyTelling.blockUi.editor.audioBlockEditor` for audio blocks
    - `sjrk.storyTelling.blockUi.editor.videoBlockEditor` for video blocks. Also contains mobile camera detection
- `sjrk.storyTelling.ui.storyEditor` is an extension of `ui` that provides an editing interface for stories. It has a handlebars template associated with it called `storyEditor.handlebars`. It also contains a `sjrk.storyTelling.binder` to link up with the title, author and keywords fields. It makes use of a `dynamicViewComponentManager` to add blocks of varying types on demand.
- `sjrk.storyTelling.ui.storyViewer` is similar to the `storyEditor`, except it doesn't have a binder since its purpose is to preview a story after editing. Its handlebars template is `storyViewer.handlebars`.
- `sjrk.storyTelling.ui.storyBrowser` is shows a list of all the stories in the database. Its handlebars template is `storyBrowse.handlebars`.
- `sjrk.storyTelling.page` represents a single HTML page, including all interactions within that page. It is the highest-level interface management grade. It has:
    - a `fluid.textToSpeech` component called *storySpeaker* for reading out various content on demand,
    - a `fluid.prefs.cookieStore` for storing site preferences,
    - a `ui` grade called *menu* for top-level links and controls, with an associated template called `menu.handlebars`.
    - a component for UIO with some associated events to dynmically redraw the page contents when the language is changed, and
    - a component for each `ui` in the tool and manages communication of relevant information between them.
- `sjrk.storyTelling.page.storyBrowse` for the Browse page, has a `storyBrowser`
- `sjrk.storyTelling.page.storyView` for the Browse page, has a `storyViewer`
- `sjrk.storyTelling.page.storyBrowse` for the Edit page, has a `storyEditor` and a `storyViewer` which together form the story authoring environment. This file also contains some events, listeners and functions to handle story submission to the database
- `sjrk.storyTelling.block.singleFileUploader` provides some wiring for the Edit page to upload files to the server

### Theme Customization
The "base" JavaScript files included in this repository, located in the `ui/src/js` directory, are intended to provide a bare-bones implementation of the Storytelling Tool. The interface is extensible and customizable to enable the creation of new experiences, themes and story contexts with the tool. To create a custom theme, follow these steps:
- Create a new folder for code and assets associated with the new theme (for examples, please see the `ui/src/karisma` or `ui/src/learningReflections` folders)
- Create a JavaScript file which contains extensions of the page grades (e.g. for `sjrk.storyTelling.page.storyEdit`, add a new grade `sjrk.storyTelling.cuteCats.storyEdit` which has the former as one of its gradeNames). These extensions could include new `ui` components for new sections of the page, new events or other functionality. The name of the JavaScript file must match the folder name, e.g. `ui/src/cuteCats/js/cuteCats.js`
- Add any new associated handlebars templates to be used by new UI components
- If your new content contains any new wording, you can create new message bundle files or add them to the existing message files (in the `ui/src/messages` directory) and refer to those message names in the handlebars template(s). Please note that a `ui` component specifies and loads only one message bundle at a time.
- If there are some common changes that will be made to all pages, or shared values, consider creating a 'base' grade which includes these common changes and have every new `page` or `ui` grade refer to that `gradeName` as well. For example:
    - `sjrk.storyTelling.myCustomTheme.storyEdit` could have the following as a value for `gradeNames`: `["sjrk.storyTelling.myCustomTheme.baseValues", "sjrk.storyTelling.page.storyEdit"]`
    - if the folder structure for the new theme is different from the original location of these files, you could update the `pageSetup.resourcePrefix` option of each new page by putting it in the new base grade
- Add any custom assets required, such as new images, sounds, or fonts.
- Create a CSS file in the `css` directory with all of the styling rules specific to the new theme. The CSS file, like the JavaScript file, should have the same name as the theme and theme folder: `ui/src/cuteCats/css/cuteCats.css`
- In the part of storyTellingServerUI.js that defines the `templates` variable, add an entry for your new custom theme that contains any DOM elements that are required to inject markup or templates.
    - e.g.
        ```javascript
        cuteCats: {
            view: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> YOUR CUSTOM CONTAINERS GO HERE </div>',
            edit: '<div class="sjrk-pageBody-container sjrk-pageBody-with-sidebars"> YOUR CUSTOM CONTAINERS GO HERE </div>',
            browse: '<div class="sjrk-pageBody-container sjrk-pageBody-container-oneColumn"> YOUR CUSTOM CONTAINERS GO HERE</div>'
        }
        ```
- In each of the HTML files in the `ui` directory, update the `theme` variable definition to use your desired theme
    - e.g.
        ```javascript
        var theme = "cuteCats"
        sjrk.storyTelling.loadThemedPage("browse", theme, function (theme) {
            sjrk.storyTelling.loadBrowse(theme);
        });
        ```

### Testing
Before running any tests, please ensure you have followed the steps outlined in the Development section above.

#### Server tests
Run `node tests\all-tests.js` to execute the server code tests.

#### Static tests
Run the server locally via `node index.js` and navigate to http://localhost:8081/tests/ to run the static test battery. You may be prompted with a file upload dialogue for some of the grade tests; it is safe to close these without interacting with them.

### Dockerfile
The included `Dockerfile` is used within the `docker-compose` context and needs an associated CouchDB container to work. Refer to the *Using docker-compose* section for details.

### Using docker-compose
Three files are used for the `docker-compose` definitions:

- `docker-compose.yml`, the base configuration file
- `docker-compose.dev.yml`, the stateless dev configuration
- `docker-compose.cloud.yml`, the production configuration that persists the DB and binary uploads directories using the Docker [bind mounts](https://docs.docker.com/storage/bind-mounts/) approach.

The Compose configuration defines three containers:
- `app`: the storytelling tool itself, built from the project `Dockerfile`
- `db`: the official `apache/couchdb` image
- `dbconfig`: also uses the project `Dockerfile`, but uses it to run the CouchDB configuration setup in `server/src/js/db/dbSetup.js` when launching - this is an idempotent operation that will not overwrite or replace an existing CouchDB database, but ensures the CouchDB instance running in the `db` container is properly configured for use by `app`

#### Basic Local Development Configuration
For testing the basics of container configuration, this can be used locally. Note that there will be no data persistence once the containers are removed.

##### Rebuilding the Container Images
* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache`

##### Bring the Service Up
* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

##### Remove the Stopped Containers
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml rm`

#### Cloud Configuration (for remote deployment usage)

##### Running Locally
The examples below can be used to test the production configuration on a local environment by replicating the persistence volumes approach.

Refer to https://docs.docker.com/compose/environment-variables/ for other methods of passing the necessary environment variables to the `docker-compose` command.

###### Rebuilding the Container Images
```
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml build --no-cache
```

###### Bring the Service Up
```
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml up
```

###### Remove the Stopped Containers
```
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml rm
```

### Licenses
The Storytelling Tool is provided under the New BSD license. Please see LICENSE.txt or visit https://opensource.org/licenses/BSD-3-Clause for more details.
