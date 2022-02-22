import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import LitJsSdk from "@alexkeating/lit-js-sdk";

import { getClient } from "lib/ceramic";
import { PUBLISHED_MODELS } from "../../constants";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import {
  litClient,
  singleAddressAccessControl,
  generateSymmetricKey,
} from "lib/lit";

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
      console.log(action);
      state.name = action.payload.name;
      state.description = action.payload.description;
    },
  },
});

export const publicationActions = publicationSlice.actions;

export const fetchPublicationSlice = createSlice({
  name: "fetchPublication",
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

export const createPublicationSlice = createSlice({
  name: "createPublication",
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
  async (
    args: { publication: Publication; address: string; chainName: string },
    thunkAPI
  ) => {
    if (!args.address) {
      return;
    }
    const pub = args.publication;
    const client = await getClient();
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: args.chainName,
      });
      const draftKey = await generateSymmetricKey();
      const addressAccessControls = singleAddressAccessControl(args.address);
      console.log(draftKey);
      console.log({
        addressAccessControls,
        draftKey,
        authSig,
        chainName: args.chainName,
      });
      const draftEncryptedSymmetricKey = await litClient.saveEncryptionKey({
        accessControlConditions: addressAccessControls,
        symmetricKey: draftKey,
        authSig,
        chain: args.chainName,
      });

      const publishKey = await generateSymmetricKey();
      const publishEncryptedSymmetricKey = await litClient.saveEncryptionKey({
        accessControlConditions: addressAccessControls,
        symmetricKey: publishKey,
        authSig,
        chain: args.chainName,
      });

      const publication = {
        name: pub.name,
        description: pub.description,
        draftAccess: {
          encryptedSymmetricKey: new TextDecoder().decode(
            draftEncryptedSymmetricKey
          ),
          accessControlConditions: addressAccessControls,
        },
        publishAccess: {
          encryptedSymmetricKey: new TextDecoder().decode(
            publishEncryptedSymmetricKey
          ),
          accessControlConditions: addressAccessControls,
        },
      };
      await store.set("publication", publication);
      thunkAPI.dispatch(publicationActions.create(publication));
      return publication;
    } catch (err) {
      console.error(err);
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
      if (publication) {
        thunkAPI.dispatch(publicationActions.create(publication));
      }
      return publication;
    } catch (err) {
      console.log("err");
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// export const addArticle = createAsyncThunk(
//   "publication/add_article",
//   async (args, thunkAPI) => {
//     const client = await getClient();
//     const model = new DataModel({
//       ceramic: client.ceramic,
//       model: PUBLISHED_MODELS,
//     });
//     const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
//     try {
//       console.log("here");
//       await store.merge(args.streamId, args.streamId);
//       // store in article redux store
//       return publication;
//     } catch (err) {
//       console.log("err");
//       console.error(err);
//       return thunkAPI.rejectWithValue("Failed to fetch");
//     }
//   }
// );

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } =
// publicationSlice.actions;

export default publicationSlice.reducer;
