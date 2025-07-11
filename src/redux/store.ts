import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Create and export the Redux store, registering cartReducer under the "cart" key
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Type for the entire Redux state tree
export type RootState = ReturnType<typeof store.getState>;

// Type for the Redux dispatch function
export type AppDispatch = typeof store.dispatch;
