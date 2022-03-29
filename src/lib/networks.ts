import { ChainName } from "types";

type ChainLabel =
  | "Mainnet"
  | "Rinkeby"
  | "Gnosis Chain"
  | "Polygon"
  | "Binance Smart Chain"
  | "Optimism";

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
    rpc: "https://eth-mainnet.alchemyapi.io/v2/6idtzGwDtRbzil3s6QbYHr2Q_WBfn100",
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
    rpc: "https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/unlock-rinkeby",
  },
  "0x64": {
    chainId: "0x64",
    chainNumber: 100,
    name: "Gnosis Chain",
    litName: "xdai",
    symbol: "xDAI",
    explorer: "https://blockscout.com/xdai/mainnet",
    unlockAddress: "0x1bc53f4303c711cc693F6Ec3477B83703DcB317f",
    rpc: "https://rpc.xdaichain.com/",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/xdai",
  },
  "0xa": {
    chainId: "0xa",
    chainNumber: 100,
    name: "Optimism",
    litName: "optimism",
    symbol: "Eth",
    explorer: "https://optimistic.etherscan.io/address/",
    unlockAddress: "0x99b1348a9129ac49c6de7F11245773dE2f51fB0c",
    rpc: "https://mainnet.optimism.io",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/optimism",
  },
  "0x89": {
    chainId: "0x89",
    chainNumber: 137,
    name: "Polygon",
    litName: "polygon",
    symbol: "Matic",
    explorer: "https://polygonscan.com/",
    unlockAddress: "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f",
    rpc: "https://polygon-rpc.com/",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/polygon",
  },
  "0x38": {
    chainId: "0x38",
    chainNumber: 56,
    name: "Binance Smart Chain",
    litName: "bsc",
    symbol: "BSC",
    explorer: "https://bscscan.com/",
    unlockAddress: "0xeC83410DbC48C7797D2f2AFe624881674c65c856",
    rpc: "https://bsc-dataseed.binance.org/",
    unlockSubgraph:
      "https://api.thegraph.com/subgraphs/name/unlock-protocol/bsc",
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
