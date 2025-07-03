import config from "@repo/config";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

const canonicalStringify = (v: object): string => {
  const data = { ...v };
  return JSON.stringify(data, Object.keys(data).sort());
};

export const createBase64UrlSignature = (data: unknown): string => {
  return crypto
    .createHmac("sha256", config.API_SIGNATURE_KEY)
    .update(canonicalStringify(data as object))
    .digest("base64url");
};

export const verifyBase64UrlSignature = (
  data: unknown,
  dataSignature: string
): boolean => {
  const receivedDataSignatureBuffer = crypto
    .createHmac("sha256", config.API_SIGNATURE_KEY)
    .update(canonicalStringify(data as object))
    .digest();

  const expectedDataSignatureBuffer = Buffer.from(dataSignature, "base64url");

  if (
    receivedDataSignatureBuffer.length !== expectedDataSignatureBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Uint8Array.from(receivedDataSignatureBuffer),
    Uint8Array.from(expectedDataSignatureBuffer)
  );
};
