import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SelfID } from "@self.id/web";
import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "constants";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { encryptText } from "lib/ceramic";
import { getIPFSClient } from "lib/ipfs";

export type CeramicArticle = {
  publicationUrl: string;
  title: string;
  createdAt: Date;
  status: "draft" | "published";
  previewImg?: string;
  paid?: boolean;
};
export type Article = {
  text: string;
} & Omit<CeramicArticle, "publicationUrl">;

export const articleSlice = createSlice({
  name: "article",
  initialState: {
    publicationUrl: "",
    title: "",
    createdAt: new Date(),
    status: "draft",
    paid: false,
    previewImg: "",
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createArticle.fulfilled, (state, action) => {
      state.publicationUrl = action.payload.publicationUrl;
      state.title = action.payload.title;
      state.createdAt = new Date(action.payload.createdAt);
      state.status = action.payload.status;
      state.paid = action.payload?.paid || false;
      state.previewImg = action.payload?.previewImg || "";
    });
    builder.addCase(createArticle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createArticle.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const createArticle = createAsyncThunk(
  "article/create",
  async (
    args: { article: Article; encrypt?: boolean; sharedDids?: string[] },
    thunkAPI
  ) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      let publicationUrl;
      if (args.encrypt && client.ceramic.did) {
        publicationUrl = `ipfs://${await encryptText(
          client.ceramic?.did,
          args.article.text,
          args.sharedDids || []
        )}`;
      } else {
        const ipfs = getIPFSClient();
        const cid = await ipfs.dag.put(args.article.text);
        publicationUrl = `ipfs://${cid}`;
      }

      const article = {
        publicationUrl: publicationUrl,
        title: args.article.title,
        createdAt: args.article.createdAt,
        status: args.article.status,
        previewImg: args.article?.previewImg || null,
        paid: args.article.paid || null,
      };
      await store.set("article", article);
      return article;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);

//// async thunk that creates a publication
//export const createPublication = createAsyncThunk(
//  "publication/create",
//  async (args: Publication, thunkAPI) => {
//    const client = await getClient();
//    const model = new DataModel({
//      ceramic: client.ceramic,
//      model: PUBLICATION_MODEL,
//    });
//    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
//    try {
//      const publication = {
//        name: args.name,
//        description: args.description,
//        articles: {},
//      };
//      await store.set("publication", publication);
//      return publication;
//    } catch (err) {
//      return thunkAPI.rejectWithValue("Failed to save");
//    }
//  }
//);
//
//// async thunk that fetches a publication
//export const fetchPublication = createAsyncThunk(
//  "publication/fetch",
//  async (args, thunkAPI) => {
//    console.log("here");
//    const client = await getClient();
//    const model = new DataModel({
//      ceramic: client.ceramic,
//      model: PUBLICATION_MODEL,
//    });
//    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
//    try {
//      console.log("here");
//      const publication = await store.get("publication");
//      console.log("Fetching");
//      console.log(publication);
//      return publication;
//    } catch (err) {
//      return thunkAPI.rejectWithValue("Failed to fetch");
//    }
//  }
//);
//
//// Action creators are generated for each case reducer function
//// export const { increment, decrement, incrementByAmount } =
//// publicationSlice.actions;
//
//export default publicationSlice.reducer;
