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
  },
});

// async thunk that creates a publication
export const createPublication = createAsyncThunk(
  "publication/create",
  async (args: Publication, thunkAPI) => {
    // A SelfID instance can only be created with an authenticated Ceramic instance
    const client = await getClient();
    console.log("Here");
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLICATION_MODEL,
    });
    console.log("Here 2");
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    // const self = new SelfID({ client, model });
    console.log("Here");
    try {
      console.log(args);
      // const exampleNote = await model.loadTile("publication");
      // console.log(exampleNote);
      // const examplePub = await model.loadTile("publication");
      // console.log(examplePub);
      const publication = {
        name: args.name,
        description: args.description,
        articles: {},
      };
      await store.set("publication", publication);
      return publication;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } =
// publicationSlice.actions;

export default publicationSlice.reducer;
