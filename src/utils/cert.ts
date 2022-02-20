import { asn1, pkcs12, pki, util } from 'node-forge';

export type Certificate = pki.Certificate;
export type KeyPair = pki.rsa.KeyPair;
export type Pkcs12Certificate = asn1.Asn1;

export function generateKeyPair(): KeyPair {
  return pki.rsa.generateKeyPair({ bits: 2048 });
}

export function parseAuthenticationHeader(content: string): Map<string, string> {
  const record = new Map<string, string>();
  content.split(',').forEach((item) => {
    let [key, value]: string[] = item.split('=');
    key = key.trim().replace(/ /g, '_');
    value = value.replace(/"/g, '');
    record.set(key, value);
  });
  return record;
}

export function parseCertificate(content: string): Certificate {
  return pki.certificateFromPem(content);
}

export function generateSelfSignedCertificate(keyPair: KeyPair, cert: Certificate, password: string = ''): Pkcs12Certificate {
  return pkcs12.toPkcs12Asn1(keyPair.privateKey, cert, password);
}

export function pkcs12Encode64(cert: Pkcs12Certificate): string {
  const p12Der = asn1.toDer(cert).getBytes();
  return `data:application/x-pkcs12;base64,${util.encode64(p12Der)}`;
}

export function serializePublicKey(publicKey: pki.rsa.PublicKey): string {
  return pki.publicKeyToPem(publicKey);
}
