import { createSlice } from '@reduxjs/toolkit';
import { getToken, getUserInfo, setToken, setUserInfo, clearStore } from '@/utils/webStorage';

const initialState = {
  token: getToken() || null,
  userInfo: getUserInfo() || null,
  isLoggedIn: !!getToken()
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, userInfo } = action.payload;
      state.token = token;
      state.userInfo = userInfo;
      state.isLoggedIn = true;
      
      // 同步到本地存储
      setToken(token);
      setUserInfo(userInfo);
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.isLoggedIn = false;
      
      // 清除本地存储
      clearStore();
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      
      // 同步到本地存储
      setUserInfo(state.userInfo);
    }
  }
});

export const { login, logout, updateUserInfo } = userSlice.actions;

export default userSlice.reducer; 