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
- `sjrk.storyTelling.templatedComponent` which renders html templates using data available in a model. These are specified via the options `{that}.model.templateTerms` and `{templateLoader}.resources.componentTemplate`. It can also load UI-related values into the template, for example DOM ID's or CSS classes, which should be specified in `{that}.options.interfaceControlStrings`. There are extensions of this grade to provide:
  - binding to DOM input elements `sjrk.storyTelling.templatedComponentWithBinder`
  - localization of content `sjrk.storyTelling.templatedComponentWithLocalization` using another loader component called `{messageLoader}`
- `sjrk.storyTelling.story.ui`, a `templatedComponentWithLocalization` that can be used to set up UI contexts (pages) and includes a text-to-speech component.
- `sjrk.storyTelling.storyAuthoring`, the overall Storytelling Tool interface management grade. It has a subcomponent for each context/page in the tool and manages communication between them:
  - `sjrk.storyTelling.story.storyEditor`
  - `sjrk.storyTelling.story.storyViewer`

### Installing
Run `npm install` to install all of the package's dependencies.

### Running
You may use any webserver software that can run Node.js packages. E.g. using [Browsersync](https://www.browsersync.io/) via the command `browser-sync start -s -f "**"`, the site will be available at `http://localhost:3000/`, and the `index.html` file will automatically be opened in a local browser window.

### Testing
Testing is provided by [jqUnit](https://docs.fluidproject.org/infusion/development/jqUnit.html). If the site is being run at `http://localhost:3000/`, navigate to `http://localhost:3000/tests/all-tests.html` to see the results of all tests and see further details of individual tests.

### Licenses
The SJRK Storytelling Tool is provided under either the New BSD license or the Educational Community License, Version 2.0. Please see LICENSE.txt for more details.
