import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit/types';
import type { Product } from '../types/types';

interface CartItem extends Product {
  count: number;
}

const cartFromStorage = sessionStorage.getItem('cart');
const initialState: CartItem[] = cartFromStorage ? JSON.parse(cartFromStorage) : [];

const saveCart = (cart: CartItem[]) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.push({ ...action.payload, count: 1 });
      }
      saveCart(state);
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      const idx = state.findIndex(item => item.id === action.payload);
      if (idx !== -1) {
        state.splice(idx, 1);
        saveCart(state);
      }
    },
    updateCount: (state, action: PayloadAction<{ id: number | string; count: number }>) => {
      const item = state.find(item => item.id === action.payload.id);
      if (item) {
        item.count = action.payload.count;
        saveCart(state);
      }
    },
    clearCart: (state) => {
      state.splice(0, state.length);
      saveCart(state);
    },
  },
});

export const { addToCart, removeFromCart, updateCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
