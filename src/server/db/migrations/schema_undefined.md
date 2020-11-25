# Data Schema version: undefined

This is a special case which represents all versions of the Storytelling Tool data prior to tool version 0.4.0. The
schema version introduced with that update is `0.0.1`, and so this `undefined` schema will capture the state just
before that point. There have been, in past versions of the tool, a large number of values that have come and gone, or
have simply not been put to use. The migration from `undefined` to `0.0.1` does look for and remove some of those
values, but they will not be documented here.

All documentation is presented in the format of and attempts to conform to some degree with [JSON Schema](https://json-schema.org/).

```JavaScript
story: {
    "_id": { "type": "string" },
	"_rev": { "type": "string" },
	"type": { "type": "string" }, // should be "story" for all story records
	"value": {
        "author": { "type": "string" },
        "title": { "type": "string" },
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
        }
    }
}
```

```JavaScript
block: {
    "id": { "type": "string" }, // unused
	"language": { "type": "string" }, // referred to but not written to
	"heading": { "type": "string" },
	"blockType": { "type": "string" },
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
    "imageUrl": { "type": "string" },
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
