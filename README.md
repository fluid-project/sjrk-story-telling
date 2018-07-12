# sjrk-story-telling
Social Justice Repair Kit Storytelling Tool

### Social Justice Repair Kit
https://sojustrepairit.org/
The goal of the SJRK is to help youth movements and social justice initiatives to become welcoming environments for youth with learning differences, and benefit from the advantages of inclusive design. The resources available in the SJRK are intended to be lightweight and easy to deploy, share, repurpose and reuse. The kit will also be openly available to any group or individual hosting youth movements, youth action events and social justice movements.

### The Storytelling Tool
Overall documentation for this project is available at:
https://wiki.fluidproject.org/display/fluid/Storytelling+and+Story-gathering+Resources%2C+Tools+and+Examples

This repository represents the user interface portion of the Storytelling Tool, a project which anyone can use to share their story with the world in a way that is inclusive and accessible. The project uses [Fluid Infusion](https://fluidproject.org/infusion.html), so it is assumed that anyone working on it will have some familiarity with Infusion's syntax and philosophy.

Here is a rundown of the grades included in this repository:
- `sjrk.dynamicViewComponentManager` handles the dynamic creation, manipulation and removal of dynamic components from a given DOM container. It will automatically register and un-register view components with itself.
- `sjrk.storyTelling.templateManager` renders handlebars templates to HTML, substituting in localized messages as well as any dynamic values to be included.
  - Template and message bundle options are configured at `{that}.options.templateConfig`
  - Localized messages are loaded to the key `{that}.options.templateStrings.localizedMessages`
  - Localization of content is specified at `{that}.options.templateConfig.locale`, but this is set at the highest level by the `uiManager` (more on this below)
- `sjrk.storyTelling.binder` is an implementation of `gpii.binder` to link DOM elements to model values that also provides a couple of events to tie into the `ui` grade (below).
- `sjrk.storyTelling.story` is the data model for all stories
- `sjrk.storyTelling.ui` can be used to set up UI contexts (pages). Every UI has a `story` component to represent its data and a `templateManager` to handle rendering.
- `sjrk.storyTelling.block` and its derivatives represent the content of a story, which is made of up blocks of varying types:
    - `sjrk.storyTelling.block.textBlock` is for text content
    - `sjrk.storyTelling.block.imageBlock` is for graphical content (images, photos, etc.)
    - planned future block types include video, audio and drawing
- `sjrk.storyTelling.blockUi`, much like the `ui` grade, provides a user interface for a given block. Each `blockUi` has `templateManager` and `block` components (one each) and manages communication between the two. A template is specified for each blockUi.
- `sjrk.storyTelling.blockUi.editor` is for setting up a user interface to edit a block. Not much use on its own, though it represents the shared elements for the different block type editors:
    - `sjrk.storyTelling.blockUi.editor.textBlockEditor` for text blocks
    - `sjrk.storyTelling.blockUi.editor.imageBlockEditor` for image blocks. This grade also has some additional configuration which uses context awareness to determine whether to load a slightly different editor that can capture from a camera.
- `sjrk.storyTelling.ui.storyEditor` is an extension of `ui` that provides an editing interface for stories. It has a handlebars template associated with it called `storyEditor.handlebars`. It also contains a `sjrk.storyTelling.binder` to link up with the title, author and keywords fields. It makes use of a `dynamicViewComponentManager` to add blocks of varying types on demand.
- `sjrk.storyTelling.ui.storyViewer` is similar to the `storyEditor`, except it doesn't have a binder since its purpose is to preview a story after editing. It has a handlebars template associated with it called `storyViewer.handlebars`.
- `sjrk.storyTelling.uiManager` is the overall Storytelling Tool interface management grade. It has a `fluid.textToSpeech`, called storySpeaker, for reading out the various stories on demand. It also has a subcomponent for each context/page in the tool and manages communication of relevant information between them.

### Installing
Run `npm install` to install all of the package's dependencies.

### Running
You may use any webserver software that can run Node.js packages. E.g. using [Browsersync](https://www.browsersync.io/) via the command `browser-sync start -s -f "**"`, the site will be available at `http://localhost:3000/`.

### Testing
Testing is provided by [jqUnit](https://docs.fluidproject.org/infusion/development/jqUnit.html). If the site is being run at `http://localhost:3000/`, navigate to `http://localhost:3000/tests/all-tests.html` to see the results of all tests and see further details of individual tests.

### Theme Customization
The "base" JavaScript files included in this repository are intended to provide a bare-bones implementation of the Storytelling Tool. The interface is extensible and customizable to enable the creation of new experiences, themes and story contexts with the tool. To create a custom theme, follow these steps:
- Create a new folder for code and assets associated with the new theme (for an example, please see the `karisma` or `learningReflections` folders)
- Create duplicates of all of the HTML pages you would like to customize and place them in the new folder (e.g. storyEdit, storyView, etc.)
- Create one or more JavaScript files which contain extensions of the page grades (e.g. for `sjrk.storyTelling.page.storyEdit`, add a new grade `sjrk.storyTelling.myCustomTheme.storyEdit` which has the former as one of its gradeNames)
- Add any new associated handlebars templates to be used by each new page
- If your new template file requires new message values (i.e. new wording), you can create new message bundle files or add them to the existing message files. Due to the nature of ui grades, each template may use only one message file at a time, so if new messages are added to an extended page, those may have to be duplicated in a new message file.
- If there are some common changes that will be made to all pages, or shared values, create a 'base' page grade which includes these common changes and have every new page refer to that gradeName as well. For example:
    - `sjrk.storyTelling.myCustomTheme.storyEdit` could have the following as a value for gradeNames: `["sjrk.storyTelling.myCustomTheme", "sjrk.storyTelling.page.storyEdit"]`
    - if the folder structure for the new theme is different from the original location of these files, you could update the `pageSetup.resourcePrefix` option of each new page by putting it in the new base grade
- Add any custom assets required, such as new images, sounds, or fonts.
- Create a common CSS file with all of the rules for the new theme
- Add a link in each new HTML file for any applicable new CSS or JavaScript files

### Licenses
The SJRK Storytelling Tool is provided under either the New BSD license or the Educational Community License, Version 2.0. Please see LICENSE.txt for more details.
