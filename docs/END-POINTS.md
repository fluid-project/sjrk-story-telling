# Server end-points

## Authorization

### Login author account

```text
POST: /login
```

Logs in an existing author account with the e-mail and password provided in the request.

By default, uses the `sjrk.storyTelling.server.loginHandler` request handler.

#### Default response

```text
status: 200 OK
```

```JSON
{
    "email": "example@example.com"
}
```

#### Malformed request

```text
status: 400 Bad Request
```

```JSON
{
    "isError": true,
    "message": "Your request was invalid.  See the errors for details.",
    "isValid": false,
    "errors": [
        {
            "message": "This value is required.",
            "dataPath": [
                "email"
            ],
            "schemaPath": [
                "properties",
                "email",
                "required"
            ],
            "rule": {
                "type": "string",
                "required": true,
                "format": "email"
            }
        },
        {
            "message": "This value is required.",
            "dataPath": [
                "password"
            ],
            "schemaPath": [
                "properties",
                "password",
                "required"
            ],
            "rule": {
                "type": "string",
                "required": true,
                "minLength": 8
            }
        }
    ]
}
```

#### Unauthorized

```text
status: 401 Unauthorized
```

```JSON
{
    "isError": true,
    "message": "Unauthorized"
}
```

#### Conflict

```text
status: 409 Conflict
```

```JSON
{
    "isError": true,
    "message": "An account is already logged in."
}
```

### Log out author account

```text
POST: /logout
```

Logs out the active author session.

By default, uses the `sjrk.storyTelling.server.logoutHandler` request handler.

#### Default response

```text
status: 200 OK
```

```text
logout successful
```

### Create new author account

```text
POST: /signup
```

Creates a new user account and logs in the user.

By default, uses the `sjrk.storyTelling.server.signupHandler` request handler.

#### Default response

```text
status: 200 OK
```

```JSON
{
    "email": "example@example.com"
}
```

#### Malformed request

```text
status: 400 Bad Request
```

```JSON
{
    "isError": true,
    "message": "Your request was invalid.  See the errors for details.",
    "isValid": false,
    "errors": [
        {
            "message": "This value is required.",
            "dataPath": [
                "email"
            ],
            "schemaPath": [
                "properties",
                "email",
                "required"
            ],
            "rule": {
                "type": "string",
                "required": true,
                "format": "email"
            }
        },
        {
            "message": "This value is required.",
            "dataPath": [
                "password"
            ],
            "schemaPath": [
                "properties",
                "password",
                "required"
            ],
            "rule": {
                "type": "string",
                "required": true,
                "minLength": 8
            }
        },
        {
            "message": "This value is required.",
            "dataPath": [
                "confirm"
            ],
            "schemaPath": [
                "properties",
                "confirm",
                "required"
            ],
            "rule": {
                "type": "string",
                "required": true,
                "minLength": 8
            }
        }
    ]
}
```

#### Conflict

```text
status: 409 Conflict
```

```JSON
{
    "isError": true,
    "message": "Account already exists for example@example.com"
}
```

```JSON
{
    "isError": true,
    "message": "An account is already logged in."
}
```

### Check if sesssion is still active

```text
GET: /session
```

Provides a means of checking if a session is still active on the server. Requires the session cookie.

By default, uses the `sjrk.storyTelling.server.sessionHandler` request handler.

#### Default response

```text
status: 200 OK
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "Unknown error"
}
```

## Static Resources

### Retrieve static theme resources

```text
GET: /*
```

Will look through the current theme and fall back to the base theme for the requested resources. Will also return
resources included in the `static` directory. At the moment that is only the `robots.txt` file.

By default, uses the `sjrk.storyTelling.server.themeHandler` request handler.

#### Default response

```text
status: 200 OK
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "Cannot GET /example"
}
```

### Retrieve client configuration

```text
GET: /clientConfig
```

Gets the client-safe config values from the server config file. These values include the current custom theme name as
well as whether saving and editing are enabled.

By default, uses the `sjrk.storyTelling.server.clientConfigHandler` request handler.

#### Default response

```text
status: 200 OK
```

```JSON
{
    "theme": "learningReflections",
    "baseTheme": "base",
    "authoringEnabled": true
}
```

### Retrieve static resources sourced from NPM

```text
GET: /node_modules/*
```

Provides access to static resources pulled in from NPM. For example 3rd party JavaScript libraries used on the client.
Only the packages explicitly defined under the `allowedSubdirectories` option of the `nodeModulesFilter` component will
be accessible.

By default, uses the `sjrk.storyTelling.server.nodeModulesHandler` request handler.

#### Default response

```text
status: 200 OK
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "Cannot GET /node_modules/example"
}
```

### Retrieve static UI resources

```text
GET: /src/*
```

Retrieves the first party static resources required by the UI.

By default, uses the `sjrk.storyTelling.server.uiHandler` request handler.

#### Default response

```text
status: 200 OK
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "Cannot GET /src/example"
}
```

## Stories

### Retrieve list of published stories

```text
GET: /stories
```

Gets the list of published stories for use by the Browse page. They're sorted by storyId, which is a unique value
automatically assigned to each story on publish time.

By default, uses the `sjrk.storyTelling.server.browseStoriesHandler` request handler.

#### Default response

```text
status: 200 OK
```

