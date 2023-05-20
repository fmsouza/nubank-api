"use strict";
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
exports.Account = void 0;
var constants_1 = require("./constants");
var GqlOperations = require("./utils/graphql-operations");
var parsing_1 = require("./utils/parsing");
var decorators_1 = require("./utils/decorators");
var Account = exports.Account = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _me_decorators;
    var _getId_decorators;
    var _getCustomerId_decorators;
    var _getPixKeys_decorators;
    var _getBalance_decorators;
    var _getFeed_decorators;
    var _getTransactions_decorators;
    var _getFeedPaginated_decorators;
    var _getTransactionsPaginated_decorators;
    var _getInvestments_decorators;
    return _a = /** @class */ (function () {
            function Account(_context) {
                this._context = (__runInitializers(this, _instanceExtraInitializers), _context);
                this._accountId = "";
                this._customerId = "";
            }
            Object.defineProperty(Account.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: false,
                configurable: true
            });
            Account.prototype.me = function () {
                return this._context.http
                    .request("get", "customer")
                    .then(function (data) { return data.customer; });
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
            Account.prototype.getBalance = function () {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_BALANCE)];
                            case 1:
                                data = (_d.sent()).data;
                                return [2 /*return*/, (_c = (_b = (_a = data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.currentSavingsBalance) === null || _c === void 0 ? void 0 : _c.netAmount];
                        }
                    });
                });
            };
            /**
             *
             * @deprecated Use getFeedPaginated instead
             */
            Account.prototype.getFeed = function () {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_FEED)];
                            case 1:
                                data = (_c.sent()).data;
                                return [2 /*return*/, (_b = (_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) === null || _b === void 0 ? void 0 : _b.feed.map(parsing_1.parseGenericTransaction)];
                        }
                    });
                });
            };
            /**
             *
             * @deprecated Use getTransactionsPaginated instead
             */
            Account.prototype.getTransactions = function () {
                return this.getFeed().then(function (feed) {
                    return feed.filter(function (statement) {
                        return constants_1.PAYMENT_EVENT_TYPES.includes(statement.__typename);
                    });
                });
            };
            Account.prototype.getFeedPaginated = function (cursor) {
                var _a, _b, _c, _d, _e, _f;
                return __awaiter(this, void 0, void 0, function () {
                    var data, feedItems, items, nextCursor;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0: return [4 /*yield*/, this._context.http.graphql(GqlOperations.QUERY_ACCOUNT_FEED_PAGINATED, { cursor: cursor })];
                            case 1:
                                data = (_g.sent()).data;
                                feedItems = ((_b = (_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.savingsAccount) !== null && _b !== void 0 ? _b : {}).feedItems;
                                items = (_c = feedItems === null || feedItems === void 0 ? void 0 : feedItems.edges.map(function (edge) { return (0, parsing_1.parseGenericTransaction)(edge.node); })) !== null && _c !== void 0 ? _c : [];
                                nextCursor = ((_d = feedItems === null || feedItems === void 0 ? void 0 : feedItems.pageInfo) === null || _d === void 0 ? void 0 : _d.hasNextPage)
                                    ? (_f = (_e = feedItems === null || feedItems === void 0 ? void 0 : feedItems.edges) === null || _e === void 0 ? void 0 : _e.slice(-1)[0]) === null || _f === void 0 ? void 0 : _f.cursor
                                    : undefined;
                                return [2 /*return*/, { items: items, nextCursor: nextCursor }];
                        }
                    });
                });
            };
            Account.prototype.getTransactionsPaginated = function (cursor) {
                return this.getFeedPaginated(cursor).then(function (_a) {
                    var items = _a.items;
                    return items.filter(function (statement) { return statement.amount > 0; });
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
            return Account;
        }()),
        (function () {
            _me_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */, "Web" /* AuthType.WEB */)];
            _getId_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getCustomerId_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getPixKeys_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getBalance_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getFeed_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getTransactions_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getFeedPaginated_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getTransactionsPaginated_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            _getInvestments_decorators = [(0, decorators_1.RequiresAuth)("Certificate" /* AuthType.CERT */)];
            __esDecorate(_a, null, _me_decorators, { kind: "method", name: "me", static: false, private: false, access: { has: function (obj) { return "me" in obj; }, get: function (obj) { return obj.me; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getId_decorators, { kind: "method", name: "getId", static: false, private: false, access: { has: function (obj) { return "getId" in obj; }, get: function (obj) { return obj.getId; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCustomerId_decorators, { kind: "method", name: "getCustomerId", static: false, private: false, access: { has: function (obj) { return "getCustomerId" in obj; }, get: function (obj) { return obj.getCustomerId; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPixKeys_decorators, { kind: "method", name: "getPixKeys", static: false, private: false, access: { has: function (obj) { return "getPixKeys" in obj; }, get: function (obj) { return obj.getPixKeys; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBalance_decorators, { kind: "method", name: "getBalance", static: false, private: false, access: { has: function (obj) { return "getBalance" in obj; }, get: function (obj) { return obj.getBalance; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getFeed_decorators, { kind: "method", name: "getFeed", static: false, private: false, access: { has: function (obj) { return "getFeed" in obj; }, get: function (obj) { return obj.getFeed; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTransactions_decorators, { kind: "method", name: "getTransactions", static: false, private: false, access: { has: function (obj) { return "getTransactions" in obj; }, get: function (obj) { return obj.getTransactions; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getFeedPaginated_decorators, { kind: "method", name: "getFeedPaginated", static: false, private: false, access: { has: function (obj) { return "getFeedPaginated" in obj; }, get: function (obj) { return obj.getFeedPaginated; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getTransactionsPaginated_decorators, { kind: "method", name: "getTransactionsPaginated", static: false, private: false, access: { has: function (obj) { return "getTransactionsPaginated" in obj; }, get: function (obj) { return obj.getTransactionsPaginated; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getInvestments_decorators, { kind: "method", name: "getInvestments", static: false, private: false, access: { has: function (obj) { return "getInvestments" in obj; }, get: function (obj) { return obj.getInvestments; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
