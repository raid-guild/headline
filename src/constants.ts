import publishedModels from "schemas/published/models.json";
import { ChainName } from "types";

export const TWITTER_URL = "https://twitter.com/unlockprotocol";
export const DISCORD_URL = "https://discord.com/invite/Ah6ZEJyTDp";
export const CREATE_PUBLICATION_URI = "/publish/create";
export const DASHBOARD_URI = "/dashboard";
export const PUBLISHED_MODELS = publishedModels;
export const WRITING_URI = "/publish/write";
export const DOMAIN = import.meta.env["VITE_WEBSITE_DOMAIN"];
export const CERAMIC_URL = import.meta.env["VITE_CERAMIC_NODE"];

export const chains = [
  "ethereum",
  "xdai",
  "polygon",
  "bsc",
  "rinkeby",
  "kovan",
] as ChainName[]; // optimism will be added shortly
