import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getClient } from "lib/ceramic";
import { DataModel } from "@glazed/datamodel";
import { PUBLISHED_MODELS } from "../../constants";
import { DIDDataStore } from "@glazed/did-datastore";

export const addPublishRegistryArticle = createAsyncThunk(
  "publishRegistry/add",
  async (streamId: string, thunkAPI) => {
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      await store.merge("publishRegistry", {
        [streamId]: streamId,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to save");
    }
  }
);
