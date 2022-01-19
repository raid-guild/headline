import {
  EthereumAuthProvider,
  SelfID,
  WebClient,
  ConnectNetwork,
} from "@self.id/web";

import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";

const ceramicNetwork = (process.env.REACT_APP_CERAMIC_NETWORK ||
  "testnet-clay") as ConnectNetwork;

export const authenticateDid = async (address: string) => {
  // Always associate current chain with mainnet
  // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x1" }],
  });

  const authProvider = new EthereumAuthProvider(window.ethereum, address);
  const client = new WebClient({
    ceramic: ceramicNetwork,
    connectNetwork: ceramicNetwork,
  });
  let did = null;
  try {
    did = await client.authenticate(authProvider, true);

    const link = await Caip10Link.fromAccount(
      client.ceramic,
      `${address}@eip155:1`,
      {}
    );
    if (!link.did || link.did !== did.id) {
      await link.setDid(did, authProvider, {});
    }
  } catch (err) {
    console.error(err);
  }

  return [client, did];
};
