import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RawLock, Web3Service } from "@unlock-protocol/unlock-js";

import { networks } from "lib/networks";
import { updatePublication } from "services/publication/slice";
import { RootState } from "store";

type Lock = {
  name: string;
  keyPrice: string;
  expiration: number;
  outstandingKeys: number;
  lockAddress: string;
};

export const lockSlice = createSlice({
  name: "lock",
  initialState: {} as { [key: string]: Lock },
  reducers: {
    create(state, action: PayloadAction<RawLock & { lockAddress: string }>) {
      if (Object.keys(action.payload).length >= 0) {
        state[action.payload.lockAddress] = {
          name: action.payload.name,
          keyPrice: action.payload.keyPrice,
          expiration: action.payload.expirationDuration,
          outstandingKeys: action.payload.outstandingKeys || 0,
          lockAddress: action.payload.lockAddress,
        };
        return state;
      }
    },
  },
});

export const lockActions = lockSlice.actions;

export const verifyLockSlice = createSlice({
  name: "verifyLock",
  initialState: {
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(verifyLock.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(verifyLock.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyLock.rejected, (state, action) => {
      console.error(action);
      state.loading = false;
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
    },
    thunkAPI
  ) => {
    try {
      const chain = networks[args.chainId].chainNumber;
      console.log(args.address);
      console.log(chain);
      console.log(args.web3Service);
      const lock = await args.web3Service.getLock(args.address, chain);
      console.log(lock);
      if (lock) {
        const { publication } = thunkAPI.getState() as RootState;
        thunkAPI.dispatch(
          lockActions.create({ ...lock, lockAddress: args.address })
        );
        thunkAPI.dispatch(
          updatePublication({
            description: publication.description,
            name: publication.name,
            locks: [...publication.locks, args.address],
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
