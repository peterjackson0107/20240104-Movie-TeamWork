<template>
  <div class="view">
    <div class="wrapper">
      <button type="button" value="1" :class="{ active: selectedTab === '正在熱映' }" @click="selectTab('正在熱映')">
        正在熱映
      </button>
      <button type="button" value="2" :class="{ active: selectedTab === '即將上映' }" @click="selectTab('即將上映'); upComing()">
        即將上映
      </button>
    </div>
    <div class="underline">
      <div class="bar" v-if="selectedTab === '正在熱映'"></div>
      <div class="bar1" v-if="selectedTab === '即將上映'"></div>
    </div>



    <div v-if="isLoading"><img style="width:500px ; height: 500px;" src="./ticket/picture/GIF.gif" alt=""></div>
    <div v-else>
      <div class="box-wrapper">
        <div class="post-box" v-for="(movie, index) in paginatedMovies" :key="index" v-if="selectedTab === '正在熱映'">
          <div class="post"><img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt=""
              @click="gotointroduce(movie)">
            <div class="title">{{ movie.title }}</div>
            <div class="title1">{{ movie.original_title }}</div>
            <div>評分:{{ movie.vote_average === 0 ? '尚未有評分' : movie.vote_average }}</div>
            <div>上映日:{{ movie.release_date }}</div>
          </div>
        </div>
      </div>

      <div class="box-wrapper">
        <div class="post-box" v-for="(movie, index) in paginatedUpcomingMovies" :key="index"
          v-if="selectedTab === '即將上映'">
          <div class="post"><img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" alt=""
              @click="gotointroduce(movie)">
            <div class="title">{{ movie.title }}</div>
            <div class="title1">{{ movie.original_title }}</div>
            <div>評分:{{ movie.vote_average === 0 ? '尚未有評分' : movie.vote_average }}</div>
            <div>上映日:{{ movie.release_date }}</div>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="selectedTab === '正在熱映'">
        <button @click="changePage('prev')" :disabled="currentPage === 1">上一页</button>
        <button v-for="number in pageNumbers" :key="number" @click="goToPage(number)"
          :class="{ 'active-page': number === currentPage }">{{ number }}</button>
        <button @click="changePage('next')" :disabled="currentPage * itemsPerPage >= objPlayingMovie.length">下一页</button>
      </div>

      <div class="pagination" v-if="selectedTab === '即將上映'">
        <button @click="changeUpcomingPage('prev')" :disabled="upcomingCurrentPage === 1">上一页</button>
        <button v-for="number in upcomingPageNumbers" :key="number" @click="goToUpcomingPage(number)"
        :class="{ 'active-page': number === upcomingCurrentPage }">{{ number }}</button>
        <button @click="changeUpcomingPage('next')"
          :disabled="upcomingCurrentPage * upcomingItemsPerPage >= objUpComing.length">下一页</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedTab: "正在熱映",
      objPlayingMovie: [],
      objUpComing: [],
      //熱映中分頁數量跟所在頁碼
      itemsPerPage: 12,
      currentPage: 1,
      //即將上映中分頁數量跟所在頁碼
      upcomingItemsPerPage: 12,
      upcomingCurrentPage: 1,
      //過場
      isLoading: false,
    };
  },
  methods: {
    //回到最上方
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    //即將上映的頁碼轉跳
    goToUpcomingPage(page) {
      this.upcomingCurrentPage = page;
      this.scrollToTop()
    },
    //正在熱映的頁碼轉跳
    goToPage(page) {
      this.currentPage = page;
      this.scrollToTop()
    },
    //正在熱映的換頁方式
    changePage(action) {
      if (action === 'prev' && this.currentPage > 1) {
        this.currentPage--;
      } else if (action === 'next' && (this.currentPage * this.itemsPerPage) < this.objPlayingMovie.length) {
        this.currentPage++;
      }
      this.scrollToTop()
    },
    //即將上映的換頁方式
    changeUpcomingPage(action) {
      if (action === 'prev' && this.upcomingCurrentPage > 1) {
        this.upcomingCurrentPage--;
      } else if (action === 'next' && (this.upcomingCurrentPage * this.upcomingItemsPerPage) < this.objUpComing.length) {
        this.upcomingCurrentPage++;
      }
      this.scrollToTop()
    },
    //正在熱映跟即將上映的切換方式
    selectTab(tab) {
      this.selectedTab = tab;
      this.currentPage = 1
      this.upcomingCurrentPage = 1
    },
    //轉跳到電影介紹的方法
    gotointroduce(movie) {
      console.log(movie)
      this.$router.push({
        name: 'moviecomment',
        query: {
          movieGenreid: movie.genre_ids,
          movieId: movie.id,
          movieOriginaltitle: movie.original_title,
          movieTitle: movie.title,
          movieOverview: movie.overview,
          moviePoster: movie.poster_path,
          movieBack: movie.backdrop_path,
          movieReleasedate: movie.release_date,
          movieVoteavg: movie.vote_average,
        }
      });
    },
    //上映中抓取
    async nowPlaying() {
      this.isLoading = true;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      let page = 1;
      let count = 200; //要抓的電影數
      let playingMovies = [];

      try {
        const nowDate = new Date();
        const twoMonth = new Date();
        twoMonth.setMonth(nowDate.getMonth() - 2);
        while (playingMovies.length < count) {
          const api = `https://api.themoviedb.org/3/movie/now_playing?language=zh-TW&page=${page}`;
          const response = await fetch(api, options);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results.filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            // 檢查發佈日期是否在指定範圍內
            if (!(releaseDate >= twoMonth && releaseDate <= nowDate)) {
              return false;
            }
            // 檢查poster_path是否存在
            if (!movie.poster_path) {
              return false;
            }
            return true;
          });
          // 移除已存在的電影，避免重複
          for (const movie of moviesOnPage) {
            if (!playingMovies.some((existingMovie) => existingMovie.title === movie.title)) {
              playingMovies.push(movie);
            }
          }
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        // 過濾掉沒有 poster_path 的電影
        const playMovies = playingMovies.filter((movie) => movie.poster_path && movie.overview).slice(0, count).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        this.objPlayingMovie = playMovies
        console.log('上映中 PlayMovies:', this.objPlayingMovie);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false; // 无论加载成功或失败，都将 isLoading 设置为 false
      }
    },//即將上映抓取
    async upComing() {
      this.isLoading = true;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      let page = 1;
      let count = 100; //要抓的電影數
      let comingMovies = [];

      try {
        const nowDate = new Date();
        const oneMonth = new Date();
        oneMonth.setMonth(nowDate.getMonth() + 1);

        while (comingMovies.length < count) {
          const api = `https://api.themoviedb.org/3/movie/upcoming?language=zh-TW&page=${page}`;
          const response = await fetch(api, options);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results.filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            // 檢查發佈日期是否在指定範圍內
            if (!(releaseDate >= nowDate && releaseDate <= oneMonth)) {
              return false;
            }
            // 檢查poster_path是否存在
            if (!movie.poster_path) {
              return false;
            }
            return true;
          });
          // 移除已存在的電影，避免重複
          for (const movie of moviesOnPage) {
            if (!comingMovies.some((existingMovie) => existingMovie.title === movie.title)) {
              comingMovies.push(movie);
            }
          }
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        // 截取前 count 筆資料
        const comeMovies = comingMovies.filter((movie) => movie.poster_path).slice(0, count).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        this.objUpComing = comeMovies;
        console.log('即將上映 ComeMovies:', this.objUpComing);
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false; // 无论加载成功或失败，都将 isLoading 设置为 false
      }
    },
  },
  mounted() {
    this.nowPlaying()
  },
  computed: {
    //把正在熱映的資料數切成index
    paginatedMovies() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.objPlayingMovie.slice(startIndex, endIndex);
    },
    //把即將上映的資料切成index
    paginatedUpcomingMovies() {
      const startIndex = (this.upcomingCurrentPage - 1) * this.upcomingItemsPerPage;
      const endIndex = startIndex + this.upcomingItemsPerPage;
      return this.objUpComing.slice(startIndex, endIndex);
    },
    //正在熱映的總頁數
    totalPages() {
      return Math.ceil(this.objPlayingMovie.length / this.itemsPerPage);
    },
    //正在熱映的頁碼
    pageNumbers() {
      const numbers = [];
      for (let i = 1; i <= this.totalPages; i++) {
        numbers.push(i);
      }
      return numbers;
    },
    //即將上映的總頁數
    upcomingTotalPages() {
      return Math.ceil(this.objUpComing.length / this.upcomingItemsPerPage);
    },
    //即將上映的頁碼
    upcomingPageNumbers() {
      const numbers = [];
      for (let i = 1; i <= this.upcomingTotalPages; i++) {
        numbers.push(i);
      }
      return numbers;
    },
  }
};
</script>

