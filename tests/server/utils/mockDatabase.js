/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

require("../../../src/server/db/authors-dbConfiguration");
require("../../../src/server/db/story-dbConfiguration");
require("fluid-pouchdb");

fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.test.storyTelling.server.mockDatabase", {
    gradeNames: ["fluid.component"],
    events: {
        authorsDBReady: null,
        storiesDBReady: null,
        onReady: {
            events: {
                authorsDBReady: "authorsDBReady",
                storiesDBReady: "storiesDBReady"
            }
        }
    },
    url: {
        port: 6789,
        host: "localhost",
        scheme: "http",
        template: "%scheme://%host:%port"
    },
    couchUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["{that}.options.url.template", "{that}.options.url"]
        }
    },
    distributeOptions: {
        pouchPort: {
            source: "{that}.options.url.port",
            target: "{that pouchHarness}.options.port"
        },
        couchUrl: {
            source: "{that}.options.couchUrl",
            target: "{that fluid.couchConfig.pipeline.retrying}.options.couchOptions.couchUrl"
        }
    },
    components: {
        pouchHarness: {
            type: "fluid.pouch.harness"
        },
        authorsDBConfig: {
            type: "sjrk.storyTelling.server.authorsDb",
            createOnEvent: "{pouchHarness}.events.onReady",
            options: {
                listeners: {
                    "onCreate.configureCouch": "{that}.configureCouch",
                    "onSuccess.escalate": "{testDB}.events.authorsDBReady"
                }
            }
        },
        storiesDBConfig: {
            type: "sjrk.storyTelling.server.storiesDb",
            createOnEvent: "{pouchHarness}.events.onReady",
            options: {
                listeners: {
                    "onCreate.configureCouch": "{that}.configureCouch",
                    "onSuccess.escalate": "{testDB}.events.storiesDBReady"
                }
            }
        }
    }
});
