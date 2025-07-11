import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/types';

// CartItem extends Product to include a count field
interface CartItem extends Product {
  count: number;
}

// Load initial cart state from sessionStorage, if present
const cartFromStorage = sessionStorage.getItem('cart');
const initialState: CartItem[] = cartFromStorage ? JSON.parse(cartFromStorage) : [];

// Helper function to persist cart to sessionStorage
const saveCart = (cart: CartItem[]) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Adds product to cart or increments count if already present
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        existing.count += 1;
      } else {
        state.push({ ...action.payload, count: 1 });
      }
      saveCart(state);
    },
    // Removes product from cart by id
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      const idx = state.findIndex(item => item.id === action.payload);
      if (idx !== -1) {
        state.splice(idx, 1);
        saveCart(state);
      }
    },
    // Updates quantity of a product in the cart
    updateCount: (state, action: PayloadAction<{ id: number | string; count: number }>) => {
      const item = state.find(item => item.id === action.payload.id);
      if (item) {
        item.count = action.payload.count;
        saveCart(state);
      }
    },
    // Clears the entire cart
    clearCart: (state) => {
      state.splice(0, state.length);
      saveCart(state);
    },
  },
});

// Export action creators and reducer
export const { addToCart, removeFromCart, updateCount, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
