import { Core } from "@self.id/core";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import { WebClient, ConnectNetwork } from "@self.id/web";

const ceramicNetwork = (import.meta.env.VITE_CERAMIC_NETWORK ||
  "testnet-clay") as ConnectNetwork;
const ceramicNode = (import.meta.env.VITE_CERAMIC_NODE ||
  "testnet-clay") as string;

export const fetchProfile = async (address: string) => {
  const core = new Core({ ceramic: ceramicNetwork });
  const link = await Caip10Link.fromAccount(
    core.ceramic,
    `${address.toLowerCase()}@eip155:1`
  );

  const profile = await core.get("basicProfile", link.did || "");
  return profile;
};

export const getWebClient = () => {
  return new WebClient({
    ceramic: ceramicNode,
    connectNetwork: ceramicNetwork,
  });
};
