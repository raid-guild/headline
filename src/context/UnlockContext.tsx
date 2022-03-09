import React, {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { Web3Service } from "@unlock-protocol/unlock-js";
import { unlockNetworks } from "lib/networks";

export type UnlockContextType = {
  web3Service: Web3Service | null;
};

type ProviderProps = {
  children?: ReactNode;
};

const initialContext = {
  web3Service: null,
};

const UnlockContext = createContext<UnlockContextType>(initialContext);

export const UnlockProvider = ({ children }: ProviderProps) => {
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);

  useEffect(() => {
    const service = new Web3Service(unlockNetworks);
    setWeb3Service(service);
  }, []);

  return (
    <UnlockContext.Provider
      value={{
        web3Service,
      }}
    >
      {children}
    </UnlockContext.Provider>
  );
};

export const useUnlock = () => useContext(UnlockContext);
