"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGenericTransaction = void 0;
function findAmount(transaction) {
    var _a, _b;
    var amountSource = "0";
    if ((_a = transaction.detail) === null || _a === void 0 ? void 0 : _a.includes("R$")) {
        amountSource = transaction.detail.split("R$")[1].trim();
    }
    else if ((_b = transaction.footer) === null || _b === void 0 ? void 0 : _b.includes("R$")) {
        amountSource = transaction.footer.split("R$")[1].trim();
    }
    amountSource = amountSource === null || amountSource === void 0 ? void 0 : amountSource.replace(".", "").replace(",", ".");
    return parseFloat(amountSource);
}
function parseGenericTransaction(transaction) {
    var _a;
    return {
        id: transaction.id,
        __typename: transaction.__typename,
        title: transaction.title,
        detail: transaction.detail,
        postDate: transaction.postDate,
        amount: (_a = transaction.amount) !== null && _a !== void 0 ? _a : findAmount(transaction),
    };
}
exports.parseGenericTransaction = parseGenericTransaction;
