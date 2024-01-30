<script>
import { ref } from 'vue';
import { RouterLink } from "vue-router";
import Cookies from 'js-cookie'
import Popper from "vue3-popper";
export default {
  data() {
    return{
      cBox:false,
      account:"",
      password:"",
      password2:"",
      password3:"",
      password4:"",
      selectbar:1,
      setacc:"",
      setpas:"",
      accall:[],
      show:0,
      show2:0,
      show3:0,
      show4:0,
      cat:{},
      b:"", //修改彈跳視窗
      title:'電影場次',
      accountadminverify:false,
      loginAccount:"",
      accountInfo:{},
      changeName:"",
      changephone:"",
      changeemail:"",
      emailboxA:["@gmail.com","@yahoo.com.tw"],
      emailboxTarget:"",
      buylist:[],
      ticketinfo:{},
        holdname:"",
        holdcardnumber:"",
        holdcarddate:"",
        holdcardpass:"",
    }
  },
  components: {
    RouterLink,
    Popper,
  },
  methods:{
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
    clickC3(){
      let e3 = document.getElementsByName("eye3")
      let acc3 = document.getElementById("acc3")
      if(e3.class == "fa-solid fa-eye fa-lg eye"){
        e3.class="fa-solid fa-eye-slash fa-lg eye"
        acc3.type="text"
        this.show3 = 1
      } else{
        e3.class="fa-solid fa-eye fa-lg eye"
        acc3.type="password"
        this.show3 = 0
      }
    },
    clickC4(){
      let e4 = document.getElementsByName("eye4")
      let acc4 = document.getElementById("acc4")
      if(e4.class == "fa-solid fa-eye fa-lg eye"){
        e4.class="fa-solid fa-eye-slash fa-lg eye"
        acc4.type="text"
        this.show4 = 1
      } else{
        e4.class="fa-solid fa-eye fa-lg eye"
        acc4.type="password"
        this.show4 = 0
      }
    },
    register(){
        this.$router.push("/register")
    },
    backuserc() { //點電影飛去新路由
            console.log(Cookies.get('account'))
            this.loginAccount = Cookies.get('account')
            
            if(this.loginAccount != ""){
                fetch('http://localhost:8080/movie/user/loginCheck', {
                    method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    account:this.loginAccount,
                    })
                })
                .then(response => response.json())
                .then(data => {
                // 處理返回的數據
                    console.log(data)
                    console.log(data.code)
                    this.accountInfo = data.mypageList
                    console.log(this.accountInfo)
                    if(data.code == 201){
                    Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
                    Cookies.set('account', this.loginAccount, { expires: 7, path: '/' });
                    this.accountadminverify = true
                    }
                    if(data.code == 200){
                    Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
                    Cookies.set('account', this.loginAccount, { expires: 7, path: '/' });
                    console.log("A")
                    this.accountadminverify = false
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            } 
        },
    updateComfirmInfo(){
      fetch('http://localhost:8080/movie/user/update', {
                    method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    account:this.loginAccount,
                    password:this.password,
                    newPassword:this.changeName,
                    phone:this.changephone,
                    email:(this.changeemail + this.emailboxTarget),
                    })
                })
                .then(response => response.json())
                .then(data => {
                // 處理返回的數據
                    console.log(data)
                    console.log(data.code)
                    if(data.code == 200){
                      this.accountInfo.name = this.changeName
                      this.accountInfo.email = (this.changeemail + this.emailboxTarget)
                      this.accountInfo.phone = this.changephone
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    
                });
    },
    updateComfirmpassword(){
      fetch('http://localhost:8080/movie/user/updatepwd', {
                    method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    account:this.loginAccount,
                    password:this.password2,
                    newPassword:this.password3,
                    })
                })
                .then(response => response.json())
                .then(data => {
                // 處理返回的數據
                    console.log(data)
                    console.log(data.code)
                    if(data.code = 200){
                      alert('修改完成')
                    } else(
                      alert('修改失敗')
                    )
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
    },
    gotomyticket(){
      fetch('http://localhost:8080/movie/buyinfo/search', {
                    method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    account:this.loginAccount,
                    })
                })
                .then(response => response.json())
                .then(data => {
                // 處理返回的數據
                    console.log(data)
                    console.log(data.code)
                    if(data.code = 200){
                    this.buylist = data.buyInfoList
                    this.selectbar = 2
                  }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
    },
    gotomypageB(){
      this.$router.push("/mypageB")
    },
    gotomyInfo(){
      this.selectbar = 1
    },
    gotobackcreate(){
      this.$router.push("/backSearch")
    },
    paycheck(index){
      console.log(index)
      fetch('http://localhost:8080/movie/buyinfo/paycheck', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          number:index,
        })
      })
      .then(response => response.json())
      .then(data => {
      // 處理返回的數據
      console.log(data)
      console.log(data.code)
      if(data.code = 200){
        Swal.fire('已繳費完成')
      } else{
        Swal.fire('已繳費過')
      }
      })
      .catch(error => {
      console.error('Error fetching data:', error);
      });
    },
  },
  mounted(){
    this.ticketinfo = this.$route.query
    
    // this.backuserc()
    // this.accountadminverify = this.$route.query.accountadminverify;
    console.log(this.ticketinfo);
}
};
</script>

