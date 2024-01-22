<template>
    <button type="button" @click="goTest()">test</button>
    <button type="button" @click="goSeat()">Seat</button>
    <button type="button" @click="gobackCreate()">backCreate</button>
    <button type="button" @click="gobackSearch()">backSearch</button>
    <button type="button" @click="gobackAdd()">/backAdd</button>
</template>
  
  
<script>
import { RouterLink, RouterView } from 'vue-router'
export default {
    data() {
        return
    },
    computed: {

    },
    methods: {
        goTest() {
            this.$router.push('/test')
        },
        gobackSearch() {
            this.$router.push('/backSearch')
        },
        gobackCreate() {
            this.$router.push('/backCreate')
        },
        goSeat() {
            this.$router.push('/seat')
        },
        gobackAdd() {
            this.$router.push('/backAdd')
        }
    },
    mounted() {
    }
}


</script>
  
  
<style scoped lang="scss"></style>
  