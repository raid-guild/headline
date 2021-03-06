import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { CeramicClient } from "@ceramicnetwork/http-client";
import { writeFile } from "node:fs/promises";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

import publicationSchema from "./src/schemas/publication.json";
import publishRegistrySchema from "./src/schemas/publishedRegistry.json";
import articleSchema from "./src/schemas/article.json";
import articleRegistrySchema from "./src/schemas/articleRegistry.json";

// The key must be provided as an environment variable
const key = fromString(process.env["SEED"], "base16");
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
});
await did.authenticate();

// Connect to the local Ceramic node
const ceramic = new CeramicClient("https://ceramic-test.viaheadline.xyz");
ceramic.did = did;

// Create a manager for the model
const manager = new ModelManager(ceramic);

const publicationSchemaID = await manager.createSchema(
  "Publication",
  publicationSchema
);

const articleSchemaID = await manager.createSchema("Article", articleSchema);
const articleRegistrySchemaID = await manager.createSchema(
  "ArticleRegistry",
  articleRegistrySchema
);

const publishRegistrySchemaID = await manager.createSchema(
  "PublishRegistry",
  publishRegistrySchema
);

// Create the definition using the created schema ID
await manager.createDefinition("publication", {
  name: "My publication",
  description: "A newsletter publication",
  schema: manager.getSchemaURL(publicationSchemaID),
});

await manager.createDefinition("article", {
  name: "A unstack article",
  description: "A newsletter article",
  schema: manager.getSchemaURL(articleSchemaID),
});

await manager.createDefinition("articleRegistry", {
  name: "Article registry",
  description: "A registry of all unstack articles for a given publication",
  schema: manager.getSchemaURL(articleRegistrySchemaID),
});
await manager.createDefinition("publishRegistry", {
  name: "Publish registry",
  description: "A registry of all published unstack articles",
  schema: manager.getSchemaURL(publishRegistrySchemaID),
});

const accessControlConditions = [
  {
    contractAddress: "",
    standardContractType: "",
    chain: "xdai",
    method: "",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: "0x50e2dac5e78B5905CB09495547452cEE64426db2",
    },
  },
];

await manager.createTile(
  "examplePublication",
  {
    name: "Example",
    about: "Example publication",

    draftAccess: { encryptedSymmetricKey: "key", accessControlConditions },
    publishAccess: { encryptedSymmetricKey: "key", accessControlConditions },
  },
  { schema: manager.getSchemaURL(publicationSchemaID) }
);

await manager.createTile(
  "exampleArticle",
  {
    publicationUrl: "ipfs://hi",
    title: "hi",
    createdAt: "2019-10-12T07:20:50.52Z",
    status: "draft",
  },
  { schema: manager.getSchemaURL(articleSchemaID) }
);

await manager.createTile(
  "exampleArticleRegistry",
  {
    k2t6wyfsu4pfxcjnx1gg5q37xywk5gihcjwrdrbohacqr25emxg4p05mpjvnkc:
      "k2t6wyfsu4pfxcjnx1gg5q37xywk5gihcjwrdrbohacqr25emxg4p05mpjvnkc",
  },
  { schema: manager.getSchemaURL(articleRegistrySchemaID) }
);

await manager.createTile(
  "examplePublishRegistry",
  {
    k2t6wyfsu4pfxcjnx1gg5q37xywk5gihcjwrdrbohacqr25emxg4p05mpjvnkc:
      "k2t6wyfsu4pfxcjnx1gg5q37xywk5gihcjwrdrbohacqr25emxg4p05mpjvnkc",
  },
  { schema: manager.getSchemaURL(articleRegistrySchemaID) }
);

// Publish model to Ceramic node
const model = await manager.toPublished();

// Write published model to JSON file
await writeFile(
  "./src/schemas/published/models_testnet.json",
  JSON.stringify(model)
);
