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
exports.Http = void 0;
var axios_1 = require("axios");
var https_1 = require("https");
var fs_1 = require("fs");
var constants_1 = require("../constants");
var Http = /** @class */ (function () {
    function Http(params) {
        if (params === void 0) { params = {}; }
        var _a, _b, _c, _d, _e;
        this._accessToken = "";
        this._refreshToken = "";
        this._certPath = params === null || params === void 0 ? void 0 : params.certPath;
        this.accessToken = (_a = params === null || params === void 0 ? void 0 : params.accessToken) !== null && _a !== void 0 ? _a : "";
        this.refreshToken = (_b = params === null || params === void 0 ? void 0 : params.refreshToken) !== null && _b !== void 0 ? _b : "";
        this.refreshBefore = (_c = params === null || params === void 0 ? void 0 : params.refreshBefore) !== null && _c !== void 0 ? _c : "";
        this._privateUrls = (_d = params === null || params === void 0 ? void 0 : params.privateUrls) !== null && _d !== void 0 ? _d : {};
        this._publicUrls = (_e = params === null || params === void 0 ? void 0 : params.publicUrls) !== null && _e !== void 0 ? _e : {};
    }
    Object.defineProperty(Http.prototype, "authState", {
        get: function () {
            return {
                accessToken: this._accessToken,
                refreshToken: this._refreshToken,
                refreshBefore: this._refreshBefore,
                privateUrls: this._privateUrls,
                publicUrls: this._publicUrls,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "accessToken", {
        set: function (accessToken) {
            this._accessToken = accessToken;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "refreshToken", {
        set: function (refreshToken) {
            this._refreshToken = refreshToken;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "refreshBefore", {
        set: function (datetime) {
            this._refreshBefore = new Date(datetime);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Http.prototype, "privateUrls", {
        set: function (privateUrls) {
            this._privateUrls = privateUrls;
        },
        enumerable: false,
        configurable: true
    });
    Http.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numberOfUrls, _a, baseUrls, appUrls;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        numberOfUrls = Object.keys(this._publicUrls).length;
                        if (numberOfUrls > 0) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Promise.all([
                                axios_1.default.get(constants_1.DISCOVERY_URL).then(function (r) { return r.data; }),
                                axios_1.default.get(constants_1.DISCOVERY_APP_URL).then(function (r) { return r.data; }),
                            ])];
                    case 1:
                        _a = _b.sent(), baseUrls = _a[0], appUrls = _a[1];
                        this._publicUrls = __assign(__assign({}, baseUrls), appUrls);
                        return [2 /*return*/];
                }
            });
        });
    };
    Http.prototype.request = function (method, id, body, params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, headers, httpsAgent, certStream, options, data;
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
                        headers = __assign({}, constants_1.HEADERS);
                        if (this._accessToken) {
                            // tslint:disable-next-line
                            headers["Authorization"] = "Bearer ".concat(this._accessToken);
                        }
                        if (this._certPath) {
                            certStream = (0, fs_1.readFileSync)(this._certPath);
                            httpsAgent = new https_1.Agent({
                                rejectUnauthorized: false,
                                passphrase: "",
                                pfx: certStream, // TODO: Fix error when certificate is added
                            });
                        }
                        options = {
                            data: body,
                            headers: headers,
                            method: method,
                            params: params,
                            url: url,
                            httpsAgent: httpsAgent,
                        };
                        return [4 /*yield*/, (0, axios_1.default)(options)];
                    case 4:
                        data = (_b.sent()).data;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Http.prototype.graphql = function (query, variables) {
        return this.request("post", "ghostflame", { query: query, variables: variables });
    };
    Http.prototype.getUrl = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        if (this._publicUrls[id]) {
                            return [2 /*return*/, this._publicUrls[id]];
                        }
                        if (this._privateUrls[id]) {
                            return [2 /*return*/, this._privateUrls[id].href];
                        }
                        throw new Error("URL for '".concat(id, "' does not exist."));
                }
            });
        });
    };
    Http.prototype.clearSession = function () {
        this._accessToken = "";
        this._refreshToken = "";
        this._refreshBefore = undefined;
        this._privateUrls = {};
    };
    Http.prototype.isUrl = function (url) {
        return url.startsWith("http");
    };
    return Http;
}());
exports.Http = Http;
