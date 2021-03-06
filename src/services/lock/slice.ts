import { ethers } from "ethers";
import LitJsSdk from "lit-js-sdk";
import { WebClient } from "@self.id/web";
import {
  createSelector,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RawLock, Web3Service } from "@unlock-protocol/unlock-js";

import { networks } from "lib/networks";
import { addNftAccessControl, LitNodeClient, LitAccess } from "lib/lit";
import { getTokenSymbolAndNumber } from "lib/token";
import { updatePublication, Publication } from "services/publication/slice";
import { RootState } from "store";
import { unlockNetworks } from "lib/networks";

export type Lock = {
  name: string;
  keyPrice: string;
  expiration: number;
  outstandingKeys: number;
  lockAddress: string;
  maxNumber: number;
  keyPriceSimple: number;
  keyTokenSymbol: string;
  chainNumber: number;
};

type LockRegistry = { [key: string]: Lock };

export const lockSlice = createSlice({
  name: "lock",
  initialState: {} as LockRegistry,
  reducers: {
    create(
      state,
      action: PayloadAction<
        RawLock & {
          lockAddress: string;
          keyPriceSimple: number;
          keyTokenSymbol: string;
          chainNumber: number;
        }
      >
    ) {
      if (Object.keys(action.payload).length >= 0) {
        state[action.payload.lockAddress] = {
          name: action.payload.name,
          keyPrice: action.payload.keyPrice,
          expiration: action.payload.expirationDuration,
          outstandingKeys: action.payload.outstandingKeys || 0,
          lockAddress: action.payload.lockAddress,
          maxNumber: action.payload.maxNumberOfKeys || 0,
          keyPriceSimple: action.payload.keyPriceSimple,
          keyTokenSymbol: action.payload.keyTokenSymbol,
          chainNumber: action.payload.chainNumber,
        };
        return state;
      }
    },
  },
});

export const lockActions = lockSlice.actions;

export const lockSelectors = {
  getLockByAddress: createSelector(
    [
      (state: RootState) => state.lock,
      (state: RootState, address: string) => address,
    ],
    (lockRegistry: LockRegistry, address: string) => {
      return lockRegistry[address.toLowerCase()];
    }
  ),
  listLocks: createSelector(
    [(state: RootState) => state.lock],
    (lockRegistry: LockRegistry) => {
      return Object.values(lockRegistry).sort(
        (a, b) => a.keyPriceSimple - b.keyPriceSimple
      );
    }
  ),
  paidLocks: createSelector(
    [(state: RootState) => state.lock],
    (lockRegistry: LockRegistry) => {
      const val = Object.values(lockRegistry).filter((lock) => {
        return lock.keyPriceSimple > 0;
      });
      return val;
    }
  ),
  freeLocks: createSelector(
    [(state: RootState) => state.lock],
    (lockRegistry: LockRegistry) => {
      const val = Object.values(lockRegistry).filter((lock) => {
        return lock.keyPriceSimple === 0;
      });
      return val;
    }
  ),
};

export const verifyLockSlice = createSlice({
  name: "verifyLock",
  initialState: {
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(verifyLock.fulfilled, (state) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(verifyLock.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyLock.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
      state.error = "Failed to verify lock";
    });
  },
});

export const verifyLock = createAsyncThunk<
  // Return type of the payload creator
  RawLock | undefined,
  // First argument to the payload creator
  {
    address: string;
    chainId: string;
    web3Service: Web3Service;
    client: WebClient;
    litClient: LitNodeClient;
    ownerAddress: string;
  },
  // Types for ThunkAPI
  {
    rejectValue: string;
  }
