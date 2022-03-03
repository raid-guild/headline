import { ChainName } from "types";

type ChainLabel = "Mainnet" | "Rinkeby";

type Network = {
  chainId: string;
  name: ChainLabel;
  litName: ChainName;
  symbol: string;
  explorer: string;
  rpc: string;
};

export const networks: { [key: string]: Network } = {
  "0x1": {
    chainId: "0x1",
    name: "Mainnet",
    litName: "ethereum",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    rpc: "https://mainnet.infura.io/v3/9166d5f9c2ea4c39831453b0e6040aa3",
  },
  "0x4": {
    chainId: "0x4",
    name: "Rinkeby",
    litName: "rinkeby",
    symbol: "ETH",
    explorer: "https://rinkeby.etherscan.io",
    rpc: "https://rinkeby.infura.io/v3/9166d5f9c2ea4c39831453b0e6040aa3",
  },
};

export const chainOptions = [
  { value: "Mainnet", label: "0x1" },
  { value: "Rinkeby", label: "0x4" },
];

export const getChainIdByName = (chainName: ChainLabel) => {
  return chainOptions.filter((option) => {
    return option.value === chainName;
  });
};
