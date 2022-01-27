import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";

export const getClient = async () => {
  const address = window.ethereum.selectedAddress;
  const authProvider = new EthereumAuthProvider(window.ethereum, address);

  const client = new WebClient({
    ceramic: "local",
    connectNetwork: "testnet-clay",
  });

  await client.authenticate(authProvider);
  return client;
};
