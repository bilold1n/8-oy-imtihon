import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  users: User | null;
  outhchange: boolean;
}

const initialState: UserState = {
  users: JSON.parse(localStorage.getItem("user") || "null"),
  outhchange: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.users = action.payload;
    },
  },
});

export const { login } = userSlice.actions;
export default userSlice.reducer;
