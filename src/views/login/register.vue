<script>
import { RouterLink, RouterView } from "vue-router";
import Popper from "vue3-popper";
export default {
  data() {
    return{
      account:"",
      password:"",
      password2:"",
      email:"",
      phone:"",
      name:"",
      acc:[],
      pas:[],
      show:0,
      show2:0,
      aa:"",
      b:"", //修改彈跳視窗
      verify:"",
      emailboxA:["@gmail.com","@yahoo.com.tw"],
      emailboxTarget:""
    }
  },
  components: {
    RouterLink,
    Popper,
  },
  methods:{
    register(){
      if(this.account != "" && this.password == this.password2 && this.account != this.password && this.email .toString().length > 6 && this.phone.toString().length == 10 && this.name !=""){
          fetch('http://localhost:8080/movie/user/search', {
          method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            account:this.account,
          })
      })
      .then(response => response.json())
      .then(data => {
      // 處理返回的數據
          console.log(data)
          console.log(data.code)
          if(data.code = 200){
            fetch('http://localhost:8080/movie/user/create', {
              method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                account:this.account,
                password:this.password,
                name:this.name,
                email:(this.email + this.emailboxTarget),
                phone:this.phone
              })
            })
            .then(response => response.json())
            .then(kk => {
            // 處理返回的數據
              console.log(kk)
              if(kk.code =200){
                this.$router.push("/login")
              }
            })
            .catch(error => {
              console.error('Error fetching data:', error);
            });
          } else if (data.code = 400){
            this.b = "已有相同的帳號存在"
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
      // this.$router.push("/")
      } else if( this.account=="") {
        this.b = "請確認帳號的輸入"
      } else if( this.account!="" && this.password=="") {
        this.b = "請確認密碼的輸入"
      } else if(this.account!="" && this.password != this.password2){
        this.b = "請確認你輸入的密碼是否一致"
      } else if(this.account!="" && this.account == this.password){
        this.b = "請確認你輸入的帳號密碼是否重複了"
      } else if( this.email.toString().length <= 6) {
        this.b = "請確認信箱是否正確輸入"
      } else if( this.phone.toString().length < 10 || this.phone.toString().length > 10) {
        this.b = "請確認手機是否正確輸入"
      } else if( this.name =="") {
        this.b = "請確認名字/暱稱"
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
    clickC2(){
      let e2 = document.getElementsByName("eye2")
      let acc2 = document.getElementById("acc2")
      if(e2.class == "fa-solid fa-eye fa-lg eye"){
        e2.class="fa-solid fa-eye-slash fa-lg eye"
        acc2.type="text"
        this.show2 = 1
      } else{
        e2.class="fa-solid fa-eye fa-lg eye"
        acc2.type="password"
        this.show2 = 0
      }
    },
    back(){
        this.$router.push("/login")
    },
    verifyway(){
      fetch('http://localhost:8080/movie/user/verifyAccount', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          account: this.account,
          verificationCode:this.verify
        })
      })
      .then(response => response.json())
      .then(data => { // 處理返回的數據
        console.log(data);
        this.$router.push("/login")
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  },
  mounted(){
  }
};
</script>

<template>
    <div class="cBox">
        <div class="box">
            <p class="textT">註冊</p>
            <p class="textL">帳號</p>
            <div class="form-floating mb-3">
              <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.account">
              <label class="tbc" for="floatingInput">請在這裡輸入帳號</label>
            </div>
            <p class="textL">密碼</p>
            <div class="form-floating mb-3">
              <input type="password" class="form-control tbp" id="acc" placeholder="" v-model="this.password">
              <i v-if="this.show == 0" class="fa-solid fa-eye fa-lg eye" @click="this.clickC()" name="eye"></i>
              <i v-if="this.show == 1" class="fa-solid fa-eye-slash fa-lg eye" @click="this.clickC()" name="eye"></i>
              <label class="tbc" for="floatingInput">請在這裡輸入密碼</label>
            </div>
            <p class="textL">請再次輸入密碼</p>
            <div class="form-floating mb-3">
              <input type="password" class="form-control tbp" id="acc2" placeholder="" v-model="this.password2">
              <i v-if="this.show2 == 0" class="fa-solid fa-eye fa-lg eye" @click="this.clickC2()" name="eye2"></i>
              <i v-if="this.show2 == 1" class="fa-solid fa-eye-slash fa-lg eye" @click="this.clickC2()" name="eye2"></i>
            <label class="tbc" for="floatingInput">再確認一次密碼</label>
            </div>
            <p class="textL">Email</p>
            <div class="emailbox">
              <div class="form-floating mb-3 tbq">
                <input type="text" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="this.email">
                <label class="tbcq" for="floatingInput">請在這裡輸入Email</label>
              </div>
              <select name="" id="" v-model="this.emailboxTarget" class="selectmailbox">
                <option  v-for="(item, index) in this.emailboxA" :key="index" :value="item">{{ item }}</option>
              </select>
            </div>
            <p class="textL">手機</p>
            <div class="form-floating mb-3">
              <input type="text" class="form-control tb" id="floatingInput" placeholder="09xxxxxxxx" v-model="this.phone" onkeyup="value=value.replace(/[^\d]/g,'') ">
              <label class="tbc" for="floatingInput">請在這裡輸入手機(09xxxxxxxx)</label>
            </div>
            <p class="textL">名字/暱稱</p>
            <div class="form-floating mb-3">
              <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.name">
              <label class="tbc" for="floatingInput">請在這裡輸入名字/暱稱</label>
            </div>
            <div class="logbox" style="margin-top: 30px;" >
              <button type="button" class="buttonR" style="margin-right: 24%;" @click="back">取消</button>
              <button type="button" class="buttonS" data-bs-toggle="modal" data-bs-target="#additem">驗證</button>
              <Popper  arrow placement="top" class="root" :content="this.b">
                <button type="button" class="buttonR" @click="register()">註冊</button>
              </Popper>
            </div>
          <!-- Modal -->
          <div class="modal fade" id="additem" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title a" id="exampleModalLabel">請輸入驗證碼</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <p class="textall">帳號</p>
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.account">
                    <label class="tbc" for="floatingInput">請在這裡輸入帳號</label>
                  </div>
                  <p class="textall">驗整碼</p>
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control tb" id="floatingInput" placeholder="" v-model="this.verify">
                    <label class="tbc" for="floatingInput">在這裡輸入驗整碼</label>
                  </div>
                </div>
                <div class="modal-footer" style="justify-content: space-around;">
                    <button type="button" class="btn btn-primary a" data-bs-dismiss="modal" style="background-color: green;border: none;" @click="verifyway" :disabled="this.verify.length <=7">驗證</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cBox{
  width: 100vw;
  height: 146vh;
  text-align: center;
  display: flex;
  justify-content: center;
  background-image: url(../../picture/Movie.jpg);
  background-repeat: no-repeat;
  background-size: cover;
.box{
  height: 95%;
  width: 40%;
  // margin-top: 2%;
  align-self: center;
  align-items: center;
  background-color: #525f75;
  border-radius: 15px;
  .textT{
    font-family:'jf-openhuninn-2.0';
    font-size: 2em;
    margin-top: 5px;
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
  .tbq{
    width: 80%;
    // margin: 0 auto;
    margin-right: 5%;
  }
  .tbc{
    margin-left: 10%;
  }
  .tbcq{
    margin-left: 0%;
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
  .checkbox{
    align-items: start;
    display: flex;
    .leftC{
    margin-left: 12%;
    margin-top: 1%;
  }
  .textC{
    margin-left: 1%;
  }
  }
  .logbox{
    margin: 0 auto;
    display: flex;
    height: 15%;
    width: 80%;
    // justify-content: space-between;
    .button{
      width: 35%;
      height: 55%;
      border: none;
      background-color: rgb(231, 152, 96);
      border-radius: 10px;
      .bc{
        text-decoration: none;
        color: black;
      }
    }
  }
}
}

.buttonR{
        width: 9.2vw;
        height: 7.9vh;
        border: none;
        background-color: rgb(176, 182, 213);
        border-radius: 10px;
        font-size: 1.5em;
        font-family:'jf-openhuninn-2.0';
}
.buttonS{
        width: 5.2vw;
        height: 4.9vh;
        border: none;
        background-color: rgb(176, 182, 213);
        border-radius: 10px;
        font-size: 1.5em;
        font-family:'jf-openhuninn-2.0';
        margin-top: 4%;
        margin-right: 2%;
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
}

.text{
  font-family:'jf-openhuninn-2.0';
  font-size: 2em;
  width: 80%;
  margin: 0 auto 0 auto;
}
.textall{
  font-family:'jf-openhuninn-2.0';
  font-size: 1.5em;
  margin: 0 0 10px 0;
}
.textHeader{
  font-family:'jf-openhuninn-2.0';
  font-size: 2em;
  margin: 0;
}
.emailbox{
  display: flex;
  width: 80%;
  margin: 0 auto;
}
.selectmailbox{
  // height: 200%;
  margin-bottom: 4%;
}
</style>
