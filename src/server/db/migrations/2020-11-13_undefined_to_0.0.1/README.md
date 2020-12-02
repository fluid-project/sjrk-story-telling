# Migration from `undefined` to `0.0.1`

The goal of this migration is to prepare the already-authored story data for the changes in the publishing workflow that
have come with Storytelling Tool version `0.4.0`. Most critically, these are the `published` flag as well as the renaming
of image block's `imageUrl` to `mediaUrl` to cut down on duplication and checking within the site code.

## Running the migration

To run this migration:

0. **Do not** deploy version `0.4.0` of the Storytelling Tool until after successfully completing the migration
1. Navigate to the `/stories` JSON endpoint of the site. If the site is hosted at https://staging-stories.floeproject.org/,
then navigate to https://staging-stories.floeproject.org/stories. The result will look something like this:
```
{"totalResults":1,"offset":0,"stories":{"storyExample":{"title":"The Story Builder how-to","author":"IDRC","tags":["Help","Example","How-to"],"contentTypes":["text"]}}}
```
2. Take note of the number of stories currently published on the site by checking the `totalResults` key.
1. Connect to the server container (via SSH or other means)
2. Open a command-line prompt at the Storytelling Tool's root directory
3. Back up the site data, in case of errors
4. Navigate to this directory
```
cd .\src\server\db\migrations\2020-11-13_undefined_to_0.0.1\
```
5. Run the script. If the database host is `http://localhost:5984` and the database name is `stories`, then the command
will be:
```
node migrate_undefined_to_0.0.1.js http://localhost:5984/stories
```
6. The script will log how many `story` documents it updated, and if all of the validation checks passed, it will say
"Done." at the end. It is possible that errors will be raised during the validation step of the script, in which case
those errors will be listed by story, and the program will exit before it reaches the "Done." step. It is possible that
the validator finds issues when there is nothing actually wrong. Here are some potential cases where the validator will
complain:
   - The value of `published` being `false` rather than `true`. This will be the case for unpublished stories authored
   during the initial rollout of version `0.4.0` of the Storytelling Tool
   - Values for `timestampCreated` or `timestampPublished` that don't match the newly-generated "now" value which the
   validator will be looking for
   - Values for block `order` that don't match their index within the `content` array. This is likely for some stories
   which were authored after version `0.3.0` of the Storytelling Tool but before `0.4.0`, of which there are very few.
7. After running the script and any and all data issues are dealt with, navigate to the site and ensure all stories
which were previously available are still served. Check the `/stories` endpoint once again and make sure the
`totalResults` value matches
8. When all of the data is migrated, it will be safe to deploy version `0.4.0` of the Tool to this site

## Description of all changes:

When run, this script will

1. Get all stories from the database
2. Update all stories to include the following fields & values where it was not previously included:
   1. `value.schemaVersion`: "0.0.1"
   2. `value.id`: set it to the value of `_id`
   3. `value.published`: `true`
   4. `value.timestampCreated`: set to the current server time when the script is run
   5. `value.timestampPublished`: same as above
   6. `value.content.*.order`: assign its order in the content array
   7. `value.content.*.firstInOrder`: `true`/`false` (depending on order)
   8. `value.content.*.lastInOrder`: `true`/`false` (depending on order)
3. Rename all `value.content.*.imageUrl` keys to `value.content.*.mediaUrl`
4. Remove old/unused fields from block data
   1. `authoringEnabled`
   2. `contentString`
   3. `hasMobileCamera`
   4. `hasTranscript`
   5. `languageFromSelect`
   6. `languageFromInput`
   7. `savingEnabled`
   8. `simplifiedText`
   9. `transcript`
5. Remove old/unused fields from story data
   1. `authoringEnabled`
   2. `categories`
   3. `contentString`
   4. `contentTypes` (this field is calculated dynamically, now)
   5. `keywordString`
   6. `languageFromSelect`
   7. `languageFromInput`
   8. `requestedTranslations`
   9. `summary`
   10. `thumbnailAltText`
   11. `thumbnailUrl`
   12. `translationOf`
6. Prepend `"./uploads/"` to all `mediaUrl` values where it isn't already present
7. Upload the freshly-modified stories to the database
8. Get all the stories from the database
9. Verify the update was successful
