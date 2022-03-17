import React, { createContext, useContext, ReactNode, useState } from "react";
import { useWallet } from "@raidguild/quiver";
import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";
import { DID } from "dids";

import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";

export type CeramicContextType = {
  did: DID | null;
  client: WebClient | null;
  connect: () => Promise<WebClient>;
  disconnect: () => Promise<void>;
  isCeramicConnecting: boolean;
};

type ProviderProps = {
  children?: ReactNode;
};

const initialContext = {
  did: null,
  client: null,
  connect: async () => undefined,
  disconnect: async () => undefined,
  isCeramicConnecting: false,
};

const CeramicContext = createContext<CeramicContextType>(initialContext);

const ceramicNetwork = (import.meta.env.REACT_APP_CERAMIC_NETWORK ||
  "testnet-clay") as ConnectNetwork;

export const CeramicProvider = ({ children }: ProviderProps) => {
  const [did, setDid] = useState<DID | null>(null);
  const [client, setClient] = useState<WebClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { address } = useWallet();

  const connect = async () => {
    // Always associate current chain with mainnet
    // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    console.log("Address");
    console.log(address);

    if (!address) {
      console.error("No address");
    }
    const authProvider = new EthereumAuthProvider(
      window.ethereum,
      address || ""
    );

    console.log("Client");
    const c = new WebClient({
      ceramic: ceramicNetwork,
      connectNetwork: ceramicNetwork,
    });
    console.log(c);

    let d = null;
    setIsConnecting(true);
    try {
      console.log("Here");
      console.log(authProvider);
      d = await c.authenticate(authProvider, true);
      console.log("authenticate");

      const link = await Caip10Link.fromAccount(
        c.ceramic,
        `${address}@eip155:1`,
        {}
      );
      console.log("Link");
      console.log(link);
      if (!link.did || link.did !== did?.id) {
        await link.setDid(d, authProvider, {});
      }
    } catch (err) {
      console.error(err);
    }

    setDid(d);
    setClient(c);
    setIsConnecting(false);
    return c;
  };

  const disconnect = async () => {
    setDid(null);
    setClient(null);
    setIsConnecting(false);
  };

  return (
    <CeramicContext.Provider
      value={{
        did,
        connect,
        client,
        isCeramicConnecting: isConnecting,
        disconnect,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export const useCeramic = () => useContext(CeramicContext);
