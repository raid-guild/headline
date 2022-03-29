import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import LitJsSdk from "lit-js-sdk";
import { ethers } from "ethers";
import { WebClient } from "@self.id/web";
import { Web3Service } from "@unlock-protocol/unlock-js";

import { storeIpfs } from "lib/ipfs";
import { getKeyEncryptText, getKeyAndDecrypt } from "lib/lit";
import { PUBLISHED_MODELS, CERAMIC_URL } from "../../constants";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import {
  getClient,
  singleAddressAccessControl,
  generateSymmetricKey,
  LitAccess,
  AccessControl,
  Operator,
  LitNodeClient,
} from "lib/lit";
import { fetchLocks } from "services/lock/slice";
import { RootState } from "store";
import { ChainName } from "types";

export type PublicationLock = {
  chainId: string;
  address: string;
};

export type MailGunSettings = {
  domain: string;
  apiKey: string;
  infra: string;
  mailFrom: string;
};

export type Publication = {
  name?: string;
  description?: string;
  draftAccess: LitAccess;
  publishAccess: LitAccess;
  locks?: PublicationLock[];
  streamId?: string;
  emailSettings?: MailGunSettings;
  registryId?: string;
  image?: string;
};

export const publicationSlice = createSlice({
  name: "publication",
  initialState: {
    name: "",
    description: "",
    draftAccess: {
      encryptedSymmetricKey: "",
      accessControlConditions: [] as (AccessControl | Operator)[],
    },
    publishAccess: {
      encryptedSymmetricKey: "",
      accessControlConditions: [] as (AccessControl | Operator)[],
    },
    locks: [] as PublicationLock[],
    mailTo: "",
    apiKey: "",
    streamId: "",
    registryId: "",
    image: "",
    emailSettings: {
      domain: "",
      apiKey: "",
      infra: "",
      mailFrom: "",
    } as MailGunSettings | undefined,
  },
  reducers: {
    create(state, action: PayloadAction<Publication>) {
      state.name = action.payload.name || "";
      state.description = action.payload.description || "";
      state.draftAccess = action.payload.draftAccess;
      state.publishAccess = action.payload.publishAccess;
      state.locks = action.payload.locks || [];
      state.emailSettings = action.payload.emailSettings || undefined;
      state.streamId = action.payload.streamId || "";
      console.log(`publication id ${action.payload.streamId}`);
      state.registryId = action.payload.registryId || "";
      state.image = action.payload.image || "";
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
    builder.addCase(fetchPublication.fulfilled, (state) => {
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

export const createPublicationSlice = createSlice({
  name: "createPublication",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPublication.fulfilled, (state) => {
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

export const updatePublicationSlice = createSlice({
  name: "updatePublication",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updatePublication.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updatePublication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updatePublication.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
    });
  },
});

// async thunk that creates a publication
export const createPublication = createAsyncThunk(
  "publication/create",
  async (
    args: {
      publication: Omit<Publication, "draftAccess" | "publishAccess">;
      client: WebClient;
      address: string;
      chainName: string;
    },
    thunkAPI
  ) => {
    if (!args.address) {
      return;
    }
    const pub = args.publication;
    const client = args.client;
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    await store.set("publishRegistry", {});
    const publishRegistryDefinitionId = await store.getDefinitionID(
      "publishRegistry"
    );
    const registryDoc = await store.getRecordDocument(
      publishRegistryDefinitionId,
      client.ceramic?.did?.id || ""
    );
    console.log("RegistryDoc");
    console.log(registryDoc?.id);

    try {
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: args.chainName,
      });
      const draftKey = await generateSymmetricKey();
      const addressAccessControls = singleAddressAccessControl(args.address);
      const litClient = await getClient();
      const draftEncryptedSymmetricKey = await litClient.saveEncryptionKey({
        accessControlConditions: addressAccessControls,
        symmetricKey: draftKey,
        authSig,
        chain: args.chainName,
        permanant: false,
      });

      const publishKey = await generateSymmetricKey();
      const publishEncryptedSymmetricKey = await litClient.saveEncryptionKey({
        accessControlConditions: addressAccessControls,
        symmetricKey: publishKey,
        authSig,
        chain: args.chainName,
        permanant: false,
      });

      const publication = {
        name: pub.name,
        description: pub.description,
        draftAccess: {
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            draftEncryptedSymmetricKey,
            "base16"
          ),
          accessControlConditions: addressAccessControls,
        },
        publishAccess: {
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            publishEncryptedSymmetricKey,
            "base16"
          ),
          accessControlConditions: addressAccessControls,
        },
        registryId: registryDoc?.id?.toString(),
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
  async (
    args: {
      provider: ethers.providers.Provider;
      web3Service: Web3Service;
      chainName: ChainName;
      client: WebClient;
      litClient: LitNodeClient;
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
      const definitionId = await store.getDefinitionID("publication");
      const doc = await store.getRecordDocument(
        definitionId,
        client.ceramic?.did?.id || ""
      );
      const publishRegistryDefinitionId = await store.getDefinitionID(
        "publishRegistry"
      );
      const registryDoc = await store.getRecordDocument(
        publishRegistryDefinitionId,
        client.ceramic?.did?.id || ""
      );

      console.log(`
Pub jdoc ${doc?.id?.toString()}
				`);
      let publication = doc?.content as Publication | null;
      if (publication && publication?.emailSettings?.apiKey) {
        const apiKey = await getKeyAndDecrypt(
          args.chainName,
          publication.draftAccess.encryptedSymmetricKey,
          publication.draftAccess.accessControlConditions,
          publication.emailSettings.apiKey,
          args.litClient
        );
        publication = {
          ...publication,
          emailSettings: { ...publication.emailSettings, apiKey },
        };
      }
      if (publication) {
        thunkAPI.dispatch(
          publicationActions.create({
            ...publication,
            streamId: doc?.id?.toString(),
            registryId: registryDoc?.id?.toString(),
          })
        );
        thunkAPI.dispatch(
          fetchLocks({
            // provider: args.provider,
            web3Service: args.web3Service,
            publication,
          })
        );
      }
      return publication;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// async thunk that fetches a publication
export const fetchPublicationByStream = createAsyncThunk(
  "publication/fetchOne",
  async (
    args: {
      streamId: string;
    },
    thunkAPI
  ) => {
    const client = new WebClient({
      ceramic: (CERAMIC_URL as string) || "testnet-clay",
      connectNetwork: "testnet-clay",
    });
    try {
      const loader = new TileLoader({ ceramic: client.ceramic, cache: true });
      const doc = await loader.load(args.streamId);
      const publication = doc.content as Publication;
      if (publication) {
        thunkAPI.dispatch(
          publicationActions.create({
            ...publication,
            streamId: doc?.id.toString(),
            registryId: publication?.registryId,
          })
        );
        // thunkAPI.dispatch(
        //   fetchLocks({
        //     provider: args.provider,
        //     web3Service: args.web3Service,
        //     publication,
        //   })
        // );
      }
      return publication;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to fetch");
    }
  }
);

// async thunk that creates a publication
export const updatePublication = createAsyncThunk(
  "publication/update",
  async (
    args: {
      publication: Omit<Publication, "draftAccess" | "publishAccess"> & {
        publishAccess?: LitAccess;
        draftAccess?: LitAccess;
        imgFile?: File | null;
      };
      chainName: ChainName;
      client: WebClient;
      litClient: LitNodeClient;
    },
    thunkAPI
  ) => {
    const pub = args.publication;
    const client = args.client;
    const litClient = args.litClient;
    const model = new DataModel({
      ceramic: client.ceramic,
      model: PUBLISHED_MODELS,
    });
    const store = new DIDDataStore({ ceramic: client.ceramic, model: model });
    try {
      const { publication } = thunkAPI.getState() as RootState;
      const updates = {} as {
        name: string;
        description: string;
        locks: PublicationLock[];
        emailSettings: MailGunSettings;
        publishAccess?: LitAccess;
        image?: string;
      };
      if (pub.name !== undefined) {
        updates["name"] = pub.name;
      }
      if (pub.description !== undefined) {
        updates["description"] = pub.description;
      }
      if (pub.locks !== undefined) {
        updates["locks"] = pub.locks;
      }
      if (pub.imgFile !== undefined && pub.imgFile !== null) {
        const arrBuff = await pub.imgFile.arrayBuffer();
        const ipfsUri = await storeIpfs(arrBuff);
        updates["image"] = ipfsUri;
      }

      if (pub.emailSettings !== undefined) {
        let apiKey;
        if (pub.emailSettings.apiKey !== undefined) {
          const content = await getKeyEncryptText(
            args.chainName,
            publication.draftAccess.encryptedSymmetricKey,
            publication.draftAccess.accessControlConditions,
            pub.emailSettings.apiKey,
            litClient
          );

          apiKey = content;
        }
        updates["emailSettings"] = { ...pub.emailSettings, apiKey: apiKey };
      }
      if (pub.publishAccess !== undefined) {
        updates["publishAccess"] = pub.publishAccess;
      }

      const updatedPublication = {
        ...publication,
        ...updates,
      };
      console.log(updatedPublication);
      console.log(updates);
      await store.set("publication", updatedPublication);
      if (updatedPublication?.emailSettings?.apiKey !== undefined) {
        updatedPublication["emailSettings"]["apiKey"] =
          pub?.emailSettings?.apiKey || "";
      }
      await thunkAPI.dispatch(publicationActions.create(updatedPublication));
      return publication;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to update publication");
    }
  }
);

export default publicationSlice.reducer;
