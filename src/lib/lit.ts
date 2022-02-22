import LitJsSdk from "@alexkeating/lit-js-sdk";
import uint8arrayFromString from "uint8arrays/from-string";

import { chains } from "../constants";
import { ChainName } from "types";

const getClient = () => {
  const client = new LitJsSdk.LitNodeClient();
  client.connect();
  return client;
};

// const accessControlConditions = [
//   {
//     contractAddress: "",
//     standardContractType: "",
//     chain,
//     method: "",
//     parameters: [":userAddress"],
//     returnValueTest: {
//       comparator: "=",
//       value: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
//     },
//   },
// ];
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

export const litClient = getClient();

export const singleAddressAccessControl = (
  address: string
): AccessControl[] => {
  const accessControls = [];
  for (const chain in chains) {
    accessControls.push({
      contractAddress: "",
      standardContractType: "",
      chain: chain as ChainName,
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
  return symmKey;
}

// Pulled from the Lit sdk and modified to take string
export async function encryptStringWithKey(str: string, symmKey: string) {
  const encodedString = uint8arrayFromString(str, "utf8");

  const encryptedString = await LitJsSdk.encryptWithSymmetricKey(
    symmKey,
    encodedString.buffer
  );

  return encryptedString;
}

export const encryptText = async (text: string, symmKey: string) => {
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
  const encryptedString = await LitJsSdk.encryptStringWithKey(text, symmKey);

  return { encryptedString, authSig };
};

export const saveEncryptionKey = async (
  accessControlConditions: string,
  symmetricKey: string,
  authSig: string,
  chain: { chain: string }
) => {
  const encryptedSymmetricKey = await litClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });
  console.log(encryptedSymmetricKey);
  console.log(accessControlConditions);
};
