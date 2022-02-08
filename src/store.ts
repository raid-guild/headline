import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { articleSlice } from "services/article/slice";
import { publicationSlice } from "services/publication/slice";

export const store = configureStore({
  reducer: {
    [publicationSlice.name]: publicationSlice.reducer,
    [articleSlice.name]: articleSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
