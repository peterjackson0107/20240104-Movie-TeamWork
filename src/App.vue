<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue';
</script>

<template class="body">
  <div class="total">
    <div class="header">
      <Header />
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.total{
  height: 100vh;
  width: 100vw;
  .header {
  height: 8vh;
  overflow-x: hidden;
}
  .content{
  width: 100vw;
  height: 92vh;
  text-align: center;
  overflow-x: hidden;
  }
}

</style>
