# sjrk-storytelling-server

Kettle server intended eventually to be the server-side component of the storytelling tool.

Currently does the following:

1) Mounts various `node_modules` dependencies needed by the client-side UI.
2) Serves the client UI statically from the `ui` directory. This is the same as the demo UI used in `sjrk-storytelling`, except with the necessary changes to refer to the client-side storytelling dependencies from its `node_modules` directory.

This repository includes a JSON file (stories.json) to deploy the "stories" CouchDB database using the couchdb-dump utility found here: https://www.npmjs.com/package/couchdb-dump