>("lock/verify", async (args, thunkAPI) => {
  try {
    const chainMeta = networks[args.chainId];
    const chain = chainMeta.chainNumber;
    const litClient = args.litClient;
    const web3Service = new Web3Service(unlockNetworks);
    const lock = (await web3Service.getLock(args.address, chain)) as RawLock & {
      beneficiary: string;
    };
    if (lock) {
      if (lock.beneficiary.toLowerCase() !== args.ownerAddress.toLowerCase()) {
        return thunkAPI.rejectWithValue("You do not own that lock");
      }
      const provider = new ethers.providers.JsonRpcProvider(chainMeta.rpc);

      const { symbol, num } = await getTokenSymbolAndNumber(
        lock.keyPrice,
        lock.currencyContractAddress,
        provider,
        args.chainId
      );
      const { publication } = thunkAPI.getState() as RootState;
      thunkAPI.dispatch(
        lockActions.create({
          ...lock,
          lockAddress: args.address.toLowerCase(),
          keyPriceSimple: parseFloat(num),
          keyTokenSymbol: symbol,
          chainNumber: chain,
        })
      );
      // update lit rules
      const additionalParams = {} as { publishAccess: LitAccess };
      if (parseFloat(num) > 0) {
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: chainMeta.litName,
        });

        const controls = addNftAccessControl(
          publication.publishAccess.accessControlConditions,
          chainMeta.litName,
          args.address
        );
        await litClient.saveEncryptionKey({
          accessControlConditions: controls,
          encryptedSymmetricKey: LitJsSdk.uint8arrayFromString(
            publication.publishAccess.encryptedSymmetricKey,
            "base16"
          ),
          authSig,
          chain: chainMeta.litName,
          permanant: false,
        });
        // Update access controls
        additionalParams["publishAccess"] = {
          encryptedSymmetricKey:
            publication.publishAccess.encryptedSymmetricKey,
          accessControlConditions: controls,
        };
      }
      // We must update the publication if the key is updated
      try {
        await thunkAPI.dispatch(
          updatePublication({
            publication: {
              description: publication.description || "",
              name: publication.name,
              locks: [
                ...new Set([
                  ...publication.locks,
                  { address: args.address, chainId: args.chainId },
                ]),
              ],
              ...additionalParams,
            },
            client: args.client,
            chainName: networks[args.chainId].litName,
            litClient,
          })
        );
        return lock;
      } catch (err) {
        const authSig = await LitJsSdk.checkAndSignAuthMessage({
          chain: chainMeta.litName,
        });
        await litClient.saveEncryptionKey({
          accessControlConditions:
            publication.publishAccess.accessControlConditions,
          encryptedSymmetricKey: LitJsSdk.uint8arrayFromString(
            publication.publishAccess.encryptedSymmetricKey,
            "base16"
          ),
          authSig,
          chain: chainMeta.litName,
          permanant: false,
        });

        console.error(err);
        return thunkAPI.rejectWithValue("Failed to update verified lock");
      }
    }
  } catch (err) {
    console.error(err);
    return thunkAPI.rejectWithValue("Failed to verify");
  }
});

export const fetchLocks = createAsyncThunk(
  "lock/verify",
  async (
    args: {
      web3Service: Web3Service;
      publication: Publication;
    },
    thunkAPI
  ) => {
    try {
      // get from Ceramic object
      // then use unlock and create for each
      const publication = args.publication;
      for (const idx in publication.locks) {
        const lockMeta = publication.locks[parseInt(idx) || 0];
        const chain = networks[lockMeta.chainId];
        const chainNumber = chain.chainNumber;
        const provider = new ethers.providers.JsonRpcProvider(chain.rpc);

        const lock = await args.web3Service.getLock(
          lockMeta.address,
          chainNumber
        );
        if (lock) {
          const { symbol, num } = await getTokenSymbolAndNumber(
            lock.keyPrice,
            lock.currencyContractAddress,
            provider,
            lockMeta.chainId
          );
          thunkAPI.dispatch(
            lockActions.create({
              ...lock,
              lockAddress: lockMeta.address.toLowerCase(),
              keyPriceSimple: parseFloat(num),
              keyTokenSymbol: symbol,
              chainNumber: chainNumber,
            })
          );
        }
      }
      return;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to verify");
    }
  }
);
