import { ChainName } from "types";

type ChainLabel = "Mainnet" | "Rinkeby";

type Network = {
  chainId: string;
  chainNumber: number;
  name: ChainLabel;
  litName: ChainName;
  symbol: string;
  explorer: string;
  rpc: string;
  unlockSubgraph: string;
  unlockAddress: string;
};

export const networks: { [key: string]: Network } = {
  "0x1": {
    chainId: "0x1",
    chainNumber: 1,
    name: "Mainnet",
    litName: "ethereum",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    unlockAddress: "0x3d5409cce1d45233de1d4ebdee74b8e004abdd13",
    rpc: "https://mainnet.infura.io/v3/f1dfa73f479840139441203fdf63bdce",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock",
  },
  "0x4": {
    chainId: "0x4",
    chainNumber: 4,
    name: "Rinkeby",
    litName: "rinkeby",
    symbol: "ETH",
    explorer: "https://rinkeby.etherscan.io",
    unlockAddress: "0xd8c88be5e8eb88e38e6ff5ce186d764676012b0b",
    rpc: "https://rinkeby.infura.io/v3/f1dfa73f479840139441203fdf63bdce",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock-rinkeby",
  },
};

const getUnlockNetworks = () => {
  const n = {} as {
    [key: number]: { unlockAddress: string; provider: string };
  };
  Object.values(networks).map((network) => {
    n[network.chainNumber] = {
      unlockAddress: network.unlockAddress,
      provider: network.rpc,
    };
  });
  return n;
};

export const unlockNetworks = getUnlockNetworks();

export const chainOptions = [
  { label: "Mainnet", value: "0x1" },
  { label: "Rinkeby", value: "0x4" },
];

export const getChainIdByName = (chainName: ChainLabel) => {
  return chainOptions.filter((option) => {
    return option.value === chainName;
  });
};

export const litChains = Object.values(networks).map((val) => val.litName);
