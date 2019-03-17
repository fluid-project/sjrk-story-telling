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
        components: {
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{that}.options.templateConfig"]
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/themes/learningReflections/templates/learningReflections-masthead.handlebars"
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
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{that}.options.templateConfig"]
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/themes/learningReflections/templates/learningReflections-footer.handlebars"
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
                                    messagesPath: "%resourcePrefix/themes/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/themes/learningReflections/templates/learningReflections-menu.handlebars"
                                },
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{that}.options.linkConfig.templateValues"]
                                    }
                                },
                                linkConfig: {
                                    templateValues: {
                                        "contextLinkUrl": "storyEdit.html",
                                        "secondaryLinkUrl": "storyBrowse.html"
                                    }
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
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/themes/learningReflections/templates/learningReflections-menu.handlebars"
                                },
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{that}.options.linkConfig.templateValues"]
                                    }
                                },
                                linkConfig: {
                                    templateValues: {
                                        "contextLinkUrl": "storyEdit.html"
                                    }
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
        components: {
            // introductory content
            learningReflectionsIntro: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-introduction-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                linkConfig: {
                                    templateValues: {
                                        "contextLinkUrl": "storyBrowse.html"
                                    }
                                },
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{that}.options.linkConfig.templateValues"]
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/themes/learningReflections/templates/learningReflections-introduction.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
