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
  "testnet-clay-gateway") as ConnectNetwork;

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
    const address = window.ethereum.selectedAddressaddress;

    const authProvider = new EthereumAuthProvider(window.ethereum, address);
    const client = new WebClient({
      ceramic: "local",
      connectNetwork: ceramicNetwork,
    });
    let did = null;
    setIsConnecting(true);
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
    setDid(did);
    setClient(client);
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
