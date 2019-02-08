# SJRK Story Telling Server

## What Is This?

This is a Kettle-based server that uses the [SJRK Story Telling](https://github.com/fluid-project/sjrk-story-telling) components plus CouchDB to create a web application that allows for the creation and viewing of accessible multimodal stories.

## How Do I Use It?

### Development

* `npm install` to install dependencies
* Run a CouchDB server on `localhost:5984` (Docker is an easy way to do this)
* Run `src/js/db/dbSetup.js` to configure necessary CouchDB databases (this will also ensure your CouchDB instance is set up in [single-node mode](http://docs.couchdb.org/en/latest/install/setup.html))
    * If you have an [admin user](http://docs.couchdb.org/en/stable/intro/security.html) configured on you CouchDB instance, you will need to provide the credentials to `dbSetup.js`. This can be done by setting the `COUCHDB_URL` environment variable. `dbSetup.js` will use the URL specified in `COUCHDB_URL` when connecting to CouchDB. For example: `COUCHDB_URL=http://admin:adminpassword@localhost:5984`
* Create a `secrets.json` file in the style of `secrets.json.example`
    * `secrets.json` specifies credentials for the story deletion endpoint
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

### Dockerfile

The included `Dockerfile` is used within the `docker-compose` context and needs an associated CouchDB container to work. Refer to the Compose files for details.

### Using docker-compose

Three files are used for the `docker-compose` definitions:

- `docker-compose.yml`, the base configuration file
- `docker-compose.dev.yml`, the stateless dev configuration
- `docker-compose.cloud.yml`, the production configuration that persists the DB and binary uploads directories using the Docker [bind mounts](https://docs.docker.com/storage/bind-mounts/) approach.

The Compose configuration defines three containers:
- `app`: the story-telling-server app itself, built from the project `Dockerfile`
- `db`: the official `apache/couchdb` image
- `dbconfig`: also uses the project `Dockerfile`, but uses it to run the CouchDB configuration setup in `src/js/db/dbSetup.js` when launching - this is an idempotent operation that will not overwrite or replace an existing CouchDB database, but ensures the CouchDB instance running in the `db` container is properly configured for use by `app`

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
