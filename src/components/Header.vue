<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapState,mapActions } from 'pinia';
import Cookies from 'js-cookie'
import auth from '../store/auth';
export default{
    data(){
        return{
            login:'',
            loginAccount:"AA123",
            userLoggedIn:false,
            account:"",
        }
    },
    computed:{
        ...mapState(auth, ["getAuth","getuser"])
    },
    components:{
        RouterLink,
    },
    methods:{
        ...mapActions(auth,["login","logout"]),
        loga(){
            this.$router.push("/login")
        },
        logincheck(){
            this.userLoggedIn = Cookies.get('userLoggedIn') === 'true'
            if (this.userLoggedIn) {
                this.loginAccount = Cookies.get('account')
                Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
                Cookies.set('account', this.loginAccount, { expires: 7, path: '/' });
            }
            console.log(this.userLoggedIn)
        },
        logout1(){
            Cookies.remove('userLoggedIn');
            Cookies.remove('account');
            this.userLoggedIn =false
            this.loginAccount =""
            this.logout()
            this.$router.push("/login")
        },
        backuserp(){
            this.$router.push("/backuser")
        },
    },
    mounted(){
        this.logincheck();
        this.$watch(() => Cookies.get('userLoggedIn'), (newVal) => {
            this.userLoggedIn = newVal === 'true';
        });
    }
}
</script>

<template>
    <div class="headerShow">
        <div class="box">
            <RouterLink to="/" class="a">首頁</RouterLink>
            <RouterLink to="/moviecomment" class="a" style="display: none;">留言區</RouterLink>
            <RouterLink to="/ticket" class="a">購票</RouterLink>
            <RouterLink :to="`/mypage`" class="a">個人主頁</RouterLink>
            <RouterLink :to="`/create`" class="a">影迷創作</RouterLink>
            <div v-if="this.userLoggedIn || this.getAuth" class="a">
                <p v-if="this.userLoggedIn" @click="backuserp()">登入帳號：{{ this.loginAccount }}</p>
                <p v-if="this.getAuth" @click="backuserp()">登入帳號：{{ this.getuser }}</p>
            </div>
            <div v-if="this.userLoggedIn || this.getAuth" class="a">
                <p @click="logout1">登出</p>
            </div>
            <div v-if="(this.getAuth !== this.userLoggedIn) == false" class="a" style="">
                <p @click="loga">登入</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.headerShow{
    // overflow: scroll;
    // display:flex
    height: 100%;
    width: 100%;
    .box{
        display:flex;
        text-align: center;
        widows: 100%;
        height: 100%;
        background-color: #525f75;
        .a{
            margin-top: 10px;
            font-family: "jf-openhuninn-2.0";
            height: 70%;
            width: 450px;
            line-height: 1em;
            font-size: 2em;
            text-decoration: none;
            white-space:nowrap;
            transition: 0.4s;
            color: whitesmoke;
            border-radius: 5px;
            &:hover{
                background-color: gainsboro;
                color:darkslategray;
                transform:scale(1.1,1.1);
            }
        }
        .b{
            margin-top: 10px;
            font-family: "jf-openhuninn-2.0";
            height: 70%;
            width: 450px;
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
                transform:scale(1.1,1.1);
            }
        }
        .c{
            margin-top: 0px;
            font-family: "jf-openhuninn-2.0";
            line-height: 1.6em;
            font-size: 1.4em;
            text-decoration: none;
            white-space:nowrap;
            transition: 0.4s;
            color: whitesmoke;
            border-radius: 5px;
        }
    }
}

.cass{
    background-color: rgb(125, 125, 255);
    color: white;
    border-radius: 5px;
    transition: 0.6s;
}

</style>