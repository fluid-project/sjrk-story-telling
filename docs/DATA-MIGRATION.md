# Data Migration

Periodically, the model values for stories and blocks will change which necessitates database updates. These updates are
to be run manually and once per database in order to bring the existing data into compliance with the new data schema.

The files for each migration are located in migration-specific directories under [`src\server\db\migrations`](../src/server/db/migrations)
and are listed by date & the schema version they migrate to and from.

E.g., the script to migrate from the `undefined` schema to schema version `0.0.1` is located here:
[`src\server\db\migrations\2020-11-13_undefined_to_0.0.1\migrate_undefined_to_0.0.1.js`](src/server/db/migrations/2020-11-13_undefined_to_0.0.1/migrate_undefined_to_0.0.1.js)

For details on what schema versions exist and the values they have, please see the documentation in the `migrations` directory.
