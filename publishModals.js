import { CeramicClient } from "@ceramicnetwork/http-client";
import { writeFile } from "node:fs/promises";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

import publicationSchema from "./src/schemas/publication.json";

// The key must be provided as an environment variable
const key = fromString(
  "08a0f978ef5c86190094a6ed9ca3f4a41443e94ab7c91b151a29e27089f6aeb6",
  "base16"
);
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(key),
  resolver: getResolver(),
});
await did.authenticate();

// Connect to the local Ceramic node
const ceramic = new CeramicClient("http://localhost:7007");
ceramic.did = did;

// Create a manager for the model
const manager = new ModelManager(ceramic);

const publicationSchemaID = await manager.createSchema(
  "Publication",
  publicationSchema
);

// Create the definition using the created schema ID
await manager.createDefinition("publication", {
  name: "My publication",
  description: "A newsletter publication",
  schema: manager.getSchemaURL(publicationSchemaID),
});

await manager.createTile(
  "examplePublication",
  { name: "Example", about: "Example publication", articles: {} },
  { schema: manager.getSchemaURL(publicationSchemaID) }
);

// Publish model to Ceramic node
const model = await manager.toPublished();

// Write published model to JSON file
await writeFile(
  "./src/schemas/published/publication.json",
  JSON.stringify(model)
);
