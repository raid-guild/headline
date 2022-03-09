import { ethers } from "ethers";
import {
  createSelector,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RawLock, Web3Service } from "@unlock-protocol/unlock-js";

import { networks } from "lib/networks";
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
      const chain = networks[args.chainId].chainNumber;
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
        thunkAPI.dispatch(
          updatePublication({
            description: publication.description,
            name: publication.name,
            locks: [
              ...publication.locks,
              { address: args.address, chainId: args.chainId },
            ],
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
        return lock;
      }
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue("Failed to verify");
    }
  }
);
