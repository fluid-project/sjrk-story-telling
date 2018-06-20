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

    // Provides the Karisma "El planeta es la escuela" framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.karisma", {
        gradeNames: ["sjrk.storyTelling.page"],
        pageSetup: {
            resourcePrefix: "../../.."
        },
        components: {
            menu: {
                options: {
                    menuConfig: {
                        templateValues: {
                            "menu_browseLinkUrl": "/src/karisma/html/storyBrowse.html"
                        }
                    }
                }
            },
            // masthead/banner section
            karismaMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-pageHeading-container",
                options: {
                    mastheadConfig: {
                        templateValues: {
                            "homePageUrl": "/"
                        }
                    },
                    components: {
                        templateManager: {
                            options: {
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{karismaMasthead}.options.mastheadConfig.templateValues"]
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-masthead.handlebars",
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyView page
    fluid.defaults("sjrk.storyTelling.karisma.storyView", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyView"],
        pageSetup: {
            resourcePrefix: "../../.."
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            }
        }
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyBrowse"],
        pageSetup: {
            resourcePrefix: "../../.."
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "/src/karisma/img/logo.png"
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.karisma.storyEdit", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyEdit"],
        pageSetup: {
            resourcePrefix: "../../.."
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            karismaSidebarLeft: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-sidebar-left-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-sidebar-left.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaSidebarRight: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-sidebar-right-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-sidebar-right.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.karismaWelcome", {
        gradeNames: ["sjrk.storyTelling.karisma"],
        pageSetup: {
            resourcePrefix: "../../.."
        },
        components: {
            uio: {
                options: {
                    terms: {
                        "templatePrefix": "../../../node_modules/infusion/src/framework/preferences/html",
                        "messagePrefix": "/src/messages/uio"
                    },
                    "tocTemplate": "../../../node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html"
                }
            },
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaWelcomer: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-storyTelling-welcome",
                options: {
                    welcomerConfig: {
                        templateValues: {
                            "welcomer_browseLinkUrl": "/src/karisma/html/storyBrowse.html",
                            "welcomer_editLinkUrl": "/src/karisma/html/storyEdit.html"
                        }
                    },
                    components: {
                        templateManager: {
                            options: {
                                listeners: {
                                    "onAllResourcesLoaded.renderTemplate": {
                                        funcName: "{that}.renderTemplate",
                                        args: ["{karismaWelcomer}.options.welcomerConfig.templateValues"]
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-welcome.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
