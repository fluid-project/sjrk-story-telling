/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Karisma "El planeta es la escuela" framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.karisma.page", {
        gradeNames: ["sjrk.storyTelling.base.page"],
        pageSetup: {
            browseLinkUrl: "storyBrowse.html",
            editLinkUrl: "storyEdit.html"
        },
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        browseLinkUrl: "{page}.options.pageSetup.browseLinkUrl",
                                        editLinkUrl: "{page}.options.pageSetup.editLinkUrl"
                                    }
                                },
                                templateConfig: {
                                    templatePath: "%resourcePrefix/templates/karisma-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            // masthead/banner section
            karismaMasthead: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-page-header-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        homePageUrl: "/"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-masthead.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyView page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyView", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyView"]
    });

    // Applies the Karisma shell to the storyNotFound page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyNotFound", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyNotFound"],
        distributeOptions: {
            target: "{that > notFound > templateManager}.options.templateConfig.templatePath",
            record: "%resourcePrefix/templates/karisma-storyNotFound.handlebars"
        }
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyBrowse"],
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        browsePage: true
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
                        placeholderThumbnailUrl: "img/logo.png"
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.karisma.page.storyEdit", {
        gradeNames: ["sjrk.storyTelling.karisma.page", "sjrk.storyTelling.base.page.storyEdit"],
        components: {
            karismaSidebarLeft: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-edit-left-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-sidebar-left.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaSidebarRight: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-edit-right-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-sidebar-right.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // the Karisma "Welcome" page
    fluid.defaults("sjrk.storyTelling.karisma.page.karismaWelcome", {
        gradeNames: ["sjrk.storyTelling.karisma.page"],
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        welcomer: true
                                    }
                                },
                                templateConfig: {
                                    templatePath: "%resourcePrefix/templates/karisma-menu.handlebars"
                                }
                            }
                        }
                    }
                }
            },
            karismaWelcomer: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-st-welcome",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                model: {
                                    dynamicValues: {
                                        welcomer_browseLinkUrl: "{page}.options.pageSetup.browseLinkUrl",
                                        welcomer_editLinkUrl: "{page}.options.pageSetup.editLinkUrl"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/templates/karisma-welcome.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
