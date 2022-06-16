import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  loggedin: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.loggedin = action.payload.loggedin;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUsername = (state) => state.user.name;

export default userSlice.reducer;