```JSON
{
    "totalResults": 1,
    "offset": 0,
    "stories": {
        "storyExample": {
            "title": "The Story Builder how-to",
            "author": "IDRC",
            "tags": [
                "Help",
                "Example",
                "How-to"
            ],
            "contentTypes": [
                "text"
            ]
        }
    }
}
```

### Save a story

```text
POST: /stories
```

Saves a story to the database. If a story ID is provided it will use that and attempt to update any existing story
with a matching ID. If a story ID isn't provided, one will be generated. If a user is logged in, the story will
automatically be associated with the author. Only stories associated with an author can be edited, and only by the
original author.

By default, uses the `sjrk.storyTelling.server.saveStoryHandler` request handler.

#### Parameters

| name | Type | In | Description |
|------|------|----|-------------|
| * | Object | body | The story model to be saved |
| id | String | body | (optional) story ID to save the story with |

#### Default response

```text
status: 200 OK
```

```JSON
{
    "ok": true,
    "id": "f2056441-6b4f-47c6-9c75-2cbadd29508c",
    "rev": "1-11a55971b7e93d4aaaf52853d6a32038"
}
```

#### Forbidden

```text
status: 403 Forbidden
```

```JSON
{
    "isError": true,
    "message": "Unknown error"
}
```

```JSON
{
    "isError": true,
    "message": "Saving is currently disabled."
}
```

### Retrieve a story for viewing

```text
GET: /stories/{id}
```

Retrieves a single story by looking for the story ID that is passed in.

By default, uses the `sjrk.storyTelling.server.getStoryHandler` request handler.

#### Parameters

| name | Type | In | Description |
|------|------|----|-------------|
| id | String | path | The story ID of the story to view |

#### Default response

```text
status: 200 OK
```

```JSON
{
    "published": true,
    "id": "storyExample",
    "title": "The Story Builder how-to",
    "content": [
        {
            "heading": "Add Content Blocks",
            "blockType": "text",
            "text": "The Story Builder is designed based on building blocks..."
        }
    ],
    "tags": [
        "Help",
        "Example",
        "How-to"
    ],
    "_rev": "1-111b36524c613a94fd2dd2c2b76450d3"
}
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "An error occurred while retrieving the requested story"
}
```

### Retrieve a story for editing

```text
GET: /stories/{id}/edit
```

Retrieves a single story, for the purpose of editing, by looking for the story ID that is passed in. Will only return a
story that is available for editing by the current logged in author. Requires the session cookie.

By default, uses the `sjrk.storyTelling.server.getEditStoryHandler` request handler.

#### Parameters

| name | Type | In | Description |
|------|------|----|-------------|
| id | String | path | The story ID of the story to view |

#### Default response

```text
status: 200 OK
```

```JSON
{
    "published": true,
    "id": "storyExample",
    "title": "The Story Builder how-to",
    "content": [
        {
            "heading": "Add Content Blocks",
            "blockType": "text",
            "text": "The Story Builder is designed based on building blocks..."
        }
    ],
    "tags": [
        "Help",
        "Example",
        "How-to"
    ]
}
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "An error occurred while retrieving the requested story"
}
```

### Save file to story

```text
POST: /stories/{id}
```

Saves a file associated with the specified story. There must be an existing story provided, and the author must have
access to the specified story.

By default, uses the `sjrk.storyTelling.server.saveStoryFileHandler` request handler.

#### Parameters

| name | Type | In | Description |
|------|------|----|-------------|
| file | File | form-data | The file to upload |
| id | String | body | The story ID to save the file to |

#### Default response

```text
status: 200 OK
```

```JSON
{
    "ok": true,
    "id": "f2056441-6b4f-47c6-9c75-2cbadd29508c",
    "rev": "1-11a55971b7e93d4aaaf52853d6a32038"
}
```

#### Missing file

```text
status: 400 Bad Request
```

```JSON
{
    "isError": true,
    "message": "Error saving file: file was not provided"
}
```

#### Forbidden

```text
status: 403 Forbidden
```

```JSON
{
    "isError": true,
    "message": "Unknown error"
}
```

```JSON
{
    "isError": true,
    "message": "Saving is currently disabled."
}
```

#### Resource not found

```text
status: 404 Not Found
```

```JSON
{
    "isError": true,
    "message": "Error retrieving story with ID f2056441-6b4f-47c6-9c75-2cbadd29508c"
}
```

### Retrieve an uploaded file

```text
GET: /uploads/*
```

Retrieves uploaded files. For example, a story will use this path to display an uploaded image.

By default, uses the `sjrk.storyTelling.server.uploadsHandler` request handler.

#### Default response

```text
status: 200 OK
```

#### Missing file

```text
status: 400 Bad Request
```

```JSON
{
    "isError": true,
    "message": "Cannot GET /uploads/example.jpg"
}
```

### Delete a story

```text
GET: /admin/deleteStory/{id}
```

Removes a story from the database and deletes any files associated with it. Requires basic auth authentication; which is
setup using the secrets.json configuration file.

By default, uses the `sjrk.storyTelling.server.deleteStoryHandler` request handler.

#### Parameters

| name | Type | In | Description |
|------|------|----|-------------|
| Authorization | String | Header | In the form `Authorization: Basic {base64 encoded username and password}`
| id | String | path | The story id for the story to delete |

#### Default response

```text
status: 200 OK
```

```JSON
{
    "message": "DELETE request received successfully for story with id: {id}"
}
```

#### Unauthorized

```text
status: 401 Unauthorized
```

#### Resource not found

```text
status: 404 Not Found
```
