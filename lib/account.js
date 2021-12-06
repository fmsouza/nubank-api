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
exports.Account = void 0;
var constants_1 = require("./constants");
var GqlOperations = require("./utils/graphql-operations");
var Account = /** @class */ (function () {
    function Account(_context) {
        this._context = _context;
        this._accountId = "";
        this._customerId = "";
    }
    Account.prototype.me = function () {
        return this._context.http.request("get", "customer").then(function (data) { return data.customer; });
    };
    Account.prototype.ready = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(!this._accountId || !this._customerId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_ID)];
                    case 1:
                        data = (_d.sent()).data;
                        this._accountId = (_b = (_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.id;
                        this._customerId = (_c = data === null || data === void 0 ? void 0 : data.viewer) === null || _c === void 0 ? void 0 : _c.id;
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._accountId];
                }
            });
        });
    };
    Account.prototype.getCustomerId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._customerId];
                }
            });
        });
    };
    Account.prototype.getPixKeys = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_GET_PIX_KEYS)];
                    case 1:
                        data = (_d.sent()).data;
                        return [2 /*return*/, (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.dict) === null || _c === void 0 ? void 0 : _c.keys];
                }
            });
        });
    };
    Account.prototype.getBills = function (options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var data, futureBillsUrl, bills, dataFuture, closedAndOpenedBills;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        options = __assign({ getFutureBillsDetails: false }, options);
                        return [4 /*yield*/, this._context.http.request("get", "bills_summary")];
                    case 1:
                        data = _c.sent();
                        futureBillsUrl = (_b = (_a = data._links) === null || _a === void 0 ? void 0 : _a.future) === null || _b === void 0 ? void 0 : _b.href;
                        bills = data.bills;
                        if (!(options.getFutureBillsDetails && futureBillsUrl)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._context.http.request("get", futureBillsUrl)];
                    case 2:
                        dataFuture = _c.sent();
                        closedAndOpenedBills = data.bills.filter(function (bill) { return bill.state !== "future"; });
                        bills = dataFuture.bills.concat(closedAndOpenedBills);
                        _c.label = 3;
                    case 3:
                        if (options.billsAfterDueDate) {
                            bills = bills.filter(function (bill) {
                                return _this.parseDate(bill.summary.due_date) >= options.billsAfterDueDate;
                            });
                        }
                        return [4 /*yield*/, Promise.all(bills.map(function (bill) { return _this.getBillDetails(bill); }))];
                    case 4: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    Account.prototype.getBalance = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_BALANCE)];
                    case 1:
                        data = _d.sent();
                        return [2 /*return*/, (_c = (_b = (_a = data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.currentSavingsBalance) === null || _c === void 0 ? void 0 : _c.netAmount];
                }
            });
        });
    };
    Account.prototype.getFeed = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_FEED)];
                    case 1:
                        data = _d.sent();
                        return [2 /*return*/, (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.savingsAccount) === null || _c === void 0 ? void 0 : _c.feed];
                }
            });
        });
    };
    Account.prototype.getTransactions = function () {
        return this.getFeed().then(function (feed) {
            return feed.filter(function (statement) { return constants_1.PAYMENT_EVENT_TYPES.includes(statement.__typename); });
        });
    };
    Account.prototype.getInvestments = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_INVESTMENTS)];
                    case 1:
                        data = (_c.sent()).data;
                        return [2 /*return*/, (_b = (_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.redeemableDeposits];
                }
            });
        });
    };
    Account.prototype.getBillDetails = function (bill) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        url = (_c = (_b = (_a = bill === null || bill === void 0 ? void 0 : bill._links) === null || _a === void 0 ? void 0 : _a.self) === null || _b === void 0 ? void 0 : _b.href) !== null && _c !== void 0 ? _c : "";
                        if (!url) {
                            return [2 /*return*/, bill];
                        }
                        return [4 /*yield*/, this._context.http.request("get", url)];
                    case 1:
                        response = _d.sent();
                        return [2 /*return*/, response.bill];
                }
            });
        });
    };
    Account.prototype.parseDate = function (dateStr) {
        var dateParts = dateStr.split("-");
        return new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10), parseInt(dateParts[2], 10));
    };
    return Account;
}());
exports.Account = Account;
