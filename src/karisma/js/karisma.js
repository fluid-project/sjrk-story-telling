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
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{karismaMasthead}.templateManager.model.locale",
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
                    components: {
                        templateManager: {
                            options: {
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

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyBrowse"],
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
                        placeholderThumbnailUrl: "/src/karisma/img/logo.png"
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

    // Applies the Karisma shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.karisma.storyEdit", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyEdit"],
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
                                    resourcePrefix: "../../.."
                                }
                            }
                        }
                    }
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
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-sidebar-left.handlebars",
                                    resourcePrefix: "../../.."
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
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-sidebar-right.handlebars",
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
            }
        }
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.karismaWelcome", {
        gradeNames: ["sjrk.storyTelling.karisma"],
        modelRelay: [
            {
                source: "{that}.model.uiLanguage",
                target: "{karismaWelcomer}.templateManager.model.locale",
                singleTransform: {
                    type: "fluid.transforms.identity"
                }
            }
        ],
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
                    menuConfig: {
                        templateValues: {
                            "menu_browseLinkUrl": "/src/karisma/html/storyBrowse.html",
                            "menu_editLinkUrl": "/src/karisma/html/storyEdit.html"
                        }
                    },
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-menu.handlebars",
                                    resourcePrefix: "../../.."
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
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/src/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/src/karisma/templates/karisma-welcome.handlebars",
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