<template>
    <div class="cBox">
        <div class="box">
            <p class="textT">{{ this.title }}</p>
            <div class="centerbox">
                <div class="rightbox" v-if="selectbar == 1">
                    <p class="textL" style="margin: 3% 0 0 6%;">訂購帳號</p>
                    <p class="textL2">{{ this.ticketinfo.account }}</p>
                    <p class="textL">電影</p>
                    <p class="textL2">{{ this.ticketinfo.movie }}</p>
                    <p class="textL">影院</p>
                    <p class="textL2">{{ this.ticketinfo.cinema + "，" + this.ticketinfo.area }}</p>
                    <p class="textL">時間</p>
                    <p class="textL2">{{ this.ticketinfo.onDate + "，" + this.ticketinfo.time }}</p>
                    <p class="textL">價格</p>
                    <p class="textL2">{{ this.ticketinfo.price }}</p>
                    <p class="textL">座位</p>
                    <p class="textL2">{{ this.ticketinfo.seat }}</p>
                    <div class="logbox">
                        <button type="button" class="button" data-bs-toggle="modal" data-bs-target="#additem">付款</button>
                    </div>
                </div>
            </div>
                    <!-- Modal -->
        <div class="modal fade" id="additem" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title a" id="exampleModalLabel">請輸入付款資訊</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p class="textall">持卡人姓名</p>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.holdname">
                            <label class="tbc" for="floatingInput">請在這裡輸入持卡人姓名</label>
                        </div>
                        <p class="textall">信用卡卡號</p>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.holdcardnumber">
                            <label class="tbc" for="floatingInput">請在這裡輸入卡號</label>
                        </div>
                        <p class="textall">到期日</p>
                        <div class="form-floating mb-3">
                            <input type="date" class="form-control tb" id="floatingInput" placeholder="" v-model="this.holdcarddate">
                            <label class="tbc" for="floatingInput">在這裡輸入到期日</label>
                        </div>
                        <p class="textall">安全碼</p>
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control tb" id="floatingInput" placeholder="" v-model="this.holdcardpass">
                            <label class="tbc" for="floatingInput">在這裡輸入安全碼</label>
                        </div>
                    </div>
                    <div class="modal-footer" style="justify-content: space-around;">
                        <button type="button" class="btn btn-primary a" data-bs-dismiss="modal" style="background-color: green;border: none;" @click="paycheck()" :disabled="!this.holdname || !this.holdcardnumber || !this.holdcarddate || !this.holdcardpass">付款</button>
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
  height: 140vh;
  text-align: center;
  display: flex;
  justify-content: center;
  background-image: url(../../picture/Movie.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  .box{
  height: 80%;
  width: 40%;
  // margin-top: 10%;
  align-self: center;
  align-items: center;
  background-color: #525f75;
  border-radius: 15px;
  .centerbox{
    display: flex;
    height: 800px;
    .leftbox{
    width: 22%;
    height: 15%;
    margin-right: 1%;
    .transcolor{
            margin-top: 10px;
            margin-left: 5px;
            font-family: "jf-openhuninn-2.0";
            height: 70%;
            // width: 450px;
            line-height: 1.4em;
            font-size: 2em;
            text-decoration: none;
            white-space:nowrap;
            transition: 0.4s;
            color: whitesmoke;
            border-radius: 5px;
            &:hover{
                background-color: gainsboro;
                color:darkslategray;
                // transform:scale(1.1,1.1);
            }
        }
  }
  .rightbox{
    width: 100%;
    // background-color: rgb(202, 207, 230);
    // margin: 1% 1% 0 0;
    border-radius: 10PX;
  }
  }
  .textT{
    font-family:'jf-openhuninn-2.0';
    font-size: 2em;
    margin-top: 20px;
    color: rgb(255, 255, 255);
  }
  .textL{
    font-family:'jf-openhuninn-2.0';
    font-size: 1.5em;
    text-align: start;
    margin-left: 6%;
    color: rgb(255, 255, 255);
  }
  .textL2{
    font-family:'jf-openhuninn-2.0';
    font-size: 1.5em;
    text-align: start;
    margin-left: 12%;
    color: rgb(255, 255, 255);
  }
  .textL3{
    font-family:'jf-openhuninn-2.0';
    font-size: 1.5em;
    text-align: start;
    // margin-left: 12%;
    color: rgb(0, 0, 0);
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
    margin: 0 auto 2% auto;
    display: flex;
    height: 15%;
    width: 80%;
    justify-content: space-around;
    .button{
        width: 11.2vw;
        height: 5.9vh;
        border: none;
        background-color: rgb(176, 182, 213);
        border-radius: 10px;
        font-size: 1.5em;
        font-family:'jf-openhuninn-2.0';
        margin-top: 2.5%;
        transition: 0.4s;
        &:hover{
          background-color: gainsboro;
          color:darkslategray;
          transform:scale(1.1,1.1);
        }
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
  .emailbox{
  display: flex;
  width: 80%;
  margin: 0 auto;
}
.selectmailbox{
  // height: 200%;
  margin-bottom: 4%;
}
.textallx{
  height: 80%;
  // font-family:'jf-openhuninn-2.0';
  // font-size: 1.5em;
  // margin: 0;
  overflow: auto;  /* 或者使用 overflow: scroll; */
  max-height: 350px;  /* 设置最大高度，超出部分会产生滚动条 */
  // // white-space: nowrap;  /* 防止文本换行 */
}
.textally{
  height: 100%;
  font-family:'jf-openhuninn-2.0';
  font-size: 1.5em;
  margin: 0;
  // overflow: auto;  /* 或者使用 overflow: scroll; */
  // max-height: 250px;  /* 设置最大高度，超出部分会产生滚动条 */
  // white-space: nowrap;  /* 防止文本换行 */
}

</style>