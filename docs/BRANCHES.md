# Branches used for Storytelling Tool deployment

Various branches are present in [the main fork of this repository](https://github.com/fluid-project/sjrk-story-telling),
each of which has a specific purpose, such as being used to deploy particular versions of the site. The `master` branch
is an exception in that it is used both as the main branch of the project from which all new development should be started
(see [CONTRIBUTING.md](../CONTRIBUTING.md) for more info on that process), as well as the branch from which the Staging
site is deployed.

Authoring new stories is normally disabled on all deployed versions except the Staging site.

| Branch name                         | Site | Description |
| ----------------------------------- | ---- | ----------- |
| `master`                            | [The Storytelling Project staging site](https://staging-stories.floeproject.org/) | Stories on this site are cleared every 24 hours, it is intended purely as a sandbox demonstration of the Storytelling Tool |
| `stories-cities-production`         | [Co-designing Inclusive Cities Stories site](https://stories.cities.inclusivedesign.ca/) | Part of the larger [Co-designing Inclusive Cities](https://cities.inclusivedesign.ca/) project |
| `stories-floe-production`           | [The Storytelling Project production site](https://stories.floeproject.org/) | This site is set up as part of our work on learning self-reflection and metacognition. More information is available on the site itself |
| `stories-karisma-production`        | [El planeta es la escuela](https://karisma-stories.floeproject.org/) | Stories gathered in Colombia under the banner of *El planeta es la escuela*, part of the [Social Justice Repair Kit](https://www.sojustrepairit.org/) project |
| `stories-sojustrepairit-production` | [Social Justice Repair Kit Stories site](http://stories.sojustrepairit.org/) | Part of the larger [Social Justice Repair Kit](https://www.sojustrepairit.org/) project |
