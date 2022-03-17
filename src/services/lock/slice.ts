import { ethers } from "ethers";
import LitJsSdk from "lit-js-sdk";
import {
  createSelector,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RawLock, Web3Service } from "@unlock-protocol/unlock-js";

import { networks } from "lib/networks";
import { addNftAccessControl, litClient } from "lib/lit";
import { getTokenSymbolAndNumber } from "lib/token";
import { updatePublication, Publication } from "services/publication/slice";
import { RootState } from "store";

export type Lock = {
  name: string;
  keyPrice: string;
  expiration: number;
  outstandingKeys: number;
  lockAddress: string;
  maxNumber: number;
  keyPriceSimple: number;
  keyTokenSymbol: string;
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
        console.log("Simple");
        console.log(lock.keyPriceSimple);
        return lock.keyPriceSimple > 0;
      });
      console.log(val);
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

export const verifyLock = createAsyncThunk(
  "lock/verify",
  async (
    args: {
      address: string;
      chainId: string;
      web3Service: Web3Service;
      provider: ethers.providers.Provider;
    },
    thunkAPI
  ) => {
    try {
      const chainMeta = networks[args.chainId];
      const chain = chainMeta.chainNumber;
      const lock = await args.web3Service.getLock(args.address, chain);
      if (lock) {
        const { symbol, num } = await getTokenSymbolAndNumber(
          lock.keyPrice,
          lock.currencyContractAddress,
          args.provider,
          args.chainId
        );
        const { publication } = thunkAPI.getState() as RootState;
        thunkAPI.dispatch(
          lockActions.create({
            ...lock,
            lockAddress: args.address.toLowerCase(),
            keyPriceSimple: num,
            keyTokenSymbol: symbol,
          })
        );
        // update lit rules
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
              publication.publishAccess.encryptedSymmetricKey
            ),
            authSig,
            chain: chainMeta.litName,
            permanant: false,
          });
        }
        await thunkAPI.dispatch(
          updatePublication({
            publication: {
              description: publication.description || "",
              name: publication.name,
              locks: [
                ...publication.locks,
                { address: args.address, chainId: args.chainId },
              ],
            },

            chainName: networks[args.chainId].litName,
          })
        );
      }
      return lock;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to verify");
    }
  }
);

export const fetchLocks = createAsyncThunk(
  "lock/verify",
  async (
    args: {
      web3Service: Web3Service;
      provider: ethers.providers.Provider;
      publication: Publication;
    },
    thunkAPI
  ) => {
    try {
      // get from Ceramic object
      // then use unlock and create for each
      const publication = args.publication;
      for (const idx in publication.locks) {
        console.log("Iterating");
        console.log(idx);
        const lockMeta = publication.locks[parseInt(idx) || 0];
        const chain = networks[lockMeta.chainId].chainNumber;

        const lock = await args.web3Service.getLock(lockMeta.address, chain);
        if (lock) {
          const { symbol, num } = await getTokenSymbolAndNumber(
            lock.keyPrice,
            lock.currencyContractAddress,
            args.provider,
            lockMeta.chainId
          );
          const { publication } = thunkAPI.getState() as RootState;
          thunkAPI.dispatch(
            lockActions.create({
              ...lock,
              lockAddress: lockMeta.address.toLowerCase(),
              keyPriceSimple: num,
              keyTokenSymbol: symbol,
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
