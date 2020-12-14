# The Storytelling Tool

![CI build status badge](https://github.com/fluid-project/sjrk-story-telling/workflows/CI/badge.svg)
[![Coverage status badge](https://codecov.io/github/fluid-project/sjrk-story-telling/coverage.svg?branch=main)](https://codecov.io/github/fluid-project/sjrk-story-telling?branch=main)

## Social Justice Repair Kit

<https://sojustrepairit.org/>
The goal of the SJRK is to help youth movements and social justice initiatives to become welcoming environments for
youth with learning differences, and benefit from the advantages of inclusive design. The resources available in the
SJRK are intended to be lightweight and easy to deploy, share, repurpose and reuse. The kit will also be openly
available to any group or individual hosting youth movements, youth action events and social justice movements.

## The Storytelling Tool

More information on this project is available at:
<https://wiki.fluidproject.org/display/fluid/Web+Storytelling+Tools>

This repository represents the Storytelling Tool, a project which anyone can use to share their story with the world in
a way that is inclusive, multimodal and accessible. The project primarily uses [Fluid Infusion](https://fluidproject.org/infusion.html),
so it is assumed that anyone working on it will have some familiarity with Infusion's syntax and philosophy.

This project also uses [Node.js](https://nodejs.org), [Kettle](https://github.com/fluid-project/kettle) and [CouchDB](http://couchdb.apache.org/)
to build the web-hosting environment that drives the tool.

## How do I use it?

### Running the site

* `npm install` to install dependencies
* Run a CouchDB server on `localhost:5984`
  * Docker is an easy way to do this, we recommend the `apache/couchdb` image. To use that image via Docker, run this
    command: `docker run -p 5984:5984 -d apache/couchdb:2.3.1`
* Run `node .\src\server\db\dbSetup.js` to configure necessary CouchDB databases (this will also ensure your CouchDB
  instance is set up in [single-node mode](https://docs.couchdb.org/en/stable/setup/single-node.html))
  * If you have an [admin user](https://docs.couchdb.org/en/stable/intro/security.html) configured on you CouchDB
  instance, you will need to provide the credentials to `dbSetup.js`. This can be done by setting the `COUCHDB_URL`
  environment variable. `dbSetup.js` will use the URL specified in `COUCHDB_URL` when connecting to CouchDB. For
  example: `COUCHDB_URL=http://admin:adminpassword@localhost:5984`
* Create a `sjrk.storyTelling.server.config.json5` file in the style of `sjrk.storyTelling.server.config.json5.example`
  and place it in the application root (where the example file is located). See [Configuring the application](#configuring-the-application)
  for more information on configuring the application. To get started using some default values, simply copy the example
  file and remove `.example` from the filename:

  ```shell
  cp sjrk.storyTelling.server.config.json5.example sjrk.storyTelling.server.config.json5
  ```

* Create a `secrets.json` file which contains the following: `{"adminPass": "ADMINPASSWORD"}`, where the `ADMINPASSWORD`
  part is replaced by a ___secure___ password of your choosing. This new file specifies credentials for the story deletion
  endpoint. You can find an example of this in `secrets.json.example` in the application root.
* Run `node .\index.js` to launch the server

### Development

The tool is split up into two main pieces: a webserver to manage communication with the CouchDB database, and an HTML
interface for creating and sharing stories.

* Server code can be found in `src/server`. A list of grades used on the server side of the project can be found in [GRADES-SERVER.md](docs/GRADES-SERVER.md).
* User interface code can be found in `src/ui`, though a significant amount of code may be present in the theme
  folders (see [Theme Customization](#Theme-Customization)). A list of grades used on the client side of the project can
  be found in [GRADES-UI.md](docs/GRADES-UI.md).

## Configuring the application

While Infusion allows for just about any possible extension you can imagine and implement, there are a few handy
configuration settings provided as part of the code which allow you, for instance, to customize the current theme or
configure a new one. The server will load a file named `sjrk.storyTelling.server.config.json5`, and the `globalConfig`
collection is where you will find the following settings:

| Setting | Description |
|---------|-------------|
| `port`  | _(Optional)_ The HTTP port the server will be hosted on. The default value is 8081. If this is changed, it should also be updated in `Dockerfile`, `docker-compose.dev.yml` and `docker-compose.cloud.yml` |
| `authoringEnabled` | Specifies whether creating and saving stories to the database is allowed. If the value is set to `false`, then the site is effectively in "read-only" mode and will behave as a collection of stories rather than an authoring tool. |
| `theme` | _(Optional)_ The theme to load the site with. If this isn't specified, a base theme will be loaded. More info on this can be found in [Theme Customization](#Theme-Customization). |
| `themeIndexFile` | _(Optional)_ The file to serve at the site root. E.g. `"themeIndexFile": "index2.html"`. The default is `storyBrowse.html`. If `theme` is not provided, this setting will be ignored and the default will be served. |

### Theme customization

#### Provided themes

The "base" files included in this repository, located in the `themes/base` directory, are intended to provide a
bare-bones implementation of the Storytelling Tool without any project- or organization-specific branding or other
bells and whistles. The interface is extensible and customizable to enable the creation of new experiences, themes and
story contexts within the tool.
The site comes with some custom themes already available:

* `cities` has styling intended to be consistent with the [Inclusive Cities](https://cities.inclusivedesign.ca/) site.
  There is no link to the Edit page since the hosted site is used only as a collection of stories and editing is disabled.
* `learningReflections` has a few extra pages with content and is styled to illustrate the support of the Storytelling
  Project by the [William and Flora Hewlett Foundation](https://www.hewlett.org/) and the [Oak Foundation](http://www.oakfnd.org/).
* `karisma` is a fun theme with some hand-drawn illustrations on a welcome page and was created for use as part of the
  SJRK work being done by the [Fundación Karisma](https://karisma.org.co).
* `sojustrepairit` is designed to match the styling on the main SJRK website: [sojustrepairit.org](https://www.sojustrepairit.org/)

Each theme is hosted from a particular branch in the repository, most of which are present in the main fork. For more
information on those branches, please see [BRANCHES.md](docs/BRANCHES.md).

#### Creating a new theme

To create new a custom theme, follow these steps:

* Set the `theme` value in the server config file (see [Configuring the application](#configuring-the-application)) to
  the name of your new theme. For the sake of this example, we'll use `cuteCats`.
* Create a new folder for code and assets associated with the new theme (for examples, please see the `themes/karisma`
  or `themes/learningReflections` folders). The folder name **must** be the same as the `theme` value in the config file.
* Create a JavaScript file which contains extensions of the `page` grades (e.g. for `sjrk.storyTelling.base.page.storyEdit`,
  add a new grade `sjrk.storyTelling.cuteCats.storyEdit` which has the former as one of its gradeNames). These extensions
  could include new `ui` components for new sections of the page, new events or other functionality. The name of the
  JavaScript file must match the folder and theme name, e.g. `themes/cuteCats/js/cuteCats.js`
* Create a CSS file in the `css` directory with all of the styling rules specific to the new theme. The CSS file, like
  the JavaScript file, should have the same name as the theme and theme folder: `themes/cuteCats/css/cuteCats.css`
* Add any new associated [handlebars](https://handlebarsjs.com/) templates to be used by new UI components, and be sure
  to set the path for these templates. It is recommended to put them in the `templates` directory. E.g. `themes/cuteCats/templates/newTemplateName.hbs`
* If your new content contains any new wording, you can create new message bundle files (in the `themes/cuteCats/messages`
  directory) and refer to those message names in the handlebars template(s). Please note that a `ui` component specifies
  and loads _only one_ message bundle at a time.
* If there are some common changes that will be made to all pages, or shared values, consider creating a shared grade which
  includes these common changes and have every new `page` or `ui` grade refer to that `gradeName` as well. For example:
  * `sjrk.storyTelling.cuteCats.page.storyEdit` could have the following as a value for `gradeNames`:
    `["sjrk.storyTelling.cuteCats.page", "sjrk.storyTelling.base.page.storyEdit"]`
  * if the folder structure for the new theme is different from the original location of these files, you could update
    the `pageSetup.resourcePrefix` option of each new page by putting it in the new base grade
* Add any custom assets required, such as new images, sounds, or fonts. These should also be located within the `themes/cuteCats`
  directory.

### Testing

Before running any tests, please ensure you have followed the steps outlined in [Running the site](#Running-the-site).
All tests should be run before any commits are made in order to catch any bugs or regressions introduced by code changes.

#### All tests

Run `npm test` which will run the server and browser tests and output a coverage report. The coverage summary will be
displayed in the log and reports are populated in the `reports` directory.

#### Server tests

Run `npm run test:node` to execute the server code tests.

#### Browser tests

Run `npm run test:browser` to execute the browser tests in headless browsers.

If you would like to manually execute the browser tests in browser, use a webserver to serve the project and navigate to
tests/ui/all-tests.html file or any of the indivdual test files in the tests/ui/html directory.

#### Manual Browser tests

There are a number of features that must currently be tested manually (i.e. with direct user interaction), either due to
automation that has not yet been implemented or due to browser security restrictions. Each manual test page provides
instructions on how to proceed and what to expect in the successful case. You'll need to use a webserver to serve the
project in order to access the manual tests.

Here are the current manual browser test pages:

* tests/manual/html/ui-storyEditor-manual-Tests.html
* tests/manual/html/blockUi-editor-audioBlockEditor-manual-Tests.html
* tests/manual/html/blockUi-editor-imageBlockEditor-manual-Tests.html
* tests/manual/html/blockUi-editor-videoBlockEditor-manual-Tests.html

For more information on the grades and files being tested, please refer to the UI Grades documentation: [GRADES-UI.md](docs/GRADES-UI.md).

### Deploying: Dockerfile and using docker-compose

The included `Dockerfile` is used within the `docker-compose` context and needs an associated CouchDB container to work.
Refer to the *Using docker-compose* section for details.

Three files are used for the `docker-compose` definitions:

* `docker-compose.yml`, the base configuration file
* `docker-compose.dev.yml`, the stateless dev configuration
* `docker-compose.cloud.yml`, the production configuration that persists the DB and binary uploads directories using the
  Docker [bind mounts](https://docs.docker.com/storage/bind-mounts/) approach.

The Compose configuration defines three containers:

* `app`: the storytelling tool itself, built from the project `Dockerfile`
* `db`: the official `apache/couchdb` image
* `dbconfig`: also uses the project `Dockerfile`, but uses it to run the CouchDB configuration setup in `server/src/js/db/dbSetup.js`
  when launching - this is an idempotent operation that will not overwrite or replace an existing CouchDB database, but
  ensures the CouchDB instance running in the `db` container is properly configured for use by `app`

#### Basic local development configuration

For testing the basics of container configuration, this can be used locally. Note that there will be no data persistence
once the containers are removed.

##### Rebuilding the container images

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache`

##### Bring the service up

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

##### Remove the stopped containers

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml rm`

#### Cloud configuration (for remote deployment usage)

##### Running locally

The examples below can be used to test the production configuration on a local environment by replicating the persistence
volumes approach.

Refer to <https://docs.docker.com/compose/environment-variables/> for other methods of passing the necessary environment
variables to the `docker-compose` command.

###### Rebuilding the container images

```shell
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml build --no-cache
```

###### Bring the service up

```shell
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml up
```

###### Remove the stopped containers

```shell
APP_SERVER_PORT=8081 \
APP_SERVER_SECRETS_FILE=./secrets.json \
APP_SERVER_UPLOADS_DIRECTORY=./uploads \
APP_SERVER_DELETED_UPLOADS_DIRECTORY=./deleted_uploads \
COUCHDB_DATADIR=./couchdb \
docker-compose -f docker-compose.yml -f docker-compose.cloud.yml rm
```

### Licenses

The Storytelling Tool is provided under the New BSD license. Please see LICENSE.txt or visit <https://opensource.org/licenses/BSD-3-Clause>
for more details. For a list of copyright holders in the project, please see [AUTHORS.md](docs/AUTHORS.md).
