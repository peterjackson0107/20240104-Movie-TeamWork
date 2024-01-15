<script>
export default {
  data() {
    return {
      objPlayMovies: [],
      objComeMovies: [],
      objPopularMovies: [],
      objtype: [],
      itemsPerSlide: 3, // 每頁顯示的輪播項目數量
      itemTypePerSize: 5,
      typePerRow: 7,
      currentSlide: 0,
    };
  },
  computed: {
    playPerPage() {
      let cutArray = [];
      for (let i = 0; i < this.objPlayMovies.length; i+=this.itemsPerSlide) {
        cutArray.push(this.objPlayMovies.slice(i, i + this.itemsPerSlide));
      }
      return cutArray;
    },
    comePerPage() {
      let cutArray = [];
      for (let i = 0; i < this.objComeMovies.length; i+=this.itemsPerSlide) {
        cutArray.push(this.objComeMovies.slice(i, i + this.itemsPerSlide));
      }
      return cutArray;
    },
    popularPerPage() {
      let cutArray = [];
      for (let i = 0; i < this.objPopularMovies.length; i+=this.itemsPerSlide) {
        cutArray.push(this.objPopularMovies.slice(i, i + this.itemsPerSlide));
      }
      return cutArray;
    },
    typePerPage() {
      const cutArray = [];

      for (let i = 0; i < this.objtype.length; i += this.itemTypePerSize) {
        cutArray.push(this.objtype.slice(i, i + this.itemTypePerSize));
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
        const playMovies = playingMovies.filter((movie) => movie.poster_path).slice(0, count).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
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
      let count = 100; //要抓的電影數
      let popularMovies = [];

      try {
        while (popularMovies.length < count) {
          const api = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=zh-TW&&page=${page}&sort_by=revenue.desc`;
          const response = await fetch(api, options);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results.filter((movie) => {
            // 檢查poster_path是否存在
            if (!movie.poster_path) {
                return false;
            }
            return true;
        });
        // 移除已存在的電影，避免重複
        for (const movie of moviesOnPage) {
            if (!popularMovies.some((existingMovie) => existingMovie.title === movie.title)) {
              popularMovies.push(movie);
            }
          }
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        // 截取前 count 筆資料
        const popularMovie = popularMovies.filter((movie) => movie.poster_path).slice(0, count).sort((a, b) => b.vote_average - a.vote_average);
        this.objPopularMovies = popularMovie;
        console.log('最受歡迎 popularMovies:', this.objPopularMovies);
      } catch (error) {
        console.error(error);
      }
    },
    getPlayPerson(movieId) { //上映中 演員*5 + 導演*1
        const options = {
            method: "GET",
            headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
            },
        };

        // fetch(`https://api.themoviedb.org/3/movie/1029575/credits?language=en-US`, options)
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
            .then((response) => response.json())
            .then((response) => {
            const directors = response.crew.filter(
                (person) => person.job === "Director"
            );
            const cast = response.cast.slice(0, 5);
            console.log(directors);
            console.log(cast);

            let playPeople = [];
            playPeople.push(directors);
            playPeople.push(cast);
            console.log('全部電影的上映中 演員 objPlayPerson', this.playPeople);
            })
            .catch((error) => {
            console.error(error);
            });
    },
    getComePerson(movieId) { //即將上映 演員*5 + 導演*1
        const options = {
            method: "GET",
            headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
            },
        };

        // fetch(`https://api.themoviedb.org/3/movie/1029575/credits?language=en-US`, options)
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
            .then((response) => response.json())
            .then((response) => {
            const directors = response.crew.filter(
                (person) => person.job === "Director"
            );
            const cast = response.cast.slice(0, 5);
            console.log(directors);
            console.log(cast);

            let comePeople = [];
            comePeople.push(directors);
            comePeople.push(cast);
            this.objComePerson.push(comePeople);
            // console.log('最後的人員 comePeople', comePeople);
            console.log('全部電影的即將上映 演員 objComePerson', this.objComePerson);
            })
            .catch((error) => {
            console.error(error);
            });
    },
    getPlayTrailer(movieId) { //上映中 預告片
        const options = {
            method: "GET",
            headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
            },
        };

        // fetch(`https://api.themoviedb.org/3/movie/1029575/videos?language=en-US`, options)
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, options)
            .then((response) => {
              const firstTrailerKey = response.results?.[0]?.key;

            const trailerLink = `https://www.youtube.com/watch?v=${firstTrailerKey}`;

            console.log('PlayTrailerLink', trailerLink);
            })
            .catch((error) => {
            console.error(error);
            });
    },
    getMovieType() { //電影類型
        const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww'
        }
      };
      fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
        .then((response) => response.json())
        .then((response) => {
          this.type = response.genres,
          console.log(this.type)
          this.objtype = this.type
        })
        .catch(err => console.error(err));
    },
    chooseMovie(item) { //點電影飛去新路由
      console.log(item)
      this.$router.push({
        name: 'moviecomment',
        query: { 
          movieGenreid: item.genre_ids,
          movieId: item.id,
          movieOriginaltitle: item.original_title, 
          movieTitle: item.title, 
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
    this.getMovieType();
  },
};
</script>

<template>
  
<h1>上映中電影</h1>
<div class="container mt-5">
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(itemsChunk, index) in playPerPage" :key="index" :class="['carousel-item', index === currentSlide ? 'active' : '']">
          <div class="row">
            <div v-for="(item, innerIndex) in itemsChunk" :key="innerIndex" class="col-md-4">
              <a @click="chooseMovie(item)">
                <div class="card" style="width: 420px;">
                  <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" class="d-block w-100 card-img-top" alt="無電影海報">
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
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev" @click="prevSlide" style="left: -160px; top: 250px;">
        <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-left" style="font-size: 50px;"></i></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" @click="nextSlide" style="right: -150px; top: 250px;">
        <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-right" style="font-size: 50px"></i></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

<h1>近期上映電影</h1>
<div class="container mt-5">
    <div id="carouselExample1" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(itemsChunk, index) in comePerPage" :key="index" :class="['carousel-item', index === currentSlide ? 'active' : '']">
          <div class="row">
            <div v-for="(item, innerIndex) in itemsChunk" :key="innerIndex" class="col-md-4">
              <a @click="chooseMovie(item)">
                <div class="card" style="width: 420px;">
                  <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" class="d-block w-100 card-img-top" alt="無電影海報">
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
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample1" data-bs-slide="prev" @click="prevSlide" style="left: -160px; top: 250px;">
        <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-left" style="font-size: 50px;"></i></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample1" data-bs-slide="next" @click="nextSlide" style="right: -150px; top: 250px;">
        <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-right" style="font-size: 50px"></i></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

<h1>為你推薦</h1>
<div class="container mt-5">
    <div id="carouselExample2" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(itemsChunk, index) in popularPerPage" :key="index" :class="['carousel-item', index === currentSlide ? 'active' : '']">
          <div class="row">
            <div v-for="(item, innerIndex) in itemsChunk" :key="innerIndex" class="col-md-4">
              <a @click="chooseMovie(item)">
                <div class="card" style="width: 420px;">
                  <img :src="'https://image.tmdb.org/t/p/w500' + item.poster_path" class="d-block w-100 card-img-top" alt="無電影海報">
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
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample2" data-bs-slide="prev" @click="prevSlide" style="left: -160px; top: 250px;">
        <span class="carousel-control-prev-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-left" style="font-size: 50px;"></i></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample2" data-bs-slide="next" @click="nextSlide" style="right: -150px; top: 250px;">
        <span class="carousel-control-next-icon" aria-hidden="true"><i class="fa-solid fa-circle-arrow-right" style="font-size: 50px"></i></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

<h1>分類選擇</h1>
<div v-for="(item, index) in typePerPage" :key="index">
      <button type="button" v-for="(item, index1) in item" :key="index1">
        {{ item.name }}
      </button>
    </div>
</template>

<style scoped lang="scss">
span, button, p, label, select {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  font-size: 18px;
}

button{
  width: 200px;
  height: 100px;
  margin: 20px;
}
</style>
