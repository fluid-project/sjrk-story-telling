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

### Using docker-compose

#### Rebuilding the Containers

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache`

#### Development (for local testing of the Docker-based setup)

* `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

#### Cloud (for remote deployment usage)

* `docker-compose -f docker-compose.yml -f docker-compose.cloud.yml up`

---

OLD STUFF

Kettle server intended eventually to be the server-side component of the storytelling tool.

Currently does the following:

1) Mounts various `node_modules` dependencies needed by the client-side UI.
2) Serves the client UI statically from the `ui` directory. This is the same as the demo UI used in `sjrk-storytelling`, except with the necessary changes to refer to the client-side storytelling dependencies from its `node_modules` directory.
3) Includes an Infusion component which stores a representation of the CouchDB database. This is deployed to a running CouchDB server using the `sjrk-couch-config` utility.
   * The file `.\src\js\dbSetup.js` contains the Infusion grade `sjrk.storyTelling.server.storiesDb`
   * That grade inherits from `sjrk.server.couchConfig.auto` which automatically:
      1) Ensures the database specified by `dbName` exists at (http://localhost:5984/)
      2) Loads in all documents listed under `dbDocuments`
      3) Loads in all views and associated functions listed under `dbViews`
      4) Loads in any validation functions listed under `dbValidate`
   * To deploy the database, run this command from the project root:
   ```
   node .\src\js\dbSetup.js
   ```
