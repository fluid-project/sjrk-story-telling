# sjrk-storytelling-server

Kettle server intended eventually to be the server-side component of the storytelling tool.

Currently does the following:

1) Mounts various `node_modules` dependencies needed by the client-side UI.
2) Serves the client UI statically from the `ui` directory. This is the same as the demo UI used in `sjrk-storytelling`, except with the necessary changes to refer to the client-side storytelling dependencies from its `node_modules` directory.
3) Includes an Infusion component which stores a representation of the CouchDB database. This is deployed to a running CouchDB server using the `sjrk-couch-config` utility.
   * The file `./src/js/dbSetup.js` contains the Infusion grade `sjrk.storyTelling.server.storiesDb`
   * That grade inherits from `sjrk.server.couchConfig.auto` which automatically:
      1) Ensures the database specified by `dbName` exists at (http://localhost:5984/)
      2) Loads in all documents listed under `dbDocuments`
      3) Loads in all views and associated functions listed under `dbViews`
      4) Loads in any validation functions listed under `dbValidate`
   * To deploy the database, run this command from the project root:
   ```
   node .\src\js\dbSetup.js
   ```
