import { createAsyncThunk } from "@reduxjs/toolkit";
import { WebClient } from "@self.id/web";
import { DataModel } from "@glazed/datamodel";
import { PUBLISHED_MODELS } from "../../constants";
import { DIDDataStore } from "@glazed/did-datastore";

export const addPublishRegistryArticle = createAsyncThunk(
  "publishRegistry/add",
  async (args: { streamId: string; client: WebClient }, thunkAPI) => {
    const client = args.client;
    const streamId = args.streamId;
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
