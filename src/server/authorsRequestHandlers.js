/*
For copyright information, see the AUTHORS.md file in the docs directory of this distribution and at
https://github.com/fluid-project/sjrk-story-telling/blob/main/docs/AUTHORS.md

Licensed under the New BSD license. You may not use this file except in compliance with this licence.
You may obtain a copy of the BSD License at
https://raw.githubusercontent.com/fluid-project/sjrk-story-telling/main/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var { v4: uuidv4 } = require("uuid");
require("kettle");

var sjrk = fluid.registerNamespace("sjrk");

fluid.defaults("sjrk.storyTelling.server.signupHandler", {
    gradeNames: ["kettle.request.http", "kettle.request.sessionAware"],
    requestMiddleware: {
        validate: {
            middleware: "{sjrk.storyTelling.server.signupValidator}"
        }
    },
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleSignupRequest",
            args: ["{request}", "{expressUserUtils}"]
        }
    }
});

/**
 * Creates a new user account and stores it to the database
 *
 * @param {Object} request - a Kettle request
 * @param {Component} expressUserUtils - an instance of `fluid.express.user.utils`
 */
sjrk.storyTelling.server.handleSignupRequest = function (request, expressUserUtils) {
    if (request.req.session.authorID) {
        request.events.onError.fire({
            statusCode: 409,
            message: "An account is already logged in."
        });
        return;
    }

    if (request.req.body.password !== request.req.body.confirm) {
        request.events.onError.fire({
            statusCode: 400,
            message: "The password and confirmation password do not match."
        });
        return;
    }

    expressUserUtils.byUsernameOrEmailReader.get({username: request.req.body.email}).then(function (body) {
        if (body.email) {
            request.events.onError.fire({
                statusCode: 409,
                message: "Account already exists for " + request.req.body.email
            });
            return;
        } else {
            var promise = expressUserUtils.createNewUser({
                email: request.req.body.email,
                password: request.req.body.password,
                authorID: uuidv4()
            });

            promise.then(function (record) {
                request.req.session.authorID = record.authorID;
                request.events.onSuccess.fire({
                    email: record.email
                });
            }, function () {
                request.events.onError.fire({
                    statusCode: 409,
                    message: "Unable to create account."
                });
            });
        }
    }, function () {
        request.events.onError.fire({
            statusCode: 500
        });
        return;
    });
};

fluid.defaults("sjrk.storyTelling.server.loginHandler", {
    gradeNames: ["kettle.request.http", "kettle.request.sessionAware"],
    requestMiddleware: {
        validate: {
            middleware: "{sjrk.storyTelling.server.loginValidator}"
        }
    },
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleLoginRequest",
            args: ["{request}", "{expressUserUtils}"]
        }
    }
});

/**
 * Logs in an existing user with the password and username provided in the request.
 *
 * @param {Object} request - a Kettle request
 * @param {Component} expressUserUtils - an instance of `fluid.express.user.utils`
 */
sjrk.storyTelling.server.handleLoginRequest = function (request, expressUserUtils) {
    if (request.req.session.authorID) {
        request.events.onError.fire({
            statusCode: 409,
            message: "An account is already logged in."
        });
        return;
    }

    var promise = expressUserUtils.unlockUser(request.req.body.email, request.req.body.password);

    promise.then(function (record) {
        request.req.session.authorID = record.authorID;
        request.events.onSuccess.fire({
            email: record.email
        });
    }, function () {
        request.events.onError.fire({
            statusCode: 401
        });
    });
};

fluid.defaults("sjrk.storyTelling.server.logoutHandler", {
    gradeNames: ["kettle.request.http", "kettle.request.sessionAware"],
    invokers: {
        handleRequest: {
            funcName: "sjrk.storyTelling.server.handleLogoutRequest",
            args: ["{request}"]
        }
    }
});

/**
 * Logs out of the session
 *
 * @param {Object} request - a Kettle request
 */
sjrk.storyTelling.server.handleLogoutRequest = function (request) {
    request.req.session.destroy();
    request.events.onSuccess.fire("logout successful");
};
