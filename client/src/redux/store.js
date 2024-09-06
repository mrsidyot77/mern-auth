import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice.js"
import { persistReducer,persistStore} from "redux-persist"

import storage from  "redux-persist/lib/storage"


// Combine all the reducers into a single root reducer
const rootReducer = combineReducers({
    user: userReducer // Your user state is managed by userReducer
});

// Configuration object for redux-persist
const persistConfig = {
    key: "root", // Key for the persisted data in storage
    version: 1, // Version of the persisted state (optional)
    storage // Specify storage type (e.g., localStorage)
};

// Create a persisted reducer using the root reducer and the persist configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer
export const Store = configureStore({
    reducer: persistedReducer, // Use the persisted reducer
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false // Disable serializable checks (required for redux-persist)
    }),
});

// Create a persistor which is used to persist the store
export const persistor = persistStore(store);