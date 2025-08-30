import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface State {
  token: string;
}

const initialState: State = {
  token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiaGVsbG8iLCJpYXQiOjE3NDk1NTA1ODAsImV4cCI6MTc0OTU1NDE4MH0.LGv9ARpYuk1lXE0FXxjx1-tC1lezo-wek95PbUmoBrc",
};

const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    clearToken: (state, action) => {
      state.token = "";
    },
  },
});

export const { clearToken } = slice.actions;
export default slice.reducer;