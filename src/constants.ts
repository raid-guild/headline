import testnetModels from "schemas/published/models_testnet.json";
import mainnetModels from "schemas/published/models_mainnet.json";
import { ConnectNetwork } from "@self.id/web";
import { ChainName } from "types";

export const TWITTER_URL = "https://twitter.com/unlockprotocol";
export const DISCORD_URL = "https://discord.com/invite/Ah6ZEJyTDp";
export const CREATE_PUBLICATION_URI = "/publish/create";
export const DASHBOARD_URI = "/dashboard";
export const PUBLISHED_MODELS =
  import.meta.env["VITE_CERAMIC_NETWORK"] === "mainnet"
    ? mainnetModels
    : testnetModels;
export const WRITING_URI = "/publish/write";
export const DOMAIN = import.meta.env["VITE_WEBSITE_DOMAIN"];
export const CERAMIC_URL = import.meta.env["VITE_CERAMIC_NODE"] as string;
export const SELF_ID_URL = import.meta.env["VITE_SELF_ID"] as string;
export const CERAMIC_NETWORK = import.meta.env[
  "VITE_CERAMIC_NETWORK"
] as ConnectNetwork;

export const chains = [
  "ethereum",
  "xdai",
  "polygon",
  "bsc",
  "rinkeby",
  "kovan",
] as ChainName[]; // optimism will be added shortly
