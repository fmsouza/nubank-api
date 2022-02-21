"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pkcs12ToBuffer = exports.generateSelfSignedCertificate = exports.parseCertificate = exports.serializePublicKey = exports.generateKeyPair = exports.parseAuthenticationHeader = void 0;
var node_forge_1 = require("node-forge");
function parseAuthenticationHeader(content) {
    var record = new Map();
    content.split(",").forEach(function (item) {
        var _a = item.split("="), key = _a[0], value = _a[1];
        key = key.trim().replace(/ /g, "_");
        value = value.replace(/"/g, "");
        record.set(key, value);
    });
    return record;
}
exports.parseAuthenticationHeader = parseAuthenticationHeader;
function generateKeyPair() {
    return node_forge_1.pki.rsa.generateKeyPair({ bits: 2048 });
}
exports.generateKeyPair = generateKeyPair;
function serializePublicKey(publicKey) {
    return node_forge_1.pki.publicKeyToPem(publicKey);
}
exports.serializePublicKey = serializePublicKey;
function parseCertificate(content) {
    return node_forge_1.pki.certificateFromPem(content);
}
exports.parseCertificate = parseCertificate;
function generateSelfSignedCertificate(keyPair, cert, password) {
    if (password === void 0) { password = ""; }
    return node_forge_1.pkcs12.toPkcs12Asn1(keyPair.privateKey, cert, password);
}
exports.generateSelfSignedCertificate = generateSelfSignedCertificate;
function pkcs12ToBuffer(cert) {
    return Buffer.from(node_forge_1.asn1.toDer(cert).getBytes(), "binary");
}
exports.pkcs12ToBuffer = pkcs12ToBuffer;
