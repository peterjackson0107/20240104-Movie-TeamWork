<template>
  <div class="top">
    <button type="button" value="1" :class="{ active: selectedTab === '正在熱映' }" @click="selectTab('正在熱映')">
      正在熱映
    </button>
    <span>/</span>
    <button type="button" value="2" :class="{ active: selectedTab === '即將上映' }" @click="selectTab('即將上映')">
      即將上映
    </button>
  </div>

</template>

<script>
export default {
  data() {
    return {
      selectedTab: '正在熱映'
    };
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
    }
  }
};
</script>

<style scoped lang="scss">
.top {
  display: flex;
  margin-top: 5vh;
  margin-left: 5vw;
  font-size: 20pt;

  button {
    border: none;
    background-color: white;

    &.active {
      color: black; // 正在熱映時的顏色
    }

    &:not(.active) {
      color: gray; // 即將上映時的顏色
    }
  }
}
</style>