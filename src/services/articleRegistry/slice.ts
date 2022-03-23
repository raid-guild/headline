import { TileDocument } from "@ceramicnetwork/stream-tile";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TileLoader } from "@glazed/tile-loader";
import { DataModel } from "@glazed/datamodel";
import { WebClient } from "@self.id/web";
import { DIDDataStore } from "@glazed/did-datastore";
import { fetchAndDecryptArticle } from "lib/headline";
import { PUBLISHED_MODELS, CERAMIC_URL } from "../../constants";
import { RootState } from "store";
import { Article, CeramicArticle } from "services/article/slice";
import { ChainName } from "types";
import { createSelector } from "@reduxjs/toolkit";
import { LitNodeClient } from "lib/lit";

type ArticleRegistry = { [key: string]: Article };

export const articleRegistrySlice = createSlice({
  name: "articleRegistry",
  initialState: {} as ArticleRegistry,
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
  async (args: { streamId: string; client: WebClient }, thunkAPI) => {
    const streamId = args.streamId;
    const client = args.client;

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
  "articleRegistry/remove",
  async (args: { streamId: string; client: WebClient }, thunkAPI) => {
    const streamId = args.streamId;
    const client = args.client;
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
  async (
    args: {
      chainName?: ChainName;
      registry?: string;
      registryId?: string;
      litClient: LitNodeClient;
      client: WebClient;
    },
    thunkAPI
  ) => {
    const client = args.client;
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      let articleRegistry = {} as { [key: string]: string } | null;
      if (args.registry === "publishRegistry" && args.registryId) {
        const doc = await TileDocument.load(client.ceramic, args.registryId);
        articleRegistry = doc?.content as { [key: string]: string };
      } else {
        articleRegistry = await store.get(args.registry || "articleRegistry");
      }
      for (const streamId in articleRegistry) {
        // load streams
        const doc = await TileDocument.load(client.ceramic, streamId);
        const ceramicArticle = doc.content as CeramicArticle;
        const { publication } = thunkAPI.getState() as RootState;
        const articleText = await fetchAndDecryptArticle(
          args.chainName,
          publication,
          ceramicArticle?.status,
          ceramicArticle.publicationUrl,
          args.litClient,
          (ceramicArticle.status === "draft" || ceramicArticle.paid) &&
            !!args.chainName
        );
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

export const fetchArticle = createAsyncThunk(
  "articleRegistry/fetchOne",
  async (args: { streamId: string; chainName?: ChainName }, thunkAPI) => {
    const client = new WebClient({
      ceramic: (CERAMIC_URL as string) || "testnet-clay",
      connectNetwork: "testnet-clay",
    });
    try {
      const loader = new TileLoader({ ceramic: client.ceramic, cache: true });
      const doc = await loader.load(args.streamId);
      // load streams
      const ceramicArticle = doc.content as CeramicArticle;
      const { publication } = thunkAPI.getState() as RootState;
      const articleText = await fetchAndDecryptArticle(
        args.chainName,
        publication,
        ceramicArticle?.status,
        ceramicArticle.publicationUrl,

        (ceramicArticle.status === "draft" || ceramicArticle.paid) &&
          !!args.chainName
      );

      thunkAPI.dispatch(
        articleRegistryActions.add({
          ...ceramicArticle,
          text: articleText,
          streamId: args.streamId,
        })
      );
      return;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);
