import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { articleSlice, createArticleSlice } from "services/article/slice";
import { fetchProfileSlice, profileSlice } from "services/profile/slice";
import { verifyLockSlice, lockSlice } from "services/lock/slice";
import {
  publicationSlice,
  createPublicationSlice,
  fetchPublicationSlice,
  updatePublicationSlice,
} from "services/publication/slice";
import {
  articleRegistrySlice,
  addArticleSlice,
} from "services/articleRegistry/slice";

export const store = configureStore({
  reducer: {
    [publicationSlice.name]: publicationSlice.reducer,
    [articleSlice.name]: articleSlice.reducer,
    [createArticleSlice.name]: createArticleSlice.reducer,
    [createPublicationSlice.name]: createPublicationSlice.reducer,
    [fetchPublicationSlice.name]: fetchPublicationSlice.reducer,
    [updatePublicationSlice.name]: updatePublicationSlice.reducer,
    [addArticleSlice.name]: addArticleSlice.reducer,
    [articleRegistrySlice.name]: articleRegistrySlice.reducer,
    [profileSlice.name]: profileSlice.reducer,
    [fetchProfileSlice.name]: fetchProfileSlice.reducer,
    [lockSlice.name]: lockSlice.reducer,
    [verifyLockSlice.name]: verifyLockSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
