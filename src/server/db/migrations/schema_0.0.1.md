# Data Schema version: `0.0.1`

Schema version `0.0.1` is the first documented schema, as well as the first to be formally migrated. The use of this schema coincides with the release of Storytelling Tool Version `0.4.0` which introduces server-side autosave, among other features and fixes.

All documentation is presented in the format of and attempts to conform to some degree with [JSON Schema](https://json-schema.org/).

```JavaScript
story: {
    "_id": { "type": "string" },
	"_rev": { "type": "string" },
	"type": { "type": "string" }, // should be "story" for all story records
	"value": {
        "id": { "type": "string" }, // should match the value at "story._id"
        "title": { "type": "string" },
        "author": { "type": "string" },
        "content": {
            "type": "array",
            "items": {
                "type": "object" // see block schema definitions below
            }
        },
        "tags": {
            "type": "array",
            "items": {
                "type": "number"
            }
        },
        "published": { "type": "boolean" },
        "timestampCreated": {
            "type": "string",
            "format": "date-time" // ISO8601 date-time, e.g. "2020-11-24T23:42:17.730Z"
        },
        "timestampPublished": {
            "type": "string",
            "format": "date-time" // same as timestampCreated
        }
    },
    "schemaVersion": { "const": "0.0.1" }
}
```

```JavaScript
block: {
    "id": { "type": "string" }, // unused
    "blockType": { "type": "string" },
	"language": { "type": "string" }, // referred to but not written to
	"heading": { "type": "string" },
    "order": { "type": "number" },
	"firstInOrder": { "type": "boolean" },
	"lastInOrder": { "type": "boolean" },
}
```

## Block-type schemas
Each different block type has different data to store. All block types have the fields documented above in common, in
addition to these type-specific fields and values:

```JavaScript
block (text): {
	"blockType": { "const": "text" }, // the value is "text" for text blocks
	"text": { "type": "string" }
}
```

```JavaScript
block (audio): {
	"blockType": { "const": "audio" }, // the value is "audio" for audio blocks
    "alternativeText": { "type": "string" }, // referred to but not written to
	"description": { "type": "string" },
    "mediaUrl": { "type": "string" },
    "fileDetails": {
        "type": "object",
        "properties": {
            "lastModified": { "type": "number" },
            "name": { "type": "string" },
            "size": { "type": "number" },
            "type": { "type": "string" } // represents MIME type of the file
        }
    }
}
```

```JavaScript
block (image): {
	"blockType": { "const": "image" }, // the value is "image" for image blocks
    "alternativeText": { "type": "string" },
    "description": { "type": "string" },
    "mediaUrl": { "type": "string" },
    "fileDetails": {
        "type": "object",
        "properties": {
            "lastModified": { "type": "number" },
            "name": { "type": "string" },
            "size": { "type": "number" },
            "type": { "type": "string" } // represents MIME type of the file
        }
    }
}
```

```JavaScript
block (video): {
	"blockType": { "const": "video" }, // the value is "video" for video blocks
    "alternativeText": { "type": "string" }, // referred to but not written to
    "description": { "type": "string" },
	"mediaUrl": { "type": "string" },
    "fileDetails": {
        "type": "object",
        "properties": {
            "lastModified": { "type": "number" },
            "name": { "type": "string" },
            "size": { "type": "number" },
            "type": { "type": "string" } // represents MIME type of the file
        }
    }
}
```
