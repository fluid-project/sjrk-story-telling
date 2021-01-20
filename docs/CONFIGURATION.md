# Configuring the Storytelling Tool

## Server Configuration

The server is configurable by means of a [JSON5](https://json5.org) [Kettle configuration](https://github.com/fluid-project/kettle/blob/main/docs/ConfigsAndApplications.md)
file called `sjrk.storyTelling.server.config.json5` and placed in the root directory. Any of the options set in
[serverSetup.js](../src/server/serverSetup.js) can be configured through the file, but those found in `globalConfig` are
the most common to modify.

An example, [sjrk.storyTelling.server.config.json5.example](../sjrk.storyTelling.server.config.json5.example), has been
provided as an example and can be used as a template to create your own configuration file.

```JSON5
{
    "type": "sjrk.storyTelling.server.config",
    "options": {
        "gradeNames": ["sjrk.storyTelling.server"],
        "components": {
            "server": {
                "options": {
                    "globalConfig": {
                        /*
                         * the HTTP port the server will be hosted from, default is 8081
                         * this only needs to be set if you intend to use a different port
                         */
                        "port": "8081",

                        /*
                         * the custom theme to load in on top of the base theme
                         * for the base theme, simply remove, comment out or leave this setting empty
                         * available themes are: aihec, cities, karisma, learningReflections, sojustrepairit
                         */
                        "theme": "learningReflections",

                        /*
                         * a default file to load at the site root (e.g. index.html)
                         * if left blank or not set, this will default to storyBrowse.html
                         */
                        "themeIndexFile": "introduction.html",

                        /*
                         * if true, creating and saving stories to the database will be enabled
                         */
                        "authoringEnabled": true
                    }
                }
            }
        }
    }
}
```

### Secrets

In addition to the above configuration options, there are others that are more private and you may not wish to store in
a repository. For those you can make use of a `secrets.json` file which should be placed in the root directory of a
running instance of the Storytelling tool. The `secrets.json` can be used to configure the admin password, session
secret and configure how author credentials are encrypted.

For more information about the author credential options, see [crypto](https://nodejs.org/api/crypto.html).

An example, [secrets.json.example](../secrets.json.example),
has been provided and can be used as a template to create your own file.

```JSON with Comments
{
    "adminPass": "admin password",
    "session": "session secret",
    "authorCredentialConfig": {
        "digest": "hashing algorithm to use",
        "keyLength": Number, // An integer representing the desired key length
        "iterations": Number // An integer indicating the number of iterations used during encoding
    }
}
```


