import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchProfile } from "lib/ceramic";
import { BasicProfile } from "@datamodels/identity-profile-basic";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {} as BasicProfile,
  reducers: {
    create(state, action: PayloadAction<BasicProfile>) {
      if (Object.keys(action.payload).length >= 0) {
        console.log("Payload");
        console.log(action.payload);
        state = action.payload;
        console.log(state);
        return state;
      }
    },
  },
});

export const profileActions = profileSlice.actions;

export const fetchProfileSlice = createSlice({
  name: "fetchProfile",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBasicProfile.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchBasicProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBasicProfile.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
    });
  },
});

export const fetchBasicProfile = createAsyncThunk(
  "profile/fetch",
  async (address: string, thunkAPI) => {
    try {
      const profile = await fetchProfile(address);
      console.log("profile");
      console.log(profile);
      console.log(address);
      if (profile) {
        thunkAPI.dispatch(profileActions.create(profile));
      }
      return profile;
    } catch (err) {
      return thunkAPI.rejectWithValue(err as Error);
    }
  }
);
