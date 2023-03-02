import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "../reducers/userReducer";

const bigReducer = combineReducers({
  user: userReducer,
});

// this is creating a persisted version of bigReducer, using the configuration
// object declared above
// const persistedReducer = persistReducer(persistConfig, bigReducer);

export const store = configureStore({
  reducer: bigReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// we also have to create a persisted version of our store
// this is commonly refered as "persistor"
// export const persistor = persistStore(store);
