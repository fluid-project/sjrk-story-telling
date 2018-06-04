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
