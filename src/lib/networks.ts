import { ChainName } from "types";

type Network = {
  chainId: string;
  name: string;
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
