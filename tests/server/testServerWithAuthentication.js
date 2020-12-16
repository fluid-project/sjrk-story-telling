/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

require("../../src/server/middleware/basicAuth");
require("../../src/server/middleware/saveStoryFile");
require("../../src/server/middleware/staticMiddlewareSubdirectoryFilter");
require("../../src/server/dataSource");
require("../../src/server/serverSetup");
require("../../src/server/authorsRequestHandlers");
require("../../src/server/staticRequestHandlers");
require("../../src/server/storyRequestHandlers");
require("../../src/server/validators");
require("./utils/mockDatabase.js");

kettle.loadTestingSupport();

var sjrk = fluid.registerNamespace("sjrk");
fluid.registerNamespace("sjrk.test.storyTelling.server.authentication.testDef");

// Base configuration for authentication test defs. Should be mixed in with concrete testDefs, for example in the call
// to `kettle.test.bootstrapServer`
fluid.defaults("sjrk.test.storyTelling.server.authentication.testDef.base", {
    port: 8082,
    events: {
        refreshRequests: null
    },
    listeners: {
        "onCreate.createRequests": "{that}.events.refreshRequests"
    },
    testOpts: {
        signup: {
            email: "test@example.com",
            password: "test-pass",
            confirm: "test-pass"
        },
        signupResponse: {
            email: "test@example.com"
        },
        logoutResponse: "logout successful"
    },
    components: {
        testDB: {
            type: "sjrk.test.storyTelling.server.mockDatabase"
        },
        login: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/authors/login",
                method: "POST"
            }
        },
        logout: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/authors/logout",
                method: "POST"
            }
        },
        signup: {
            type: "kettle.test.request.httpCookie",
            createOnEvent: "refreshRequests",
            options: {
                path: "/authors/signup",
                method: "POST"
            }
        }
    },
    distributeOptions: {
        "server.port": {
            source: "{that}.options.port",
            target: "{that server}.options.port"
        },
        "request.port": {
            source: "{that}.options.port",
            target: "{that kettle.test.request.http}.options.port"
        }
    }
});

