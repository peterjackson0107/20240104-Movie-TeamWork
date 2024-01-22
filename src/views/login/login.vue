<script>
import { mapState,mapActions } from 'pinia'
import { ref } from 'vue';
import { RouterLink } from "vue-router";
import Cookies from 'js-cookie'
import auth from '../../store/auth';
import Popper from "vue3-popper";
export default {
  data() {
    return{
      cBox:false,
      account:"",
      password:"",
      setacc:"",
      setpas:"",
      accall:[],
      show:0,
      cat:{},
      b:"", //修改彈跳視窗
    }
  },
  computed:{
    ...mapState(auth, ["getAuth","getuser"])
  },
  components: {
    RouterLink,
    Popper,
  },
  methods:{
    ...mapActions(auth,["login","logout"]),
    log(){
      if(this.cBox == true){
        localStorage.setItem("keep","keep")
        localStorage.setItem("setacc",this.account)
        localStorage.setItem("setpas",this.password)
      }
      if(this.account !="" && this.password !=""){
        fetch('http://localhost:8080/movie/user/login', {
            method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              account:this.account,
              password:this.password,
            })
        })
        .then(response => response.json())
        .then(data => {
        // 處理返回的數據
            console.log(data)
            console.log(data.code)
            if(data.code == 200){
              Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
              Cookies.set('account', this.account, { expires: 7, path: '/' });
              this.login(this.account)
              console.log("A")
              this.$router.push("/")
            }
            if(data.rtnCode == "Account not verify"){
              this.b = "帳號沒有驗證，請去註冊驗證"
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
      } else{
        this.b = "請輸入帳號密碼"
      }
    },
    clickC(){
      let e = document.getElementsByName("eye")
      let acc = document.getElementById("acc")
      if(e.class == "fa-solid fa-eye fa-lg eye"){
        e.class="fa-solid fa-eye-slash fa-lg eye"
        acc.type="text"
        this.show = 1
      } else{
        e.class="fa-solid fa-eye fa-lg eye"
        acc.type="password"
        this.show = 0
      }
    },
    register(){
        this.$router.push("/register")
    }
  },
  mounted(){
    if(localStorage.getItem("keep") == "keep"){
      this.account =localStorage.getItem("setacc")
      this.password =localStorage.getItem("setpas")
    localStorage.removeItem("keep")
    localStorage.removeItem("setacc")
    localStorage.removeItem("setpas")
  }
}
};
</script>

<template>
    <div class="cBox">
        <div class="box">
            <p class="textT">這裡是登入</p>
            <p class="textL">帳號</p>
            <div class="form-floating mb-3">
                <input type="text" class="form-control tb" id="floatingInput" placeholder="" v-model="this.account">
                <label class="tbc" for="floatingInput">請在這裡輸入帳號</label>
            </div>
            <p class="textL">密碼</p>
            <div class="form-floating mb-3">
                <input type="password" class="form-control tbp" id="acc" placeholder="" v-model="this.password">
                <i v-if="this.show == 0" class="fa-solid fa-eye fa-lg eye" @click="this.clickC()" name="eye"></i>
                <i v-if="this.show == 1" class="fa-solid fa-eye-slash fa-lg eye" @click="this.clickC()" name="eye"></i>
                <label class="tbc" for="floatingInput">請在這裡輸入密碼</label>
            </div>
            <div class="checkbox">
                <input class="leftC" type="checkbox" name="" id="cBox" v-model="cBox">
                <p class="textC">保留我的登入資訊</p>
            </div>
            <div class="logbox">
                <button type="button" class="button" @click="register">註冊帳號</button>
                <Popper arrow placement="top" class="root" style="margin-top: 0%;" :content="this.b">
                  <button type="button" class="buttonA" @click="log()">登入</button>
                </Popper>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cBox{
  width: 100vw;
  height: 90vh;
  text-align: center;
  display: flex;
  justify-content: center;
  background-image: url(../../picture/Movie.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  .box{
  height: 80%;
  width: 40%;
  // margin-top: 2%;
  align-self: center;
  align-items: center;
  background-color: #525f75;
  border-radius: 15px;
  .textT{
    font-family:'jf-openhuninn-2.0';
    font-size: 2em;
    margin-top: 20px;
    color: white;
  }
  .textL{
    font-family:'jf-openhuninn-2.0';
    font-size: 1.5em;
    text-align: start;
    margin-left: 12%;
    color: white;
  }
  .tb{
    width: 80%;
    margin: 0 auto;
  }
  .tbp{
    width: 80%;
    margin: 0 auto;
    position: relative;
  }
  .eye{
    position: absolute;
    bottom: 50%;
    right: 14%;
    transition: 0.3s;
    &:hover{
      color: rgb(255, 173, 65);
    }
  }
  .tbc{
    font-family:'jf-openhuninn-2.0';
    font-size: 1em;
    margin-left: 10%;
  }
  .checkbox{
    align-items: start;
    display: flex;
    margin-left: 10%;
    .leftC{
    margin-top: 1.5%;
  }
  .textC{
    margin-left: 1.2%;
    color: white;
  }
  }
  .logbox{
    margin: 0 auto;
    display: flex;
    height: 15%;
    width: 80%;
    justify-content: space-between;
    .button{
        width: 9.2vw;
        height: 5.9vh;
        border: none;
        background-color: rgb(176, 182, 213);
        border-radius: 10px;
        font-size: 1.5em;
        font-family:'jf-openhuninn-2.0';
        margin-top: 2.5%;
    }
  }
}
}

.root {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-padding: 32px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    margin: 0;
    .buttonA{
        width: 9.2vw;
        height: 5.9vh;
        border: none;
        background-color: rgb(176, 182, 213);
        border-radius: 10px;
        font-size: 1.5em;
        font-family:'jf-openhuninn-2.0';
    }
  }
</style>