import React, { createContext, useContext, ReactNode, useState } from "react";
import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";
import { DID } from "dids";

import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";

export type CeramicContextType = {
  did: DID | null;
  client: WebClient | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
};

type ProviderProps = {
  children?: ReactNode;
};

const initialContext = {
  did: null,
  client: null,
  connect: async () => undefined,
  disconnect: async () => undefined,
  isConnecting: false,
};

const CeramicContext = createContext<CeramicContextType>(initialContext);

const ceramicNetwork = (process.env.REACT_APP_CERAMIC_NETWORK ||
  "testnet-clay") as ConnectNetwork;

export const CeramicProvider = ({ children }: ProviderProps) => {
  const [did, setDid] = useState<DID | null>(null);
  const [client, setClient] = useState<WebClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    // Always associate current chain with mainnet
    // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    const address = window.ethereum.selectedAddress;

    const authProvider = new EthereumAuthProvider(window.ethereum, address);
    const c = new WebClient({
      ceramic: ceramicNetwork,
      connectNetwork: ceramicNetwork,
    });

    let d = null;
    setIsConnecting(true);
    try {
      d = await c.authenticate(authProvider, true);

      const link = await Caip10Link.fromAccount(
        c.ceramic,
        `${address}@eip155:1`,
        {}
      );
      if (!link.did || link.did !== d.id) {
        await link.setDid(d, authProvider, {});
      }
    } catch (err) {
      console.error(err);
    }

    setDid(d);
    setClient(c);
    setIsConnecting(false);
  };

  const disconnect = async () => {
    setDid(null);
    setClient(null);
    setIsConnecting(false);
  };

  return (
    <CeramicContext.Provider
      value={{ did, connect, client, isConnecting, disconnect }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export const useCermaic = () => useContext(CeramicContext);