import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "../../constants";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { getIPFSClient } from "lib/ipfs";
import { CID } from "ipfs-http-client";

import { addRegistryArticle } from "services/articleRegistry/slice";
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
    builder.addCase(createArticle.fulfilled, (state, action) => {
      console.log("Success");
      console.log(state);
      state.loading = false;
    });
    builder.addCase(createArticle.pending, (state) => {
      state.loading = true;
      console.log("Pending");
    });
    builder.addCase(createArticle.rejected, (state, action) => {
      console.log(action);
      console.log("Err");
      state.loading = false;
    });
  },
});

export const createArticle = createAsyncThunk(
  "article/create",
  async (
    args: {
      article: Omit<Article, "publicationUrl">;
      encrypt?: boolean;
      chainName?: ChainName;
    },
    thunkAPI
  ) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
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
        content = await encryptText(content, symmetricKey);
      }
      const ipfs = getIPFSClient();
      console.log({ content: args.article.text });
      if (args.article.text) {
        const cid = await ipfs.add(
          { content: content },
          {
            cidVersion: 1,
            hashAlg: "sha2-256",
          }
        );
        console.log(cid);
        await ipfs.pin.add(CID.parse(cid.path));
        publicationUrl = `ipfs://${cid.path}`;
      }

      console.log("Create Article");
      const article = {
        publicationUrl: publicationUrl,
        title: args.article.title || "",
        createdAt: args.article.createdAt,
        status: args.article.status,
        // previewImg: args.article?.previewImg,
        paid: args.article.paid || false,
      };
      console.log(article);
      if (publicationUrl) {
        const baseArticle = {
          publicationUrl: publicationUrl,
          title: args.article.title || "",
          createdAt: args.article.createdAt,
          status: args.article.status,
          // previewImg: args.article?.previewImg,
          paid: args.article.paid || false,
        };

        const stream = await store.set("article", baseArticle);
        const streamId = stream.toString();
        const article = {
          ...baseArticle,
          streamId: streamId,
          text: args.article.text,
        };
        thunkAPI.dispatch(articleActions.create(article));
        thunkAPI.dispatch(addRegistryArticle(streamId));
        // save to registry
        console.log("Article Saved");
        return article;
      }
      // thunkAPI.dispatch(addPublicationArticle(stream.toString()));
      // save stream on article
      return;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);
