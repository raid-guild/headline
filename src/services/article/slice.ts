import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "../../constants";
import { DataModel } from "@glazed/datamodel";
import { getIPFSClient } from "lib/ipfs";
import { CID } from "ipfs-http-client";
import uint8arrayToString from "uint8arrays/to-string";

import {
  addRegistryArticle,
  articleRegistryActions,
} from "services/articleRegistry/slice";
import { getEncryptionKey, encryptText } from "lib/lit";
import { RootState } from "store";
import { ChainName } from "types";

export type CeramicArticle = {
  publicationUrl: string;
  title: string;
  createdAt: string;
  status: "draft" | "published";
  previewImg?: string;
  paid?: boolean;
};
export type Article = {
  text: string;
  streamId?: string;
} & CeramicArticle;

export const articleSlice = createSlice({
  name: "article",
  initialState: {
    publicationUrl: "",
    title: "",
    createdAt: "",
    status: "draft",
    paid: false,
    previewImg: "",
    loading: false,
    streamId: "",
    text: "",
  },
  reducers: {
    create(state, action: PayloadAction<Article>) {
      state.title = action.payload.title;
      state.createdAt = action.payload.createdAt;
      state.status = action.payload.status;
      state.paid = action.payload?.paid || false;
      state.previewImg = action.payload?.previewImg || "";
      state.streamId = action.payload?.streamId || "";
      state.text = action.payload?.text;
    },
  },
});

export const articleActions = articleSlice.actions;

export const createArticleSlice = createSlice({
  name: "createArticle",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createArticle.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createArticle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createArticle.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const createArticle = createAsyncThunk<
  Article | null,
  {
    article: Omit<Article, "publicationUrl">;
    encrypt?: boolean;
    chainName?: ChainName;
  },
  {
    rejectValue: Error;
  }
>("article/create", async (args, thunkAPI) => {
  const client = await getClient();
  const model = new DataModel({
    ceramic: client.ceramic,
    model: PUBLISHED_MODELS,
  });
  let content = args.article.text;
  try {
    let publicationUrl;
    if (args.encrypt) {
      if (!args.article.status) {
        throw Error("Missing encrypt type");
      }
      if (!args.chainName) {
        throw Error("Missing chain name");
      }
      const { publication } = thunkAPI.getState() as RootState;
      const access =
        args.article.status === "draft"
          ? publication.draftAccess
          : publication.publishAccess;
      const symmetricKey = await getEncryptionKey(
        args.chainName,
        access.encryptedSymmetricKey,
        access.accessControlConditions
      );
      const blob = await encryptText(content, symmetricKey);
      content = uint8arrayToString(
        new Uint8Array(await blob.arrayBuffer()),
        "base64"
      );
    }
    const ipfs = getIPFSClient();
    if (args.article.text) {
      const cid = await ipfs.add(
        { content: content },
        {
          cidVersion: 1,
          hashAlg: "sha2-256",
        }
      );
      await ipfs.pin.add(CID.parse(cid.path));
      publicationUrl = `ipfs://${cid.path}`;
    }

    if (publicationUrl) {
      const baseArticle = {
        publicationUrl: publicationUrl,
        title: args.article.title || "",
        createdAt: args.article.createdAt,
        status: args.article.status,
        // previewImg: args.article?.previewImg,
        paid: args.article.paid || false,
      };

      const doc = await model.createTile("Article", baseArticle);
      const streamId = doc.id.toString();
      const article = {
        ...baseArticle,
        streamId: streamId,
        text: args.article.text,
      };
      // TODO: Is this necessary with the article registry
      thunkAPI.dispatch(articleActions.create(article));
      thunkAPI.dispatch(addRegistryArticle(streamId));
      // save to registry
      return article;
    }
    return null;
  } catch (err) {
    console.log(err);
    return thunkAPI.rejectWithValue(err as Error);
  }
});

export const updateArticle = createAsyncThunk(
  "article/update",
  async (
    args: {
      article: Omit<Article, "publicationUrl" | "createdAt">;
      streamId: string;
      encrypt?: boolean;
      chainName?: ChainName;
    },
    thunkAPI
  ) => {
    const client = await getClient();
    let content = args.article.text;
    const { articleRegistry } = thunkAPI.getState() as RootState;
    const existingArticle = articleRegistry[args.streamId];
    try {
      let publicationUrl;
      if (args.encrypt) {
        if (!args.article.status) {
          throw Error("Missing encrypt type");
        }
        if (!args.chainName) {
          throw Error("Missing chain name");
        }
        const { publication } = thunkAPI.getState() as RootState;
        const access =
          args.article.status === "draft"
            ? publication.draftAccess
            : publication.publishAccess;
        const symmetricKey = await getEncryptionKey(
          args.chainName,
          access.encryptedSymmetricKey,
          access.accessControlConditions
        );
        const blob = await encryptText(content, symmetricKey);
        content = uint8arrayToString(
          new Uint8Array(await blob.arrayBuffer()),
          "base64"
        );
      }
      const ipfs = getIPFSClient();
      if (args.article.text) {
        const cid = await ipfs.add(
          { content: content },
          {
            cidVersion: 1,
            hashAlg: "sha2-256",
          }
        );
        await ipfs.pin.add(CID.parse(cid.path));
        publicationUrl = `ipfs://${cid.path}`;
      }

      const article = {
        publicationUrl: publicationUrl,
        title: args.article.title || "",
        status: args.article.status,
        // previewImg: args.article?.previewImg,
        paid: args.article.paid || false,
      };
      if (publicationUrl) {
        const baseArticle = {
          publicationUrl: publicationUrl,
          title: args.article.title || "",
          status: args.article.status,
          // previewImg: args.article?.previewImg,
          paid: args.article.paid || false,
        };

        const doc = await TileDocument.load(client.ceramic, args.streamId);
        const updatedArticle = {
          ...existingArticle,
          ...baseArticle,
        };
        await doc.update(updatedArticle);
        thunkAPI.dispatch(articleRegistryActions.update(updatedArticle));
        return baseArticle;
      }
      return;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to update");
    }
  }
);
