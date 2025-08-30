import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './slice';

export const store = configureStore({
  reducer: {
    slice: sliceReducer,
  },
});

// Types for use in React components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;