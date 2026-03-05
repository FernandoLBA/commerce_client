import type { CartItem } from '@/types';
import { create } from 'zustand';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
}

interface CartActions {
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
}

interface CartComputedState {
  itemCount: number;
  subtotal: number;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
};

/**
 * Cart store for managing local cart state
 * Syncs with server state via React Query
 */
export const useCartStore = create<CartStore>()((set) => ({
  ...initialState,

  setItems: (items) => {
    set({ items });
  },

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );

      if (existingIndex >= 0) {
        const newItems = [...state.items];
        const existingItem = newItems[existingIndex];
        if (existingItem) {
          existingItem.quantity += item.quantity;
        }
        return { items: newItems };
      }

      return { items: [...state.items, item] };
    });
  },

  updateItem: (itemId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  openCart: () => {
    set({ isOpen: true });
  },

  closeCart: () => {
    set({ isOpen: false });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

/**
 * Selector for cart subtotal
 */
export const useCartSubtotal = (): number =>
  useCartStore((state) =>
    state.items.reduce(
      (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
      0
    )
  );

/**
 * Selector for computed cart values
 */
export const useCartComputed = (): CartComputedState => {
  const items = useCartStore((state) => state.items);

  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce(
      (sum, item) => sum + parseFloat(item.product.price.toString()) * item.quantity,
      0
    ),
  };
};
