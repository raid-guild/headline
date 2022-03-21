import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileLoader } from "@glazed/tile-loader";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const PORT = process.env.SERVER_PORT || 4000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  const filePath = path.resolve(__dirname, "./dist", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }

    data = data
      .replace(/__OG_TITLE__/g, "Headline")
      .replace(/__OG_DESCRIPTION__/g, "Headline allows you to own your data")
      .replace(/__OG_IMAGE__/g, "/src/assets/favicon.svg");

    res.send(data);
  });
});

app.get("/pub/*/article/:articleId", async (req, res) => {
  const filePath = path.resolve(__dirname, "./dist", "index.html");
  const ceramic = new CeramicClient();
  const doc = await TileDocument.load(ceramic, req.params.articleId);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }

    data = data
      .replace(/__OG_TITLE__/g, `${doc.title}`)
      .replace(/__OG_DESCRIPTION__/g, `${doc.description}`)
      .replace(/__OG_IMAGE__/g, doc.previewImg);

    res.send(data);
  });
});

app.use(express.static(path.resolve(__dirname, "./dist")));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
