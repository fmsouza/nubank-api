"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var Card = /** @class */ (function () {
    function Card(_context) {
        this._context = _context;
    }
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
    return Card;
}());
exports.Card = Card;
