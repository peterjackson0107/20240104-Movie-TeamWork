<script>
import { RouterLink, RouterView } from 'vue-router'
import { mapState,mapActions } from 'pinia';
export default{
    data(){
        return{
            login:'',
            loginAccount:"AA123",
        }
    },
    components:{
        RouterLink,
    },
    computed:{
    },
    methods:{

    },
    mounted(){
        // this.login = true
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
            <div v-if="this.login == true" style="width: 250px;">
                <p class="c">登入帳號：{{this.loginAccount }}</p>
            </div>
            <RouterLink :to="`/login`" class="b" v-if="this.login == false">登入</RouterLink>
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
            height: 100%;
            width: 250px;
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