<style scoped lang="scss">
.view {
  width: 100vw;
  // height: 270vh;
  background-color: rgb(63, 63, 63);

  .wrapper {
    display: flex;
    justify-content: center;
    font-size: 24px;
    line-height: 48px;

    button {
      width: 150px;
      margin-top: 40px;
      border: none;
      background-color: rgb(63, 63, 63);

      cursor: pointer;

      &.active {
        color: white; // 正在熱映時的顏色
      }

      &:not(.active) {
        color: rgb(202, 202, 202); // 即將上映時的顏色
      }
    }
  }

  .underline {
    width: 300px;
    text-align: center;
    margin: 3px auto 40px;
    height: 2px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);

    .bar,
    .bar1 {
      width: 50%;
      height: 2px;
      margin-bottom: -2px;
      background-color: rgb(231, 0, 140);
    }

    .bar {
      transform: translate(0%);
    }

    .bar1 {
      transform: translate(100%);
    }
  }

  .box-wrapper {
    width: 80vw;
    display: flex;
    color: white;
    flex-wrap: wrap;
    margin: auto;
    text-align: center;

    .post-box {
      width: 300px;
      height: 80vh;

      .post {
        width: 300px;
        height: 60vh;
        max-height: 60vh;

        img {
          height: 100%;
          width: 90%;
          object-fit: cover; // 保持圖片比例並填滿 img 區域
          cursor: pointer;
        }

        .title {
          font-size: 20pt;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .title1 {
          color: rgb(158, 158, 158);
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

      }
    }
  }
}

.pagination {
  width: 100vw;
  justify-content: center;
  align-items: center;

  button {
    color: rgb(158, 158, 158);
    font-size: 18pt;
    background-color: rgb(63, 63, 63);
    border: 0px;

    &.active-page,
    &:hover {
      color: salmon; // 上一页、下一页的颜色
    }
  }

}
</style>  