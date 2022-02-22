import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";
import { DID } from "dids";

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
