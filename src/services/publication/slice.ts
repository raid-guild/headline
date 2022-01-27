import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SelfID } from "@self.id/web";
import { getClient } from "lib/ceramic";

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
    const self = new SelfID({ client });
    try {
      console.log(args);
      const response = await self.set("publication", {
        name: args.name,
        description: args.description,
      });
      console.log(response);
      return { name: "1", description: "2" };
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
