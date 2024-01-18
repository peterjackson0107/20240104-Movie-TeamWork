import { defineStore } from 'pinia';

export default defineStore('auth', {
  state(){
    return{
      isAuthenticated: false,
      user: null,
    }
  },
  getters:{
    getAuth (state){
      return state.isAuthenticated
    },
    getuser (state){
      return state.user
    }
  },
  actions:{
    login(user) {
      // 在这里进行用户身份验证，例如从后端验证用户是否存在
      // 如果验证通过，将用户信息保存到状态中
      this.isAuthenticated = true;
      this.user = user;
    },
    logout() {
      // 退出登录时重置状态
      this.isAuthenticated = false;
      this.user = null;
    },
    // getAuth(){
    //   this.isAuthenticated
    // },
    // getuser(){
    //   this.user
    // }
  },
});