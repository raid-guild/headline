import { TileDocument } from "@ceramicnetwork/stream-tile";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { getClient } from "lib/ceramic";
import { getEncryptionKey, decryptText } from "lib/lit";
import { fetchIPFS } from "lib/ipfs";
import { PUBLISHED_MODELS } from "../../constants";
import { RootState } from "store";
import { Article, CeramicArticle } from "services/article/slice";
import { ChainName } from "types";
import uint8arrayFromString from "uint8arrays/from-string";
import { createSelector } from "@reduxjs/toolkit";

type ArticleRegistry = { [key: string]: Article };

export const articleRegistrySlice = createSlice({
  name: "articleRegistry",
  initialState: {} as ArticleRegistry,
  reducers: {
    add(state, action: PayloadAction<Article>) {
      if (action.payload.streamId) {
        console.log("Article Registry");
        console.log(action.payload);
        state[action.payload.streamId] = action.payload;
      }
    },
    update(state, action: PayloadAction<Article>) {
      if (action.payload.streamId) {
        state[action.payload.streamId] = action.payload;
      }
    },
    remove(state, action: PayloadAction<string>) {
      if (action.payload) {
        delete state[action.payload];
      }
    },
  },
});

export const articleRegistryActions = articleRegistrySlice.actions;

export const articleRegistrySelectors = {
  getArticleByStreamId: createSelector(
    [
      (state: RootState) => state.articleRegistry,
      (state: RootState, streamId: string) => streamId,
    ],
    (articleRegistry: ArticleRegistry, streamId: string) => {
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
    builder.addCase(addRegistryArticle.fulfilled, (state) => {
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

export const removeArticleSlice = createSlice({
  name: "removeArticle",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(removeRegistryArticle.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(removeRegistryArticle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeRegistryArticle.rejected, (state, action) => {
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

// async thunk that creates a publication
export const removeRegistryArticle = createAsyncThunk(
  "articleRegistry/add",
  async (streamId: string, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const registry = await store.get("articleRegistry");
      delete registry[streamId];
      await store.set("articleRegistry", registry);
      thunkAPI.dispatch(articleRegistryActions.remove(streamId));
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete");
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
      for (const streamId in articleRegistry) {
        // load streams
        const doc = await TileDocument.load(client.ceramic, streamId);
        const ceramicArticle = doc.content as CeramicArticle;
        console.log("Article");
        console.log(ceramicArticle);
        const resp = await fetch(
          `https://ipfs.infura.io:5001/api/v0/cat?arg=${ceramicArticle.publicationUrl
            .split("/")
            .at(-1)}`,
          {
            method: "post",
          }
        );
        const readableStream = resp?.body?.getReader();
        if (!readableStream) {
          return;
        }
        const encodedText = await readableStream.read();
        let articleText = new TextDecoder().decode(encodedText.value);
        console.log(articleText);
        console.log("article Test");

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
          const a = await decryptText(
            uint8arrayFromString(articleText, "base64"),
            symmetricKey
          ).catch((e) => console.error(e));
          articleText = a || "error";
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
