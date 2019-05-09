/*
Copyright 2018 OCAD University
Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function ($, fluid) {

    // Provides the Karisma "El planeta es la escuela" framing to the Storytelling Tool
    fluid.defaults("sjrk.storyTelling.karisma", {
        gradeNames: ["sjrk.storyTelling.page"],
        components: {
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
                                    messagesPath: "%resourcePrefix/themes/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/themes/karisma/templates/karisma-masthead.handlebars"
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
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyView"]
    });

    // Applies the Karisma shell to the storyBrowse page
    fluid.defaults("sjrk.storyTelling.karisma.storyBrowse", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyBrowse"],
        components: {
            storyBrowser: {
                options: {
                    browserConfig: {
                        placeholderThumbnailUrl: "/themes/karisma/img/logo.png"
                    }
                }
            }
        }
    });

    // Applies the Karisma shell to the storyEdit page
    fluid.defaults("sjrk.storyTelling.karisma.storyEdit", {
        gradeNames: ["sjrk.storyTelling.karisma", "sjrk.storyTelling.page.storyEdit"],
        components: {
            karismaSidebarLeft: {
                type: "sjrk.storyTelling.ui",
                container: ".sjrkc-edit-left-container",
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/themes/karisma/templates/karisma-sidebar-left.handlebars"
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
                                    messagesPath: "%resourcePrefix/themes/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/themes/karisma/templates/karisma-sidebar-right.handlebars"
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
        components: {
            menu: {
                options: {
                    components: {
                        templateManager: {
                            options: {
                                templateConfig: {
                                    templatePath: "%resourcePrefix/themes/karisma/templates/karisma-menu.handlebars"
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
                                        welcomer_browseLinkUrl: "storyBrowse.html",
                                        welcomer_editLinkUrl: "storyEdit.html"
                                    }
                                },
                                templateConfig: {
                                    messagesPath: "%resourcePrefix/themes/karisma/messages/karismaMessages.json",
                                    templatePath: "%resourcePrefix/themes/karisma/templates/karisma-welcome.handlebars"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
