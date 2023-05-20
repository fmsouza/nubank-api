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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var decorators_1 = require("./utils/decorators");
var Card = exports.Card = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _getFeed_decorators;
    var _getTransactions_decorators;
    var _getPayments_decorators;
    var _getBills_decorators;
    var _getBillDetails_decorators;
    return _a = /** @class */ (function () {
            function Card(_context) {
                this._context = (__runInitializers(this, _instanceExtraInitializers), _context);
            }
            Object.defineProperty(Card.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: false,
                configurable: true
            });
            Card.prototype.getFeed = function () {
                return this._context.http
                    .request("get", "events")
                    .then(function (data) { return data.events; });
            };
            Card.prototype.getTransactions = function () {
                return this.getFeed().then(function (feed) {
                    return feed.filter(function (statement) { return statement.category === "transaction"; });
                });
            };
            Card.prototype.getPayments = function () {
                return this.getFeed().then(function (feed) {
                    return feed.filter(function (statement) { return statement.category === "payment"; });
                });
            };
            Card.prototype.getBills = function (options) {
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
                                        return _this.parseDate(bill.summary.due_date) >=
                                            options.billsAfterDueDate;
                                    });
                                }
                                return [4 /*yield*/, Promise.all(bills.map(function (bill) { return _this.getBillDetails(bill); }))];
                            case 4: return [2 /*return*/, _c.sent()];
                        }
                    });
                });
            };
            Card.prototype.getBillDetails = function (bill) {
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
            Card.prototype.parseDate = function (dateStr) {
                var dateParts = dateStr.split("-");
                return new Date(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10), parseInt(dateParts[2], 10));
            };
            return Card;
        }()),
        (function () {
            _getFeed_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            _getTransactions_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            _getPayments_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            _getBills_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            _getBillDetails_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            __esDecorate(_a, null, _getFeed_decorators, { kind: "method", name: "getFeed", static: false, private: false, access: { has: function (obj) { return "getFeed" in obj; }, get: function (obj) { return obj.getFeed; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTransactions_decorators, { kind: "method", name: "getTransactions", static: false, private: false, access: { has: function (obj) { return "getTransactions" in obj; }, get: function (obj) { return obj.getTransactions; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPayments_decorators, { kind: "method", name: "getPayments", static: false, private: false, access: { has: function (obj) { return "getPayments" in obj; }, get: function (obj) { return obj.getPayments; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBills_decorators, { kind: "method", name: "getBills", static: false, private: false, access: { has: function (obj) { return "getBills" in obj; }, get: function (obj) { return obj.getBills; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBillDetails_decorators, { kind: "method", name: "getBillDetails", static: false, private: false, access: { has: function (obj) { return "getBillDetails" in obj; }, get: function (obj) { return obj.getBillDetails; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
