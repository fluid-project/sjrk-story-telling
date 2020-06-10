# UI (client-side) grades used in the Storytelling Tool

## Basic pieces

* `sjrk.storyTelling.story` represents the data of a single story. It contains metadata and content in the form of
  individual story block contents (see below for more on blocks).
* `sjrk.dynamicViewComponentManager` handles the dynamic creation, manipulation and removal of dynamic components from
  a given DOM container. It will automatically register and un-register view components with itself.
* `sjrk.storyTelling.templateManager` renders [handlebars](https://handlebarsjs.com/) templates to HTML, substituting
  in localized messages as well as any dynamic values to be included.
  * Template and message bundle options are configured at `{that}.options.templateConfig`
  * Localized messages are loaded to the key `{that}.templateStrings.localizedMessages`
  * Localization of content is specified at `{that}.model.locale`, and this is configured at the highest level by the
    `page` (more on this below)
* `sjrk.storyTelling.binder` is an implementation of [`gpii.binder`](https://github.com/GPII/gpii-binder) that links
  DOM elements to model values and provides a couple of events to tie into the `ui` grade (see below).
* `sjrk.storyTelling.block.singleFileUploader` provides some wiring for the Edit page to upload files to the server

## Blocks and Stories

* `sjrk.storyTelling.block` and its derivatives represent a part of the content of a story, and each block has a type
  related to its use and presentation. This type is expressed at `{that}.model.blockType`.
  * `sjrk.storyTelling.block.textBlock` is for text content
  * `sjrk.storyTelling.block.imageBlock` is for graphical content (images, photos, etc.)
  * `sjrk.storyTelling.block.timeBased` is for time-based content that generally use a media player. This is common
      code that is used by one of the two 'concrete' implementations:
    * `sjrk.storyTelling.block.audioBlock` is for audio content
    * `sjrk.storyTelling.block.videoBlock` is for video content
* `sjrk.storyTelling.blockUi`, similarly to the `ui` grade, provides a user interface for a given individual block.
  Each `blockUi` has a `templateManager` to load its unique template and messages as well as a `block` component and
  manages communication between the two. There are many subcategories of `blockUi`.
* Grades for `blockUi`'s that handle presentation only:
  * `sjrk.storyTelling.blockUi.imageBlockViewer` for image blocks
  * `sjrk.storyTelling.blockUi.textBlockViewer` for text blocks
  * `sjrk.storyTelling.blockUi.audioBlockViewer` for audio blocks
  * `sjrk.storyTelling.blockUi.videoBlockViewer` for video blocks
* `sjrk.storyTelling.blockUi.timeBased` provides common shared controls related to playback of audio and video blocks
  and is used for both viewing and editing.
* `sjrk.storyTelling.blockUi.editor` is for editing a block, providing the common elements for the various individual
  editor types. This includes events and button selectors to reorder the block up or down. The `editor` derived grades
  are:
  * `sjrk.storyTelling.blockUi.editor.textBlockEditor` for text blocks
  * `sjrk.storyTelling.blockUi.editor.imageBlockEditor` for image blocks
  * `sjrk.storyTelling.blockUi.editor.mediaBlockEditor` for time-based media types:
    * `sjrk.storyTelling.blockUi.editor.audioBlockEditor` for audio blocks
  * `sjrk.storyTelling.blockUi.editor.videoBlockEditor` for video blocks

## User interfaces and Pages

* `sjrk.storyTelling.ui` is used to set up UI contexts (parts of a page).
* `sjrk.storyTelling.ui.storyEditor` is an editing interface for a `story` (which it has as a component). It has a
  handlebars template associated with it called `storyEditor.handlebars`, and a `binder` to connect the title, author
  and keywords fields to their respective model values in the `story`. It makes use of a `dynamicViewComponentManager`
  called **blockManager** to add blocks of varying types on demand. The `reorderer` component is for reordering individual
  blocks via buttons on each (see `sjrk.storyTelling.block.editor` above), using CTRL+UP or CTRL+DOWN or by dragging and
  dropping a block.
* `sjrk.storyTelling.ui.storyViewer` is to view a single story. Its handlebars template is `storyViewer.handlebars`.
  There is also a special version of the `storyViewer` called the `storyPreviewer` which is meant to be used in the
  `storyEdit` page (more info below).
  * has a `fluid.orator` component called **orator** for reading out various content on demand
* `sjrk.storyTelling.ui.storyBrowser` shows a list of all the stories in the database. Its handlebars template is `storyBrowse.handlebars`.
* `sjrk.storyTelling.base.page` represents a single HTML page, including all interactions within that page. It is the
  highest-level interface management grade. It has:
  * a `fluid.prefs.cookieStore` for storing site preferences,
  * a `ui` grade called **menu** for top-level links and controls, with an associated template called `menu.handlebars`.
  * a component for [User Interface Options](https://wiki.fluidproject.org/pages/viewpage.action?pageId=29959408)
      with some associated events to dynamically redraw the page contents when the language is changed, and
  * a component for each `ui` in the tool and wiring for communication of relevant information between them.
* `sjrk.storyTelling.base.page.storyBrowse` represents the Browse page and has a `storyBrowser`
* `sjrk.storyTelling.base.page.storyView` represents the View page, has a `storyViewer`
* `sjrk.storyTelling.base.page.storyEdit` represents the Edit page, has a `storyEditor` and a `storyPreviewer` which
  together form the story authoring environment. There is a `gpii.locationBar` to manage browser history states within
  the page. This grade also contains some events, listeners and functions to handle story submission to the server
