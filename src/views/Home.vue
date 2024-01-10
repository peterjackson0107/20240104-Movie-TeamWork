<script>
export default {
  data() {
    return {
      objPlayMovies: [],
      objComeMovies: [],
      objPopularMovies: [],
      itemsPerSlide: 3, // 每頁顯示的輪播項目數量
      currentSlide: 0,
    };
  },
  computed: {
    playPerPage() {
      let cutArray = [];
      for (let i = 0; i < this.objPlayMovies.length; i++) {
        cutArray.push(this.objPlayMovies.slice(i, i + this.itemsPerSlide));
      }
      return cutArray;
    },
    comePerPage() {
      let cutArray = [];
      for (let i = 0; i < this.objComeMovies.length; i++) {
        cutArray.push(this.objComeMovies.slice(i, i + this.itemsPerSlide));
      }
      return cutArray;
    },
    
},
  methods: {
    async getPlayMovie() { //上映中
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      let page = 1;
      let count = 30; //要抓的電影數
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
            return releaseDate >= twoMonth && releaseDate <= nowDate;
          });
          playingMovies = playingMovies.concat(moviesOnPage);
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        const playMovies = playingMovies.slice(0, count);
        this.objPlayMovies = playMovies;
        console.log('上映中 PlayMovies:', this.objPlayMovies);
      } catch (error) {
        console.error(error);
      }
    },
    async getComeMovie() { //即將上映
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      let page = 1;
      let count = 30; //要抓的電影數
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
            return releaseDate >= nowDate && releaseDate <= oneMonth;
          });
          comingMovies = comingMovies.concat(moviesOnPage);
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        // 截取前 count 筆資料
        const comeMovies = comingMovies.slice(0, count);
        this.objComeMovies = comeMovies;
        console.log('即將上映 ComeMovies:', this.objComeMovies);
      } catch (error) {
        console.error(error);
      }
    },
    async getPopularMovie() { //歷史熱門電影
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww'
        }
      };

      let page = 1;
      let count = 30; //要抓的電影數
      let popularMovies = [];

      try {
        while (popularMovies.length < count) {
          const api = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&page=${page}&sort_by=revenue.desc`;
          const response = await fetch(api, options);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results
          popularMovies = popularMovies.concat(moviesOnPage);
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        // 截取前 count 筆資料
        const popularMovie = popularMovies.slice(0, count);
        this.objPopularMovies = popularMovie;
        console.log('最受歡迎 popularMovies:', this.objPopularMovies);
      } catch (error) {
        console.error(error);
      }
    },
    chooseMovie(item) { //點擊電影抓此電影資訊
      console.log(item)
      this.$router.push({
        name: 'moviecomment', // 新的路由
        query: { 
          movieGenreid: item.genre_ids,
          movieId: item.id,
          movieOriginaltitle: item.original_title, 
          movieTitle: item.original_title, 
          movieOverview: item.overview, 
          moviePoster: item.poster_path, 
          movieBack: item.backdrop_path, 
          movieReleasedate: item.release_date, 
          movieVoteavg: item.vote_average, 
        }
      });
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.itemscutArray.length;
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.itemscutArray.length) % this.itemscutArray.length;
    },
  
  },
  async mounted() {
    await this.getPlayMovie();
    await this.getComeMovie();
    await this.getPopularMovie();
  },
};
</script>

<template>
  
<h1>近期上映電影</h1>
<div class="container mt-5">
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(itemsChunk, index) in playPerPage" :key="index" :class="['carousel-item', index === currentSlide ? 'active' : '']">
          <div class="row">
            <div v-for="(item, innerIndex) in itemsChunk" :key="innerIndex" class="col-md-4">
              <a @click="chooseMovie(item)">
                <div class="card" style="width: 420px;">
                  <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" class="d-block w-100 card-img-top" alt="">
                  <div class="card-body">
                    <p class="card-text">
                      <span>{{ "名稱：" + item.title }}</span><br>
                      <span>{{ "上映日期：" + item.release_date }}</span>
                    </p>
                  </div>
                </div>
              </a>
              <div class="carousel-caption d-none d-md-block">
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" @click="prevSlide" style="left: -150px;">
        <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-left" style="font-size: 50px;"></i></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" @click="nextSlide" style="right: -150px;">
        <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-right" style="font-size: 50px"></i></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

<h1>熱映中電影</h1>
<div class="container mt-5">
    <div id="carouselExample1" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(itemsChunk, index) in comePerPage" :key="index" :class="['carousel-item', index === currentSlide ? 'active' : '']">
          <div class="row">
            <div v-for="(item, innerIndex) in itemsChunk" :key="innerIndex" class="col-md-4">
              <a @click="chooseMovie(item)">
                <div class="card" style="width: 420px;">
                  <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" class="d-block w-100 card-img-top" alt="">
                  <div class="card-body">
                    <p class="card-text">
                      <span>{{ "名稱：" + item.title }}</span><br>
                      <span>{{ "上映日期：" + item.release_date }}</span>
                    </p>
                  </div>
                </div>
              </a>
              <div class="carousel-caption d-none d-md-block">
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample1" data-bs-slide="prev" @click="prevSlide" style="left: -150px;">
        <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-left" style="font-size: 50px;"></i></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample1" data-bs-slide="next" @click="nextSlide" style="right: -150px;">
        <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-right" style="font-size: 50px"></i></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

<h1>為你推薦</h1><br>
<h1>分類選擇</h1>


</template>

<style lang="scss">
span, button, p, label, select {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  font-size: 18px;
}
</style>
