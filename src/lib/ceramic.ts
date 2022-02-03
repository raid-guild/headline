import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";
import { DID } from "dids";

import { getIPFSClient } from "lib/ipfs";

export const getClient = async () => {
  const address = window.ethereum.selectedAddress;
  const authProvider = new EthereumAuthProvider(window.ethereum, address);

  const client = new WebClient({
    ceramic: "testnet-clay",
    connectNetwork: "testnet-clay",
  });

  await client.authenticate(authProvider);
  return client;
};

export const encryptText = async (
  did: DID,
  text: string,
  sharedDids: string[]
) => {
  // encrypt the cleartext object
  const jwe = await did.createDagJWE({ text }, sharedDids);
  const ipfs = getIPFSClient();

  // put the JWE into the ipfs dag
  // Add ipfs
  const jweCid = await ipfs.dag.put(jwe, {
    storeCodec: "dag-jose",
    hashAlg: "sha2-256",
  });

  return jweCid;
};
