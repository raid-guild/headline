import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { useWallet } from "@alexkeating/quiver";
import { EthereumAuthProvider, WebClient, ConnectNetwork } from "@self.id/web";
import { DID } from "dids";

export type CeramicContextType = {
  did: DID | null;
  client: WebClient | null;
  connect: (arg0?: string) => Promise<WebClient | undefined>;
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

const ceramicNetwork = (import.meta.env.VITE_CERAMIC_NETWORK ||
  "testnet-clay") as ConnectNetwork;
const ceramicNode = (import.meta.env.VITE_CERAMIC_NODE ||
  "testnet-clay") as string;

export const CeramicProvider = ({ children }: ProviderProps) => {
  const [did, setDid] = useState<DID | null>(null);
  const [client, setClient] = useState<WebClient | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { address } = useWallet();

  const connect = async (argAddress?: string) => {
    // Always associate current chain with mainnet
    // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }],
    });
    const connectAddress = argAddress || address;

    if (!connectAddress) {
      console.error("No address");
      return;
    }
    const authProvider = new EthereumAuthProvider(
      window.ethereum,
      connectAddress
    );

    const c = new WebClient({
      ceramic: ceramicNode,
      connectNetwork: ceramicNetwork,
    });

    let d = null;
    setIsConnecting(true);
    try {
      d = await c.authenticate(authProvider, true);
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

  useEffect(() => {
    if (!address && did) {
      // disconnect();
      window.location.reload();
    }
  }, [address]);

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
