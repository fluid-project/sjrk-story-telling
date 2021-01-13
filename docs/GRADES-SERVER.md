# Server side grades used in the Storytelling Tool

## Basic pieces

* `sjrk.storyTelling.server` is the main [Kettle](https://github.com/fluid-project/kettle) application. It controls the
  routing, file handling, database communication and authentication. Additional configuration is supplied by `sjrk.storyTelling.server.config.json5`
  once it has been added. More information on the config file can be found in the [README](../README.md#Running-the-site).
* `sjrk.storyTelling.server.app.storyTellingHandlers` contains a list of individual routes and specifies the HTTP
  request method(s) it accepts and which request handler should handle it

## Request handlers - simple

These request handlers don't do much beyond serve requests for a particular route

* `sjrk.storyTelling.server.uiHandler`
* `sjrk.storyTelling.server.uploadsHandler`
* `sjrk.storyTelling.server.nodeModulesHandler`

## Request handlers - complex

These request handlers do a bit more heavy lifting, including communication with the database server

* `sjrk.storyTelling.server.staticHandlerBase`, as its name suggests, is a base static handler implementation. If all
  other handlers to a request fail, the `kettle.request.notFoundHandler` will be called
* `sjrk.storyTelling.server.browseStoriesHandler` gets the list of stories from the database for use by the Browse page.
  They're sorted by `storyId`, which is a unique value automatically assigned to each story on publish time
* `sjrk.storyTelling.server.getStoryHandler` gets a single story from the database by looking for the story ID that is
  passed in.
* `sjrk.storyTelling.server.getEditStoryHandler` gets a single story from the database for the purpose of editing. Looks
  for the passed in story ID in combination with the logged in author.
* `sjrk.storyTelling.server.saveStoryHandler` saves a story to the database
* `sjrk.storyTelling.server.saveStoryFileHandler` saves a single file associated with a pre-existing story
* `sjrk.storyTelling.server.deleteStoryHandler` removes a story from the database and deletes any files associated
  with it
* `sjrk.storyTelling.server.clientConfigHandler` gets the client-safe config values from the server config file. These
  values include the current custom theme name as well as whether saving and editing are enabled
* `sjrk.storyTelling.server.themeHandler` controls the fallback rules for themes, which will load files for a custom
  theme where they exist, and then fall back to the base theme

## Data sources

* `sjrk.storyTelling.server.dataSource.couch.core` is the "base" CouchDB datasource, setting up the common bits used by
  each other one
* `sjrk.storyTelling.server.dataSource.couch.view` gets the list of all stories from CouchDB
* `sjrk.storyTelling.server.dataSource.couch.story` handles reading and writing a single story to CouchDB
* `sjrk.storyTelling.server.dataSource.couch.authorStoriesView` retrieves a story by authorID and storyId. Used to get
  a story for editing.
* `sjrk.storyTelling.server.dataSource.couch.deleteStory` deletes a story from the database
