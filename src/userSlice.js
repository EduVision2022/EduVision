import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  loggedin: false,
  picture: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.loggedin = action.payload.loggedin;
      state.picture = action.payload.picture;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUsername = (state) => state.user.name;
export const selectPicture = (state) => state.user.picture;
export const selectEmail = (state) => state.user.email;

export default userSlice.reducer;