// signup test defs
sjrk.test.storyTelling.server.authentication.testDef.signup = {
    gradeNames: ["sjrk.test.storyTelling.server.authentication.testDef.base"],
    name: "Test Authentication workflow: signup",
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    expect: 32,
    testOpts: {
        missingEmail: {
            password: "test-pass",
            confirm: "test-pass"
        },
        missingPassword: {
            email: "missingPassword@example.com",
            confirm: "test-pass"
        },
        missingConfirm: {
            email: "missingConfirm@example.com",
            password: "test-pass"
        },
        malformedEmail: {
            email: "email",
            password: "test-pass",
            confirm: "test-pass"
        },
        malformedPassword: {
            email: "malformedPassword@example.com",
            password: "test-p",
            confirm: "test-p"
        },
        mismatchedPassword: {
            email: "mismatchedPassword@example.com",
            password: "test-pass",
            confirm: "test-password"
        },
        alreadyLoggedInErrorMessage: "An account is already logged in.",
        duplicateErrorMsg: "Account already exists for test@example.com",
        invalidRequestErrorMsg: "Your request was invalid.  See the errors for details.",
        mismatchedPasswordErrorMsg: "The password and confirmation password do not match."
    },
    sequence: [{
        // wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    }, {
        // successful signup
        func : "{signup}.send",
        args: ["{that}.options.testOpts.signup"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: {
            message: "valid signup",
            request: "{signup}",
            statusCode: 200,
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.signupResponse"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt signup while logged in
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup while logged in",
            request: "{signup}",
            statusCode: 409,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.alreadyLoggedInErrorMessage"
        }
    }, {
        // cleanup: logout - account still exists in the database
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: {
            plainText: true,
            message: "attempt logout after signup",
            request: "{logout}",
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.logoutResponse"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt signup with duplicate e-mail
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup with existing e-mail",
            request: "{signup}",
            statusCode: 409,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.duplicateErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with no fields filled
        func: "{signup}.send"
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup without any fields filled",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with no email
        func: "{signup}.send",
        args: ["{that}.options.testOpts.missingEmail"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup without e-mail",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with no password
        func: "{signup}.send",
        args: ["{that}.options.testOpts.missingPassword"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup without password",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with no password confirmation
        func: "{signup}.send",
        args: ["{that}.options.testOpts.missingConfirm"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup without password confirmation",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with malformed e-mail
        func: "{signup}.send",
        args: ["{that}.options.testOpts.malformedEmail"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup with malformed e-mail",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with malformed password
        func: "{signup}.send",
        args: ["{that}.options.testOpts.malformedPassword"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup with malformed password",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attemp signup with mismatched passwords
        func: "{signup}.send",
        args: ["{that}.options.testOpts.mismatchedPassword"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt signup with mismatched password and confirmation",
            request: "{signup}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.mismatchedPasswordErrorMsg"
        }
    }]
};

// login test defs
sjrk.test.storyTelling.server.authentication.testDef.login = {
    gradeNames: ["sjrk.test.storyTelling.server.authentication.testDef.base"],
    name: "Test Authentication workflow: login",
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    expect: 27,
    testOpts: {
        login: {
            email: "test@example.com",
            password: "test-pass"
        },
        loginResponse: {
            email: "test@example.com"
        },
        invalidEmail: {
            email: "invalid@example.com",
            password: "test-pass"
        },
        invalidPassword: {
            email: "test@example.com",
            password: "invalid-pass"
        },
        missingEmail: {
            password: "test-pass"
        },
        missingPassword: {
            email: "test@example.com"
        },
        alreadyLoggedInErrorMessage: "An account is already logged in.",
        unauthorizedErrorMessage: "Unauthorized",
        invalidRequestErrorMsg: "Your request was invalid.  See the errors for details."
    },
    sequence: [{
        // wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    }, {
        // setup: signup to provide an account to login with
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: {
            message: "valid signup",
            request: "{signup}",
            statusCode: 200,
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.signupResponse"
        }
    }, {
        // setup: logout so that there are no active users.
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: {
            plainText: true,
            message: "attempt logout after signup",
            request: "{logout}",
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.logoutResponse"
        }
    }, {
        // setup: cleanup request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt valid login
        func: "{login}.send",
        args: ["{that}.options.testOpts.login"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: {
            message: "valid login",
            request: "{login}",
            statusCode: 200,
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.loginResponse"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login while already logged in
        func: "{login}.send",
        args: ["{that}.options.testOpts.login"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login while already logged in",
            request: "{login}",
            statusCode: 409,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.alreadyLoggedInErrorMessage"
        }
    }, {
        // cleanup: logout so that there are no active users.
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: {
            plainText: true,
            message: "attempt logout after login",
            request: "{logout}",
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.logoutResponse"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login with invalid e-mail
        func: "{login}.send",
        args: ["{that}.options.testOpts.invalidEmail"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login with invalid e-mail",
            request: "{login}",
            statusCode: 401,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.unauthorizedErrorMessage"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login with invalid password
        func: "{login}.send",
        args: ["{that}.options.testOpts.invalidPassword"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login with invalid password",
            request: "{login}",
            statusCode: 401,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.unauthorizedErrorMessage"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login without credentials
        func: "{login}.send"
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login without credentials",
            request: "{login}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login without e-mail
        func: "{login}.send",
        args: ["{that}.options.testOpts.missingEmail"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login without e-mail",
            request: "{login}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // attempt login without password
        func: "{login}.send",
        args: ["{that}.options.testOpts.missingPassword"]
    }, {
        event: "{login}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "attempt login without password",
            request: "{login}",
            statusCode: 400,
            string: "{arguments}.0",
            errorTexts: "{that}.options.testOpts.invalidRequestErrorMsg"
        }
    }]
};

// logout test defs
sjrk.test.storyTelling.server.authentication.testDef.logout = {
    gradeNames: ["sjrk.test.storyTelling.server.authentication.testDef.base"],
    name: "Test Authentication workflow: logout",
    config: {
        configName: "sjrk.storyTelling.server.test",
        configPath: "./tests/server/configs"
    },
    expect: 7,
    sequence: [{
        // wait for database to initialize
        event: "{testDB}.events.onReady",
        listener: "jqUnit.assert",
        args: ["The database is initialized"]
    }, {
        // logout - no user logged in
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: {
            plainText: true,
            message: "attempt logout when no user logged in",
            request: "{logout}",
            string: "{arguments}.0",
            expected: "logout successful"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // successful signup
        func: "{signup}.send",
        args: ["{that}.options.testOpts.signup"]
    }, {
        event: "{signup}.events.onComplete",
        listener: "kettle.test.assertJSONResponse",
        args: {
            message: "valid signup",
            request: "{signup}",
            statusCode: 200,
            string: "{arguments}.0",
            expected: "{that}.options.testOpts.signupResponse"
        }
    }, {
        // cleanup: reset request components
        func: "{that}.events.refreshRequests.fire"
    }, {
        // logout - user logged in
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "kettle.test.assertResponse",
        args: {
            plainText: true,
            message: "attempt logout after signup",
            request: "{logout}",
            string: "{arguments}.0",
            expected: "logout successful"
        }
    }]
};

// starts up the test server based on the provided definitions
kettle.test.bootstrapServer([
    sjrk.test.storyTelling.server.authentication.testDef.signup,
    sjrk.test.storyTelling.server.authentication.testDef.login,
    sjrk.test.storyTelling.server.authentication.testDef.logout
]);
