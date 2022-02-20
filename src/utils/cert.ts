import { generateKeyPairSync, KeyPairSyncResult, X509Certificate } from "crypto";

export type KeyPair = KeyPairSyncResult<string, string>;

export type Certificate = X509Certificate;

export function generateKeyPair(): KeyPair {
  return generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });
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

export function parseCertificate(content: string): X509Certificate {
  return new X509Certificate(content);
}