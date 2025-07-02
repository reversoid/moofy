import config from "@repo/config";
import crypto from "node:crypto";

export const createBase64UrlSignature = (data: unknown): string => {
  return crypto
    .createHmac("sha256", config.API_SIGNATURE_KEY)
    .update(JSON.stringify(data))
    .digest("base64url");
};

export const verifyBase64UrlSignature = (
  data: unknown,
  dataSignature: string
): boolean => {
  const receivedDataSignatureBuffer = Uint8Array.from(
    crypto
      .createHmac("sha256", config.API_SIGNATURE_KEY)
      .update(JSON.stringify(data))
      .digest()
  );

  const expectedDataSignatureBuffer = Uint8Array.from(
    Buffer.from(dataSignature, "base64url")
  );

  if (
    receivedDataSignatureBuffer.length !== expectedDataSignatureBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedDataSignatureBuffer,
    expectedDataSignatureBuffer
  );
};
