import { TileDocument } from "@ceramicnetwork/stream-tile";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "../../constants";
import { Article, CeramicArticle } from "services/article/slice";
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
  },
});

export const articleRegistryActions = articleRegistrySlice.actions;

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
  async (args, thunkAPI) => {
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
        const text = await fetch(
          `https://ipfs.infura.io:5001/api/v0/cat?arg=${ceramicArticle.publicationUrl
            .split("/")
            .at(-1)}`
        );
        console.log("doc");
        console.log(text);
        // Fetch text
        // dispatch to store
        return;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);
