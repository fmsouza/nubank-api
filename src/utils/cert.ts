import { asn1, pkcs12, pki, util } from "node-forge";

export type Certificate = pki.Certificate;
export type KeyPair = pki.rsa.KeyPair;
export type Pkcs12Asn1 = asn1.Asn1;

export function parseAuthenticationHeader(
  content: string
): Map<string, string> {
  const record = new Map<string, string>();
  content.split(",").forEach((item) => {
    let [key, value]: string[] = item.split("=");
    key = key.trim().replace(/ /g, "_");
    value = value.replace(/"/g, "");
    record.set(key, value);
  });
  return record;
}

export function generateKeyPair(): KeyPair {
  return pki.rsa.generateKeyPair({ bits: 2048 });
}

export function serializePublicKey(publicKey: pki.rsa.PublicKey): string {
  return pki.publicKeyToPem(publicKey);
}

export function parseCertificate(content: string): Certificate {
  return pki.certificateFromPem(content);
}

export function generateSelfSignedCertificate(
  keyPair: KeyPair,
  cert: Certificate,
  password: string = ""
): Pkcs12Asn1 {
  return pkcs12.toPkcs12Asn1(keyPair.privateKey, cert, password);
}

export function pkcs12ToBuffer(cert: Pkcs12Asn1): Buffer {
  return Buffer.from(asn1.toDer(cert).getBytes(), "binary");
}
