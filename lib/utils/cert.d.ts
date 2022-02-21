/// <reference types="node" />
import { asn1, pki } from "node-forge";
export declare type Certificate = pki.Certificate;
export declare type KeyPair = pki.rsa.KeyPair;
export declare type Pkcs12Asn1 = asn1.Asn1;
export declare function parseAuthenticationHeader(content: string): Map<string, string>;
export declare function generateKeyPair(): KeyPair;
export declare function serializePublicKey(publicKey: pki.rsa.PublicKey): string;
export declare function parseCertificate(content: string): Certificate;
export declare function generateSelfSignedCertificate(keyPair: KeyPair, cert: Certificate, password?: string): Pkcs12Asn1;
export declare function pkcs12ToBuffer(cert: Pkcs12Asn1): Buffer;
