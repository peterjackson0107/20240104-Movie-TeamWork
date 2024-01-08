import { defineStore } from "pinia";

export default defineStore("counter",{
//需要輸入兩個參數，1自建資料庫名稱，2資料庫內容

//與.vue中 script 預設匯出概念相同，只是名稱不同data
    state(){
        return{
        location:1,
    }
    },

    getters:{
        locationInfo(state){
            return `現在位置: ${state.location}`
        }
    },

    actions:{
        getLocation(){
            console.log(this.location)
        },
        setLocation(num){
            this.location = num
        },
    }

})