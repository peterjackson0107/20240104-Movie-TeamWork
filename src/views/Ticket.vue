<template>
  <div class="top">
    <button type="button" value="1" :class="{ active: selectedTab === '正在熱映' }" @click="selectTab('正在熱映')">
      正在熱映
    </button>
    <span>/</span>
    <button type="button" value="2" :class="{ active: selectedTab === '即將上映' }" @click="selectTab('即將上映'); upComing()">
      即將上映
    </button>
  </div>

  <div class="sortMoive">
    <div class="moviePic">
    </div>
  </div>

  <table v-if="selectedTab === '正在熱映'" style="width: 60vw; margin: 0 auto">
    <thead>
      <tr>
        <th>順序</th>
        <th>編號</th>
        <th>封面</th>
        <th>名稱</th>
        <th>介紹</th>
        <th>上映時間</th>
      </tr>
      <tr v-for="(movie, index) in this.displayedMovies" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ movie.id }}</td>
        <td><img :src="'https://image.tmdb.org/t/p/w154' + movie.poster_path" alt="" @click="gotointroduce(movie)"></td>
        <td>{{ movie.title }}</td>
        <td>{{ truncateOverview(movie.overview) }}</td>
        <td>{{ movie.release_date }}</td>
      </tr>
    </thead>
  </table>

  <table v-if="selectedTab === '即將上映'" style="width: 60vw; margin: 0 auto">
    <thead>
      <tr>
        <th>順序</th>
        <th>編號</th>
        <th>封面</th>
        <th>名稱</th>
        <th>介紹</th>
        <th>上映時間</th>
      </tr>
      <tr v-for="(movie, index) in this.objUpComing" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ movie.id }}</td>
        <td><img :src="'https://image.tmdb.org/t/p/w154' + movie.poster_path" alt="" @click="gotointroduce(movie)"></td>
        <td>{{ movie.title }}</td>
        <td>{{ truncateOverview(movie.overview) }}</td>
        <td>{{ movie.release_date }}</td>
      </tr>
    </thead>
  </table>
  <div class="pagination">
    <button @click="prevPage()" :disabled="currentPage === 1">上一頁</button>
    <button @click="nextPage()" :disabled="currentPage === Math.ceil(objPlayingMovie.length / pageSize)">下一頁</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedTab: "正在熱映",
      objPlayingMovie: [],
      objUpComing: [],
      objTrailer: [],
      currentPage: 1,
      pageSize: 10,
    };
  },
  methods: {
    nextPage() {
      if (this.currentPage < Math.ceil(this.objPlayingMovie.length / this.pageSize)) {
        this.currentPage++;
        window.scrollTo(0, 0, "instant");
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo(0, 0, "instant");
      }
    },
    selectTab(tab) {
      this.selectedTab = tab;
    },
    truncateOverview(overview) {
      const maxLength = 200; // 你想要的最大長度
      if (overview.length > maxLength) {
        return overview.slice(0, maxLength) + '...';
      } else {
        return overview;
      }
    },
    upComing() {
      axios({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/upcoming',
        params: { language: 'zh-tw', page: '1' },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10'
        }
      }).then(res => {
        console.log(res);
        // console.log(res.data.results);
        this.objUpComing = res.data.results
      })
    },
    trailer() {
      axios({
        method: 'GET',
        url: 'https://api.themoviedb.org/3/movie/' + { movie_id } / videos,
        params: { language: 'en-US', page: '1' },
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10'
        }
      }).then(res => {
        console.log(res);
        // console.log(res.data.results);
        // this.objTrailer = res.data.results
      });
    },
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
    async nowPlaying() { //上映中
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
      }
    },
    async upComing() { //即將上映
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
          const comeMovies = comingMovies.filter((movie) => movie.poster_path && movie.overview).slice(0, count).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
          this.objUpComing = comeMovies;
          console.log('即將上映 ComeMovies:', this.objUpComing);
        } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.nowPlaying()
  },
  computed: {
    displayedMovies() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.objPlayingMovie.slice(startIndex, endIndex);
    }
  },
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

.pagination {
  width: 100vw;
  justify-content: center;
  align-items: center;

  button {
    color: salmon;
    background-color: white;
    font-size: 18pt;
  }
}
</style>