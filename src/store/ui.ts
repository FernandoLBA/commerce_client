import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ModalConfig {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
}

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  // Mobile menu
  isMobileMenuOpen: boolean;
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  // Toasts
  toasts: Toast[];
  // Modals
  activeModal: ModalConfig | null;
  // Theme
  theme: 'light' | 'dark' | 'system';
  // Loading overlay
  isGlobalLoading: boolean;
  globalLoadingMessage: string;
}

interface UIActions {
  // Sidebar
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  // Mobile menu
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  // Search
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  // Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Modals
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  // Theme
  setTheme: (theme: UIState['theme']) => void;
  // Loading
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
}

type UIStore = UIState & UIActions;

const initialState: UIState = {
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  toasts: [],
  activeModal: null,
  theme: 'system',
  isGlobalLoading: false,
  globalLoadingMessage: '',
};

let toastCounter = 0;

/**
 * UI store for managing global UI state
 */
export const useUIStore = create<UIStore>()((set) => ({
  ...initialState,

  // Sidebar
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Mobile menu
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  // Toasts
  addToast: (toast) => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // Modals
  openModal: (config) => set({ activeModal: config }),
  closeModal: () => set({ activeModal: null }),

  // Theme
  setTheme: (theme) => set({ theme }),

  // Loading
  showGlobalLoading: (message = '') =>
    set({ isGlobalLoading: true, globalLoadingMessage: message }),
  hideGlobalLoading: () =>
    set({ isGlobalLoading: false, globalLoadingMessage: '' }),
}));

/**
 * Toast helper functions
 */
export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
};
