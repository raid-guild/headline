import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { articleSlice, createArticleSlice } from "services/article/slice";
import {
  publicationSlice,
  createPublicationSlice,
  fetchPublicationSlice,
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
    [addArticleSlice.name]: addArticleSlice.reducer,
    [articleRegistrySlice.name]: articleRegistrySlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
