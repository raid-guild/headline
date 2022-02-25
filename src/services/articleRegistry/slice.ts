import { Base64 } from "js-base64";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { getClient } from "lib/ceramic";
import { getEncryptionKey, decryptText } from "lib/lit";
import { PUBLISHED_MODELS } from "../../constants";
import { RootState } from "store";
import { Article, CeramicArticle } from "services/article/slice";
import { ChainName } from "types";
import uint8arrayFromString from "uint8arrays/from-string";
import { createSelector } from "@reduxjs/toolkit";

import { getIPFSClient } from "lib/ipfs";

export const articleRegistrySlice = createSlice({
  name: "articleRegistry",
  initialState: {} as { [key: string]: Article },
  reducers: {
    add(state, action: PayloadAction<Article>) {
      if (action.payload.streamId) {
        state[action.payload.streamId] = action.payload;
      }
    },
    update(state, action: PayloadAction<Article>) {
      if (action.payload.streamId) {
        state[action.payload.streamId] = action.payload;
      }
    },
  },
});

export const articleRegistryActions = articleRegistrySlice.actions;

export const articleRegistrySelectors = {
  getArticleByStreamId: createSelector(
    [
      // Usual first input - extract value from `state`
      (state) => state.articleRegistry,
      // Take the second arg, `category`, and forward to the output selector
      (state, streamId) => streamId,
    ],
    (articleRegistry, streamId) => {
      return articleRegistry[streamId];
    }
  ),
};

export const addArticleSlice = createSlice({
  name: "addArticle",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addRegistryArticle.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addRegistryArticle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addRegistryArticle.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
    });
  },
});

// async thunk that creates a publication
export const addRegistryArticle = createAsyncThunk(
  "articleRegistry/add",
  async (streamId: string, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    console.log("Adding to registry");
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      await store.merge("articleRegistry", {
        [streamId]: streamId,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);

export const fetchArticleRegistry = createAsyncThunk(
  "articleRegistry/fetch",
  async (args: { chainName: ChainName }, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const articleRegistry = await store.get("articleRegistry");
      console.log("articleRegistry");
      console.log(articleRegistry);
      const ipfs = getIPFSClient();
      for (const streamId in articleRegistry) {
        // load streams
        console.log("Iterating");
        const doc = await TileDocument.load(client.ceramic, streamId);
        const ceramicArticle = doc.content as CeramicArticle;
        const resp = await fetch(
          `https://ipfs.infura.io:5001/api/v0/cat?arg=${ceramicArticle.publicationUrl
            .split("/")
            .at(-1)}`
        );
        const readableStream = resp?.body?.getReader();
        console.log(readableStream);
        if (!readableStream) {
          return;
        }
        const encodedText = await readableStream.read();
        let articleText = new TextDecoder().decode(encodedText.value);

        // Having trouble decrypting Lit's docs bad
        // decrypt text
        if (ceramicArticle.status === "draft" || ceramicArticle.paid) {
          const { publication } = thunkAPI.getState() as RootState;
          const access =
            ceramicArticle.status === "draft"
              ? publication.draftAccess
              : publication.publishAccess;

          const symmetricKey = await getEncryptionKey(
            args.chainName,
            access.encryptedSymmetricKey,
            access.accessControlConditions
          );
          console.log("Decrypting");
          console.log(articleText);
          console.log(symmetricKey);
          const a = await decryptText(
            uint8arrayFromString(articleText, "base64"),
            symmetricKey
          ).catch((e) => console.error(e));
          articleText = a || "error";
          console.log("Deecrypted");
          console.log(a);
        }
        thunkAPI.dispatch(
          articleRegistryActions.add({
            ...ceramicArticle,
            text: articleText,
            streamId: streamId,
          })
        );
      }
      return;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);
