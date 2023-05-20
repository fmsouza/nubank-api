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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.Auth = void 0;
var constants_1 = require("./constants");
var cert_1 = require("./utils/cert");
var Auth = /** @class */ (function () {
    function Auth(_context) {
        this._context = _context;
        this._keyPair = (0, cert_1.generateKeyPair)();
        this._keyPairCrypto = (0, cert_1.generateKeyPair)();
        this._encryptedCode = "";
    }
    Object.defineProperty(Auth.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Auth.prototype.authenticate = function (cpf, password) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._context.http.request("post", "login", {
                            client_id: "other.conta",
                            client_secret: constants_1.CLIENT_SECRET,
                            grant_type: "password",
                            login: cpf,
                            password: password,
                        })];
                    case 1:
                        data = _a.sent();
                        this.updateAuthState(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.authenticateWithQrCode = function (cpf, password, qrCodeId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticate(cpf, password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this._context.http.request("post", "lift", {
                                qr_code_id: qrCodeId,
                                type: "login-webapp",
                            })];
                    case 2:
                        data = _a.sent();
                        this.updateAuthState(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.authenticateWithCertificate = function (cpf, password, cert) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (cert) {
                            this._context.http.cert = cert;
                        }
                        return [4 /*yield*/, this._context.http.request("post", "token", {
                                client_id: "legacy_client_id",
                                client_secret: "legacy_client_secret",
                                grant_type: "password",
                                login: cpf,
                                password: password,
                            })];
                    case 1:
                        data = _a.sent();
                        this.updateAuthState(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.authenticateWithRefreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._context.http.request("post", "token", {
                            client_id: "legacy_client_id",
                            client_secret: "legacy_client_secret",
                            grant_type: "refresh_token",
                            refresh_token: refreshToken,
                        })];
                    case 1:
                        data = _a.sent();
                        this.updateAuthState(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    Auth.prototype.requestAuthenticationCode = function (_a) {
        var _b, _c;
        var cpf = _a.cpf, password = _a.password, deviceId = _a.deviceId;
        return __awaiter(this, void 0, void 0, function () {
            var headers, parsed;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._context.http
                            .rawRequest("post", "gen_certificate", {
                            login: cpf,
                            password: password,
                            device_id: deviceId,
                            model: [this._context.http.clientName, deviceId].join(" - "),
                            public_key: (0, cert_1.serializePublicKey)(this._keyPair.publicKey),
                            public_key_crypto: (0, cert_1.serializePublicKey)(this._keyPairCrypto.publicKey),
                        })
                            .catch(function (_a) {
                            var response = _a.response;
                            if (response.status !== 401 || !response.headers["www-authenticate"]) {
                                throw new Error("Authentication code request failed.");
                            }
                            return response;
                        })];
                    case 1:
                        headers = (_d.sent()).headers;
                        parsed = (0, cert_1.parseAuthenticationHeader)(headers["www-authenticate"]);
                        this._encryptedCode =
                            (_b = parsed.get("device-authorization_encrypted-code")) !== null && _b !== void 0 ? _b : "";
                        return [2 /*return*/, (_c = parsed.get("sent-to")) !== null && _c !== void 0 ? _c : ""];
                }
            });
        });
    };
    Auth.prototype.exchangeCertificates = function (_a) {
        var _b, _c;
        var cpf = _a.cpf, password = _a.password, deviceId = _a.deviceId, authCode = _a.authCode;
        return __awaiter(this, void 0, void 0, function () {
            var payload, data, cert, selfSignedCert, certCrypto, selfSignedCertCrypto;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this._encryptedCode) {
                            throw new Error("No encrypted code found. Did you call `requestAuthenticationCode` before exchanging certs?");
                        }
                        payload = {
                            login: cpf,
                            password: password,
                            device_id: deviceId,
                            model: [this._context.http.clientName, deviceId].join(" - "),
                            public_key: (0, cert_1.serializePublicKey)((_b = this._keyPair) === null || _b === void 0 ? void 0 : _b.publicKey),
                            public_key_crypto: (0, cert_1.serializePublicKey)((_c = this._keyPairCrypto) === null || _c === void 0 ? void 0 : _c.publicKey),
                            code: authCode,
                            "encrypted-code": this._encryptedCode,
                        };
                        return [4 /*yield*/, this._context.http.request("post", "gen_certificate", payload)];
                    case 1:
                        data = _d.sent();
                        cert = (0, cert_1.parseCertificate)(data.certificate);
                        selfSignedCert = (0, cert_1.generateSelfSignedCertificate)(this._keyPair, cert);
                        certCrypto = (0, cert_1.parseCertificate)(data === null || data === void 0 ? void 0 : data.certificate_crypto);
                        selfSignedCertCrypto = (0, cert_1.generateSelfSignedCertificate)(this._keyPairCrypto, certCrypto);
                        return [2 /*return*/, {
                                cert: (0, cert_1.pkcs12ToBuffer)(selfSignedCert),
                                certCrypto: (0, cert_1.pkcs12ToBuffer)(selfSignedCertCrypto),
                            }];
                }
            });
        });
    };
    Auth.prototype.updateAuthState = function (data) {
        var _a, _b, _c;
        this._context.http.accessToken =
            (_a = data === null || data === void 0 ? void 0 : data.access_token) !== null && _a !== void 0 ? _a : this._context.http.accessToken;
        this._context.http.refreshToken =
            (_b = data === null || data === void 0 ? void 0 : data.refresh_token) !== null && _b !== void 0 ? _b : this._context.http.refreshToken;
        this._context.http.refreshBefore =
            (_c = data === null || data === void 0 ? void 0 : data.refresh_before) !== null && _c !== void 0 ? _c : this._context.http.refreshBefore;
        this._context.http.privateUrls = __assign(__assign({}, this._context.http.authState.privateUrls), data === null || data === void 0 ? void 0 : data._links);
    };
    Auth.prototype.revokeAccess = function () {
        this._context.http.clearSession();
    };
    return Auth;
}());
exports.Auth = Auth;
