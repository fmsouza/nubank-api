"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var uuid_1 = require("uuid");
var constants_1 = require("./constants");
var NubankApi = /** @class */ (function () {
    function NubankApi(accessToken, privateUrls, publicUrls) {
        if (accessToken === void 0) { accessToken = ""; }
        if (privateUrls === void 0) { privateUrls = {}; }
        if (publicUrls === void 0) { publicUrls = {}; }
        this.accessToken = accessToken;
        this.privateUrls = privateUrls;
        this.publicUrls = publicUrls;
    }
    Object.defineProperty(NubankApi.prototype, "authState", {
        get: function () {
            return {
                accessToken: this.accessToken,
                urls: this.privateUrls
            };
        },
        enumerable: true,
        configurable: true
    });
    NubankApi.prototype.login = function (cpf, password, secondStepFn) {
        return __awaiter(this, void 0, void 0, function () {
            var url, options, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUrl("login")];
                    case 1:
                        url = _a.sent();
                        if (this.accessToken && this.privateUrls) {
                            return [2 /*return*/, this.authState];
                        }
                        options = {
                            data: {
                                client_id: "other.conta",
                                client_secret: constants_1.CLIENT_SECRET,
                                grant_type: "password",
                                login: cpf,
                                password: password
                            },
                            headers: constants_1.HEADERS,
                            method: "post",
                            url: url
                        };
                        return [4 /*yield*/, axios_1.default(options)];
                    case 2:
                        data = (_a.sent()).data;
                        this.accessToken = data.access_token;
                        this.privateUrls = data._links;
                        return [2 /*return*/, this.__authenticateWithQRCode(secondStepFn)];
                }
            });
        });
    };
    NubankApi.prototype.getCardFeed = function () {
        return this.__request("get", "events").then(function (data) { return data.events; });
    };
    NubankApi.prototype.getCardTransactions = function () {
        return this.getCardFeed().then(function (feed) {
            return feed.filter(function (statement) { return statement.category === "transaction"; });
        });
    };
    NubankApi.prototype.getBills = function () {
        var _this = this;
        return this.__request("get", "bills_summary").then(function (data) {
            return Promise.all(data.bills.map(function (bill) { return _this.getBillDetails(bill); }));
        });
    };
    NubankApi.prototype.getAccountBalance = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = constants_1.GRAPHQL_QUERY_ACCOUNT_BALANCE;
                        return [4 /*yield*/, this.__request("post", "ghostflame", { query: query })];
                    case 1:
                        data = (_d.sent()).data;
                        return [2 /*return*/, (_c = (_b = (_a = data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.currentSavingsBalance) === null || _c === void 0 ? void 0 : _c.netAmount];
                }
            });
        });
    };
    NubankApi.prototype.getAccountFeed = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        query = constants_1.GRAPHQL_QUERY_ACCOUNT_FEED;
                        return [4 /*yield*/, this.__request("post", "ghostflame", { query: query })];
                    case 1:
                        data = (_d.sent()).data;
                        return [2 /*return*/, (_c = (_b = (_a = data) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.savingsAccount) === null || _c === void 0 ? void 0 : _c.feed];
                }
            });
        });
    };
    NubankApi.prototype.getAccountTransactions = function () {
        return this.getAccountFeed().then(function (feed) {
            return feed.filter(function (statement) {
                return constants_1.PAYMENT_EVENT_TYPES.includes(statement.__typename);
            });
        });
    };
    NubankApi.prototype.__authenticateWithQRCode = function (secondStepFn) {
        return __awaiter(this, void 0, void 0, function () {
            var uuid, payload, _a, access_token, _links;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        uuid = uuid_1.v4();
                        return [4 /*yield*/, secondStepFn(uuid)];
                    case 1:
                        _b.sent();
                        payload = {
                            qr_code_id: uuid,
                            type: "login-webapp"
                        };
                        return [4 /*yield*/, this.__request("post", "lift", payload)];
                    case 2:
                        _a = _b.sent(), access_token = _a.access_token, _links = _a._links;
                        this.accessToken = access_token;
                        this.privateUrls = __assign(__assign({}, this.privateUrls), _links);
                        return [2 /*return*/, this.authState];
                }
            });
        });
    };
    NubankApi.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numberOfUrls, _a, baseUrls, appUrls;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        numberOfUrls = Object.keys(this.publicUrls).length;
                        if (numberOfUrls > 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Promise.all([
                                axios_1.default.get(constants_1.DISCOVERY_URL).then(function (r) { return r.data; }),
                                axios_1.default.get(constants_1.DISCOVERY_APP_URL).then(function (r) { return r.data; })
                            ])];
                    case 1:
                        _a = _b.sent(), baseUrls = _a[0], appUrls = _a[1];
                        this.publicUrls = __assign(__assign({}, baseUrls), appUrls);
                        return [2 /*return*/];
                }
            });
        });
    };
    NubankApi.prototype.getUrl = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (this.publicUrls[id]) {
                            return [2 /*return*/, this.publicUrls[id]];
                        }
                        if (this.privateUrls[id]) {
                            return [2 /*return*/, this.privateUrls[id].href];
                        }
                        throw new Error("URL for '" + id + "' does not exist.");
                }
            });
        });
    };
    NubankApi.prototype.isUrl = function (url) {
        return url.startsWith("http");
    };
    NubankApi.prototype.__request = function (method, id, body, params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, options, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.isUrl(id)) return [3 /*break*/, 1];
                        _a = id;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getUrl(id)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        url = _a;
                        options = {
                            data: body,
                            headers: __assign(__assign({}, constants_1.HEADERS), { Authorization: "Bearer " + this.accessToken }),
                            method: method,
                            params: params,
                            url: url
                        };
                        return [4 /*yield*/, axios_1.default(options)];
                    case 4:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    NubankApi.prototype.getBillDetails = function (bill) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = ((_c = (_b = (_a = bill) === null || _a === void 0 ? void 0 : _a._links) === null || _b === void 0 ? void 0 : _b.self) === null || _c === void 0 ? void 0 : _c.href) || "";
                        if (!url) {
                            return [2 /*return*/, bill];
                        }
                        return [4 /*yield*/, this.__request("get", url)];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, response.bill];
                }
            });
        });
    };
    return NubankApi;
}());
exports.default = NubankApi;
