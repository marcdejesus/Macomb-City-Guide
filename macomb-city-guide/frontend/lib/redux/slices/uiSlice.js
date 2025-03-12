import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  theme: 'light',
  searchHistory: [],
  recentlyViewed: [],
  notifications: [],
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addSearchTerm: (state, action) => {
      // Add to search history and limit to 10 items
      const term = action.payload;
      state.searchHistory = [
        term,
        ...state.searchHistory.filter((t) => t !== term)
      ].slice(0, 10);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    addRecentlyViewed: (state, action) => {
      const item = action.payload;
      state.recentlyViewed = [
        item,
        ...state.recentlyViewed.filter(
          (i) => !(i.id === item.id && i.type === item.type)
        )
      ].slice(0, 10);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

// Export actions and reducer
export const {
  setTheme,
  addSearchTerm,
  clearSearchHistory,
  addRecentlyViewed,
  addNotification,
  removeNotification,
  clearNotifications
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSearchHistory = (state) => state.ui.searchHistory;
export const selectRecentlyViewed = (state) => state.ui.recentlyViewed;
export const selectNotifications = (state) => state.ui.notifications;