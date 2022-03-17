import LitJsSdk from "lit-js-sdk";

import { ChainName } from "types";

const getClient = () => {
  const client = new LitJsSdk.LitNodeClient();
  client.connect();
  return client;
};

export type Comparator = {
  comparator: string;
  value: string;
};

export type AccessControl = {
  contractAddress: string;
  standardContractType: string;
  chain: ChainName; // Actual name of the chain
  method: string;
  parameters: string[];
  returnValueTest: Comparator;
};
export type Operator = {
  operator: string;
};

export type LitAccess = {
  encryptedSymmetricKey: string;
  accessControlConditions: (AccessControl | Operator)[];
};

export const litClient = getClient();

export const singleAddressAccessControl = (
  address: string
): AccessControl[] => {
  const accessControls = [];
  // for (const idx in chains) {
  //   if (idx !== "0") {
  //     accessControls.push({ operator: "or" });
  //   }
  //   accessControls.push({
  //     contractAddress: "",
  //     standardContractType: "",
  //     chain: chains[idx],
  //     method: "",
  //     parameters: [":userAddress"],
  //     returnValueTest: {
  //       comparator: "=",
  //       value: address,
  //     },
  //   });
  // }
  return [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    },
  ];
};

// Pulled from Lit
export async function generateSymmetricKey() {
  const SYMM_KEY_ALGO_PARAMS = {
    name: "AES-CBC",
    length: 256,
  };
  const symmKey = await crypto.subtle.generateKey(SYMM_KEY_ALGO_PARAMS, true, [
    "encrypt",
    "decrypt",
  ]);
  const exportedSymmKey = new Uint8Array(
    await crypto.subtle.exportKey("raw", symmKey)
  );
  return exportedSymmKey;
}

// Pulled from the Lit sdk and modified to take string
export async function encryptStringWithKey(
  str: string,
  symmKey: Uint8Array
): Promise<Blob> {
  const encodedString = LitJsSdk.uint8arrayFromString(str, "utf8");
  const SYMM_KEY_ALGO_PARAMS = {
    name: "AES-CBC",
    length: 256,
  };
  const key = await crypto.subtle.importKey(
    "raw",
    symmKey,
    SYMM_KEY_ALGO_PARAMS,
    false,
    ["encrypt", "decrypt"]
  );

  const encryptedString = await LitJsSdk.encryptWithSymmetricKey(
    key,
    encodedString.buffer
  );

  return encryptedString;
}

export const encryptText = async (text: string, symmKey: Uint8Array) => {
  const encryptedString = await encryptStringWithKey(text, symmKey);

  return encryptedString;
};

export const decryptText = async (text: Uint8Array, symmKey: Uint8Array) => {
  const decryptedString = await LitJsSdk.decryptString(
    new Blob([text]),
    symmKey
  );

  return decryptedString;
};

export const getEncryptionKey = async (
  chain: ChainName,
  encryptedSymmetricKey: string,
  accessControlConditions: (AccessControl | Operator)[]
): Promise<Uint8Array> => {
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
  const symmetricKey = await litClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain,
    authSig,
  });
  return symmetricKey;
};

export const getKeyEncryptText = async (
  chainName: ChainName,
  encryptedSymmetricKey: string,
  accessControlConditions: (AccessControl | Operator)[],
  content: string
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions
  );
  const blob = await encryptText(content, symmetricKey);
  const encodedContent = LitJsSdk.uint8arrayToString(
    new Uint8Array(await blob.arrayBuffer()),
    "base64"
  );
  return encodedContent;
};

export const getKeyAndDecrypt = async (
  chainName: ChainName,
  encryptedSymmetricKey: string,
  accessControlConditions: (AccessControl | Operator)[],
  content: string
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions
  );
  const a = await decryptText(
    LitJsSdk.uint8arrayFromString(content, "base64"),
    symmetricKey
  ).catch((e) => console.error(e));
  return a;
};

export const getKeyAndEncrypt = async (
  chainName: ChainName,
  encryptedSymmetricKey: string,
  accessControlConditions: (AccessControl | Operator)[],
  content: string
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions
  );
  const a = await encryptText(content, symmetricKey).catch((e) =>
    console.error(e)
  );
  return a;
};
