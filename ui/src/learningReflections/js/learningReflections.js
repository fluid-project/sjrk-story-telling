/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.learningReflections", {
        gradeNames: ["sjrk.storyTelling.page"],
        pageSetup: {
            browseLinkUrl: "storyBrowse.html",
            buildLinkUrl: "storyEdit.html"
        },
        components: {
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        resourcePrefix: "{that}.options.templateConfig.resourcePrefix",
                                        browseLinkUrl: "{page}.options.pageSetup.browseLinkUrl",
                                        buildLinkUrl: "{page}.options.pageSetup.buildLinkUrl"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-masthead.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // footer section
            learningReflectionsFooter: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-footer-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        resourcePrefix: "{that}.options.templateConfig.resourcePrefix"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-footer.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Learning Reflections shell to the storyView page
    fluid.defaults("sjrk.storyTelling.learningReflections.storyView", {
        gradeNames: ["sjrk.storyTelling.learningReflections", "sjrk.storyTelling.page.storyView"],
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Learning Reflections shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.learningReflections.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.learningReflections", "sjrk.storyTelling.page.storyBrowse"],
        pageSetup: {
            browseLinkUrl: "" // hide the Browse link on the Browse page
        },
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "src/img/icons/Book.svg"
                    }
                }
            }
        }
    });

    // Applies the Learning Reflections shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.learningReflections.storyEdit", {
        gradeNames: ["sjrk.storyTelling.learningReflections", "sjrk.storyTelling.page.storyEdit"],
        pageSetup: {
            buildLinkUrl: "" // hide the Edit link on the Edit page
        }
    });

    fluid.defaults("sjrk.storyTelling.learningReflections.introduction", {
        gradeNames: ["sjrk.storyTelling.learningReflections", "sjrk.storyTelling.page"],
        components: {
            // introductory content
            learningReflectionsIntro: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-introduction",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-introduction.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
