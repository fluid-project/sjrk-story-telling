/*
Copyright 2018 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

(function ($, fluid) {

    "use strict";

    // Provides the Learning Reflections framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.learningReflections", {
        gradeNames: ["sjrk.storyTelling.page"],
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsMasthead}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            },
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsFooter}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            menu: {
                options: {
                    menuConfig: {
                        templateValues: {
                            "menu_browseLinkUrl": "storyBrowse.html"
                        }
                    }
                }
            },
            // masthead/banner section
            learningReflectionsMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-pageHeading-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-masthead.handlebars",
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            },
            // footer section
            learningReflectionsFooter: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-pageFooter-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-footer.handlebars",
                                    resourcePrefix: "../../.."
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
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            },
            storyViewer: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../../.."
                                }
                            }
                        },
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        templateConfig: {
                                                            resourcePrefix: "../../.."
                                                        }
                                                    }
                                                }
                                            }
                                        }
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
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            },
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "../../img/icons/icon-heartBook-thumbnail.png"
                    },
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Learning Reflections shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.learningReflections.storyEdit", {
        gradeNames: ["sjrk.storyTelling.learningReflections", "sjrk.storyTelling.page.storyEdit"],
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{learningReflectionsIntro}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            },
            storyEditor: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../../.."
                                }
                            }
                        },
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        templateConfig: {
                                                            resourcePrefix: "../../.."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            storyPreviewer: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    resourcePrefix: "../../.."
                                }
                            }
                        },
                        blockManager: {
                            options: {
                                dynamicComponents: {
                                    managedViewComponents: {
                                        options: {
                                            components: {
                                                templateManager: {
                                                    options: {
                                                        templateConfig: {
                                                            resourcePrefix: "../../.."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // introductory content
            learningReflectionsIntro: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-introduction-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/learningReflections/messages/learningReflectionMessages.json",
                                    templatePath: "%resourcePrefix/src/learningReflections/templates/learningReflections-introduction.handlebars",
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
