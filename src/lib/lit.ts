import LitJsSdk from "lit-js-sdk";

import { litChains } from "lib/networks";
import { ChainName } from "types";

export type LitNodeClient = typeof LitJsSdk.LitNodeClient;

export const getClient = async (): Promise<typeof LitJsSdk.LitNodeClient> => {
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();
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

export const addNftAccessControl = (
  controls: (AccessControl | Operator)[],
  chain: ChainName,
  contractAddress: string
) => {
  return [
    ...controls,
    { operator: "or" },
    {
      contractAddress: contractAddress,
      standardContractType: "ERC721",
      chain,
      method: "balanceOf",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
};

export const singleAddressAccessControl = (
  address: string
): (AccessControl | Operator)[] => {
  const accessControls = [];
  for (const idx in litChains) {
    if (idx !== "0") {
      accessControls.push({ operator: "or" });
    }
    accessControls.push({
      contractAddress: "",
      standardContractType: "",
      chain: litChains[idx],
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address,
      },
    });
  }
  return accessControls;
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
  accessControlConditions: (AccessControl | Operator)[],
  litClient: typeof LitJsSdk.LitNodeClient
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
  content: string,
  client: typeof LitJsSdk.LitNodeClient
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions,
    client
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
  content: string,
  client: typeof LitJsSdk.LitNodeClient
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions,
    client
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
  content: string,
  client: typeof LitJsSdk.LitNodeClient
) => {
  const symmetricKey = await getEncryptionKey(
    chainName,
    encryptedSymmetricKey,
    accessControlConditions,
    client
  );
  const a = await encryptText(content, symmetricKey).catch((e) =>
    console.error(e)
  );
  return a;
};
