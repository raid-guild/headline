import LitJsSdk from "lit-js-sdk";
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { getClient } from "lib/lit";

export type LitContextType = {
  litClient: typeof LitJsSdk.LitNodeClient | null;
};

type ProviderProps = {
  children?: ReactNode;
};

const initialContext = {
  litClient: null,
};

const LitContext = createContext<LitContextType>(initialContext);

export const LitProvider = ({ children }: ProviderProps) => {
  const [client, setClient] = useState<typeof LitJsSdk.LitNodeClient | null>(
    null
  );
  useEffect(() => {
    const f = async () => {
      const c = await getClient();
      setClient(c);
    };
    f();
  }, []);

  return (
    <LitContext.Provider
      value={{
        litClient: client,
      }}
    >
      {children}
    </LitContext.Provider>
  );
};

export const useLit = () => useContext(LitContext);
