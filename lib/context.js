"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var http_1 = require("./utils/http");
var auth_1 = require("./auth");
var account_1 = require("./account");
var card_1 = require("./card");
var payment_1 = require("./payment");
var Context = /** @class */ (function () {
    function Context(params) {
        this._http = new http_1.Http(params);
        this._auth = new auth_1.Auth(this);
        this._account = new account_1.Account(this);
        this._card = new card_1.Card(this);
        this._payment = new payment_1.Payment(this);
    }
    Object.defineProperty(Context.prototype, "authState", {
        get: function () {
            return this._http.authState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "http", {
        get: function () {
            return this._http;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "auth", {
        get: function () {
            return this._auth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "account", {
        get: function () {
            return this._account;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "card", {
        get: function () {
            return this._card;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "payment", {
        get: function () {
            return this._payment;
        },
        enumerable: false,
        configurable: true
    });
    return Context;
}());
exports.Context = Context;
