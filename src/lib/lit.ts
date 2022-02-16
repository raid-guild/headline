import LitJsSdk from "lit-js-sdk";

const getClient = () => {
  const client = new LitJsSdk.LitNodeClient();
  client.connect();
  return client;
};

export const litClient = getClient();

const encryptText = async (text: string) => {
  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "ethereum" });
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);

  return { encryptedString, symmetricKey, authSig };
};

const saveEncryptionKey = async (
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
