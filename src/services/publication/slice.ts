import {
  createAsyncThunk,
  createSlice,
  PayloadActrion,
} from "@reduxjs/toolkit";
import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "../../constants";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";

export type Publication = {
  name: string;
  description: string;
};

export const publicationSlice = createSlice({
  name: "publication",
  initialState: {
    name: "",
    description: "",
  },
  reducers: {
    create(state, action: PayloadAction<Publication>) {
      state.name = "";
    },
  },
});

export const publicationFetchSlice = createSlice({
  name: "publication/fetch",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPublication.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchPublication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPublication.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const publicationCreateSlice = createSlice({
  name: "publication/create",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPublication.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createPublication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPublication.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
    });
  },
});

// async thunk that creates a publication
export const createPublication = createAsyncThunk(
  "publication/create",
  async (args: Publication, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const publication = {
        name: args.name,
        description: args.description,
      };
      await store.set("publication", publication);
      console.log(publication);
      return publication;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);

// async thunk that fetches a publication
export const fetchPublication = createAsyncThunk(
  "publication/fetch",
  async (args, thunkAPI) => {
    console.log("here");
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      console.log("here");
      const publication = await store.get("publication");
      console.log("Fetching");
      console.log(publication);
      return publication;
    } catch (err) {
      console.log("err");
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

export const addArticle = createAsyncThunk(
  "publication/add_article",
  async (args, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      console.log("here");
      await store.merge(args.streamId, args.streamId);
      // store in article redux store
      return publication;
    } catch (err) {
      console.log("err");
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } =
// publicationSlice.actions;

export default publicationSlice.reducer;
