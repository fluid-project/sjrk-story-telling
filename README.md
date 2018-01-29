# sjrk-story-telling
Social Justice Repair Kit Storytelling Tool

### Social Justice Repair Kit
https://sojustrepairit.org/
The goal of the SJRK is to help youth movements and social justice initiatives to become welcoming environments for youth with learning differences, and benefit from the advantages of inclusive design. The resources available in the SJRK are intended to be lightweight and easy to deploy, share, repurpose and reuse. The kit will also be openly available to any group or individual hosting youth movements, youth action events and social justice movements.

### The Storytelling Tool
Overall documentation for this project is available at:
https://wiki.fluidproject.org/display/fluid/Storytelling+and+Story-gathering+Resources%2C+Tools+and+Examples

This repository represents the user interface portion of the Storytelling Tool, a project which anyone can use to share their story with the world in a way that is inclusive and accessible. The project uses [Fluid Infusion](https://fluidproject.org/infusion.html), so it is assumed that anyone working on it will have some familiarity with Infusion's syntax and philosophy.

The repository includes a few grades:
- `sjrk.storyTelling.templateManager`, which renders html templates using data specified via the options `{that}.options.templateStrings`. Two endpoints are included in `templateStrings` to help organize values: `uiStrings` for DOM ID's or CSS classes and `localizedMessages` for localized UI strings. Template and message bundle options are configured at `{that}.options.templateConfig`. Localization of content is specified at `{that}.options.templateConfig.locale`, but this is set at the highest level by the `uiManager` (more on this below)
- `sjrk.storyTelling.binder`, which is an implementation of `gpii.binder` to link DOM elements to model values that also provides a couple of events to tie into the `ui` grade (below).
- `sjrk.storyTelling.ui`, which can be used to set up UI contexts (pages). Every UI has a `story` component to represent its data and a `templateManager` to handle rendering. It also loads UI-related values into the template manager's `uiStrings` endpoint from `{that}.options.interfaceControlStrings`.
- `sjrk.storyTelling.ui.editor` is an extension of `ui` that provides an editing interface for stories. It has a handlebars template associated with it called `storyEdit.handlebars`. It also contains a `sjrk.storyTelling.binder`.
- `sjrk.storyTelling.ui.previewer`, which is similar to `editor`, except it doesn't have a binder since its purpose is to preview a story after editing. It includes some logic to resolve 'friendly' localized names for the story's internal language value. It has a handlebars template associated with it called `storyView.handlebars`.
- `sjrk.storyTelling.uiManager`, the overall Storytelling Tool interface management grade. It has a `fluid.textToSpeech`, called storySpeaker, for reading out the various stories on demand. It also has a subcomponent for each context/page in the tool and manages communication of relevant information between them.

### Installing
Run `npm install` to install all of the package's dependencies.

### Running
You may use any webserver software that can run Node.js packages. E.g. using [Browsersync](https://www.browsersync.io/) via the command `browser-sync start -s -f "**"`, the site will be available at `http://localhost:3000/`, and the `index.html` file will automatically be opened in a local browser window.

### Testing
Testing is provided by [jqUnit](https://docs.fluidproject.org/infusion/development/jqUnit.html). If the site is being run at `http://localhost:3000/`, navigate to `http://localhost:3000/tests/all-tests.html` to see the results of all tests and see further details of individual tests.

### Licenses
The SJRK Storytelling Tool is provided under either the New BSD license or the Educational Community License, Version 2.0. Please see LICENSE.txt for more details.
