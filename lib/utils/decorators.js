"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresAuth = void 0;
function RequiresAuth() {
    var selectedAuthTypes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        selectedAuthTypes[_i] = arguments[_i];
    }
    return function (target) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var currentAuthType = this.context.authType;
            if (!selectedAuthTypes.includes(currentAuthType)) {
                throw new Error("This method requires [".concat(selectedAuthTypes.join(","), "] authentication"));
            }
            return target.call.apply(target, __spreadArray([this], args, false));
        };
    };
}
exports.RequiresAuth = RequiresAuth;
