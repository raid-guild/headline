import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SelfID } from "@self.id/web";
import { getClient } from "lib/ceramic";
import { PUBLICATION_MODEL } from "constants";
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
    articles: {},
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPublication.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.loading = false;
    });
    builder.addCase(createPublication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPublication.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchPublication.fulfilled, (state, action) => {
      if (action.payload) {
        state.name = action.payload.name;
        state.description = action.payload.description;
      }
      state.loading = false;
    });
    builder.addCase(fetchPublication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPublication.rejected, (state) => {
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
      model: PUBLICATION_MODEL,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const publication = {
        name: args.name,
        description: args.description,
        articles: {},
      };
      await store.set("publication", publication);
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
      model: PUBLICATION_MODEL,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      console.log("here");
      const publication = await store.get("publication");
      console.log("Fetching");
      console.log(publication);
      return publication;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } =
// publicationSlice.actions;

export default publicationSlice.reducer;
