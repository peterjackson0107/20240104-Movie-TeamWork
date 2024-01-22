<script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/css';
  import Cookies from 'js-cookie'
export default {
  data() {
    return {
      //電影相關
      movieInfo: {movieId:891699,
                  movieGenreid:[ "28", "80" ],
                  movieOverview:"平安夜，高德洛克（喬爾金納曼 飾）年幼的兒子因為捲入幫派槍戰而身亡，他自己也受到重傷，經過治療後雖然保住了性命，卻失去了說話的能力，他決定展開一連串嚴格的訓練，誓言要讓害死兒子的幫派份子血債血償……。",
                  movieVoteavg:5.9,
                  movieReleasedate:"2023-11-30",
                  moviePoster:"/r5kvFAqfyDBFZzDY5XTJYxDidsZ.jpg" },
      directors: {},
      casts: {},
      trailerLink: null,
      type: [],
      movieType: [],
      //評論區相關
      mymovie:[
        { title:"0",imgUrl:"/r5kvFAqfyDBFZzDY5XTJYxDidsZ.jpg"},
        { title:"1",imgUrl:"/pHUCVSUCma3LHmb0WUBei1QGUtD.jpg"},
        { title:"2",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"3",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"4",imgUrl:"/r5kvFAqfyDBFZzDY5XTJYxDidsZ.jpg"},
        { title:"5",imgUrl:"/pHUCVSUCma3LHmb0WUBei1QGUtD.jpg"},
        { title:"6",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"7",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"8",imgUrl:"/r5kvFAqfyDBFZzDY5XTJYxDidsZ.jpg"},
        { title:"9",imgUrl:"/pHUCVSUCma3LHmb0WUBei1QGUtD.jpg"},
        { title:"10",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"11",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"12",imgUrl:"/r5kvFAqfyDBFZzDY5XTJYxDidsZ.jpg"},
        { title:"13",imgUrl:"/pHUCVSUCma3LHmb0WUBei1QGUtD.jpg"},
        { title:"14",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
        { title:"15",imgUrl:"/eHBBg8juDeKWj34b5oKru5JkNqt.jpg"},
      ],
      swiperdata:[],
      swiperdata2:[],
      swiperdata3:[],
      swiperdata4:[],
      name: "John123456",
      commentText: "",
      sortOrder: "sort",
      baoleiButton: false, //暴雷按鈕
      blurredArea: true, //模糊區域
      userLoggedIn:false,
      language:["en-US","zh-TW"],
      languageTarget:"",
      target:"",
      objPlayMovies:{},
      movielove:[],
      moviewall:[],
      commentTitle:"",
      account:"",
    };
  },
  computed: {
    scheduleListThree: function () {
    let index = 0;
    let count = 3;
    let arrThree = [];
    let data = this.moviewall;
    for (let i = 0; i < this.moviewall.length; i++) {
      index = parseInt(i / count);
      if (arrThree.length <= index) {
        arrThree.push([]);
    }
    arrThree[index].push(data[i])
    }
    return arrThree
  }
  },
  components: {
      Swiper,
      SwiperSlide,
    },
    setup() {
      const onSwiper = (swiper) => {
        console.log(swiper);
      };
      const onSlideChange = () => {
        console.log('slide change');
      };
      return {
        onSwiper,
        onSlideChange,
      };
    },
  methods: {
    initYouTubePlayer() { //影片嵌入相關
      if (window.YT && window.YT.Player) {
        // 替换为你的 YouTube 视频 ID
        const videoId = this.trailerLink;
        // 创建 YouTube 播放器
        new window.YT.Player(this.$refs.youtubePlayer, {
          height: "630",
          width: "1080",
          videoId: videoId,
          playerVars: { autoplay: 0 }, // 1 表示自动播放
        });
      } else {
        // 如果 'Player' 未定义，你可能需要等待 API 加载完成
        // 或者在其他地方处理 'onYouTubeIframeAPIReady' 事件
        console.error("YouTube API not ready");
      }
    },
    getPerson() { //電影相關 上映中 演員*5 + 導演*1
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      fetch(
        `https://api.themoviedb.org/3/movie/${this.movielove.movieId}/credits?language=en-US`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          const directors = response.crew.filter(
            (person) => person.job === "Director"
          );
          const cast = response.cast.slice(0, 5);
          console.log(directors);
          console.log(cast);
          this.directors = directors;
          this.casts = cast;
          console.log("全部電影的上映中 導演 objPerson", this.directors);
          console.log("全部電影的上映中 演員 objPerson", this.casts);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async getTrailer() { //預告片
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${this.movielove.movieId}/videos?language=en-US`,
          options
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const firstTrailerKey = data.results?.[0]?.key;
        this.trailerLink = `${firstTrailerKey}`;
        console.log("firstTrailerKey", this.trailerLink);
      } catch (error) {
        console.error(error);
        return null; // 或者返回其他适当的值，视情况而定
      }
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
          console.log(this.movielove.movieGenreid)
          console.log(this.movielove.movieGenreid.length)
          console.log(this.type.length)
          console.log(this.movielove.movieGenreid[0])
          console.log(this.type[6].id)
          console.log(parseInt(this.movielove.movieGenreid[0])===this.type[6].id ? 1:2)
          for(let i=0;i<this.movielove.movieGenreid.length;i++){
            for(let j=0;j<this.type.length;j++)
            if(parseInt(this.movielove.movieGenreid[i])===this.type[j].id){
              this.movieType.push(this.type[j].name)
            }
          }
          console.log(this.movieType)
        })
        .catch(err => console.error(err));
    },
    splitMovies() {
      const pageSize = 9;
      this.pages = [];
      for (let i = 0; i < this.moviewall.length; i += pageSize) {
        this.pages.push(this.moviewall.slice(i, i + pageSize));
      }
    },
    logincheck(){
        this.userLoggedIn = Cookies.get('userLoggedIn')
        this.account = Cookies.get('account')
        if (userLoggedIn) {
          let a = Cookies.get('account')
          Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
          Cookies.set('account', a, { expires: 7, path: '/' });
        }
      console.log(this.userLoggedIn)
    },
  goback(){
    this.$router.push("/mypageB")
  },
  getposter(){
    this.$router.push("/mypageB")
  },
  gosend(){
    console.log(this.account)
    console.log(this.movielove)
    console.log(this.moviewall)

    const requestBody = {
    account: this.account,
    favorit: JSON.stringify(this.movielove),
    watchList: JSON.stringify(this.moviewall),
    accountMovieList: JSON.stringify(this.moviewall),
    favoritComment: this.commentText,
    };

    fetch('http://localhost:8080/movie/mypage/create', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
      })
      .then(response => response.json())
      .then(data => { // 處理返回的數據
        if(data.code == 200){
          Cookies.set('userLoggedIn', true, { expires: 7, path: '/' });
          Cookies.set('account', this.account, { expires: 7, path: '/' });
          this.$router.push("/mypage")
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
},
  async mounted() {
    this.movielove = JSON.parse(this.$route.query.love);
    this.movielove = this.movielove[0]
    this.moviewall = JSON.parse(this.$route.query.moviewall);
    console.log(this.movielove)
    console.log(this.movielove.movieGenreid)
    console.log(this.moviewall)
    // console.log("Movie Details:", this.movieInfo);
    // this.getPerson();
    // await this.getTrailer();
    // await this.getMovieType();
    setTimeout(() => {
      this.getMovieType();
      this.getPerson();
    }, 500);
    setTimeout(() => {
      this.getTrailer();
    }, 1000);
    setTimeout(() => {
      this.splitMovies();
    }, 500);
        // this.splitMovies();
    this.$nextTick(() => {
          var swiper = new Swiper(this.$refs.mySwiper, {
            slidesPerView: 3,
            slidesPerColumn: 3,
            spaceBetween:10,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
              stopOnLastSlide: false,
            },
            loop: false,
            observer: true,
            observeParents: true,
          });
        })
    this.logincheck()
    },
};
</script>

<template>
  <!-- <div class="loader">
    <div class="loadingio-spinner-rolling-3hvvs6i9c3b">
      <div class="ldio-b9el9z8mymt">
        <h1>請稍後......</h1>
        <div></div>
      </div>
    </div>
  </div> -->

  <div class="body">
    <!-- 電影資料 -->
    <div class="header">
      <button type="button" @click="goback">回去後台</button>
      <div class="movieData">
        <!-- <img :src="'https://image.tmdb.org/t/p/w342' + this.movieInfo.movieBack " alt="" style="width: 100vw; height: 100vh; opacity: 0.2; position: fixed; top: 0; left: 0;"><br> -->
        <div class="movieDataLeft">
          <img :src="'https://image.tmdb.org/t/p/w500' + this.movielove.moviePoster" alt=""/>
        </div>
        <div class="movieDataRight">
          <h1>{{ this.movielove.movieTitle }}</h1>
          <h6>{{ this.movielove.movieOriginaltitle }}</h6>
          <h2 class="textHeader">上映日期：{{ this.movielove.movieReleasedate }}</h2>
          <hr />
          <h2>Movie Info</h2>
          <div class="movieDataRight1">
            <div class="movieDataRight22">
              <div class="type">
                <h3 class="textHeader">類型：</h3>
                <span class="textall" style="line-height: 50px;" v-for="(item,index) in this.movieType" :key="index">{{ item }}<span v-if="index < this.movieType.length - 1" class="textall" style="font-size: 1em;">、</span></span><br>
              </div>
              <div class="director">
                <h3 class="textHeader">導演：</h3>
                <span class="textall" style="line-height: 50px;" v-for="(item, index) in this.directors" :key="index">{{ item.original_name }}<span v-if="index < this.directors.length - 1">,</span></span><br>
              </div>
              <div class="casts">
                <h3 class="textHeader" style="width: 90px; height: 50px;">演員：</h3>
                <div style="width: 90%;display: flex;"><p class="textall" style="line-height: 50px;" v-for="(item, index) in this.casts" :key="index">{{ item.original_name }}<span v-if="index < this.casts.length - 1" class="textall" style="font-size: 1em;">、</span></p><br></div>
              </div>
              <div class="voteAvg">
                <h3 class="textHeader">評分：</h3>
                <h2 class="textall" style="line-height: 50px;">{{ this.movielove.movieVoteavg }}</h2>
              </div>
              <div class="movieOverview">
                <h3 class="textHeader" style="width: 90px; height: 50px;">簡介：</h3>
                <p class="textallx" v-if="this.movielove.movieOverview" style="width: 90%;line-height: 50px;">{{ this.movielove.movieOverview }}</p>
                <p class="textall" v-else>此電影無簡介</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <!-- 預告片 -->
    <div class="middle">
      <!-- <h1>預告片</h1> -->
      <!-- <video :src="this.trailerLink" controls></video> -->
      <!-- <iframe :src="this.trailerLink" controls></iframe>-->
      <iframe width="1100" height="630" :src="'https://www.youtube.com/embed/' + trailerLink" frameborder="0" allowfullscreen></iframe>
    </div>
    <hr />
    <!-- 討論區 -->
    <h1 class="textTilte">個人影評</h1>
    <div class="comment">
      <textarea class="text" v-model="this.commentText" name="" id="" cols="30" rows="10" style="resize: none;height: 300px;width: 80%; margin-bottom: 10px;" placeholder="這裡可撰寫你自己對這部電影的想法心得"></textarea>
    </div>
    <!-- <p class="text">我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）
      我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）
      我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）
      我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）
      我的電影清單（可以以電影海報的方式排列，像
      是裝飾自己房間的牆壁一樣，一頁可以放滿九張海報，
      電影清單裡面的資料一樣會影響到＂為你推薦＂功能）
  </p> -->
  <button type="button" @click="gosend()">gosend</button>
    <div class="footer" ref="scheduleSwipers">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(page, index) in pages" :key="index">
          <div class="grid-container">
            <div class="grid-item" v-for="(movie, i) in page" :key="i">
              <img :src="'https://image.tmdb.org/t/p/w500' + movie.moviePoster" alt="">
              <div class="caption">{{ movie.movieTitle }}</div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loader {
  //又報錯
  background: linear-gradient(90deg, #b3fffd 0, #e3e6ff 50%, #fde5f5 100%);
  background-size: 200% 200%;
  background-color: white;
  // opacity: 0.8;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 100000;
  background-position: center;
  background-repeat: no-repeat;
  // background-size: 65vw 70vh;
  top: 0;
  left: 0;
  pointer-events: none;
  animation: bgGrade 10s ease infinite;
}
.ldio-b9el9z8mymt div {
  //轉動齒輪
  position: absolute;
  width: 120px;
  height: 120px;
  border: 20px solid #af3fc8;
  border-top-color: transparent;
  border-radius: 50%;
  opacity: 0.5;
}
.ldio-b9el9z8mymt div {
  animation: ldio-b9el9z8mymt 1s linear infinite;
  top: 100px;
  left: 100px;
}
.loadingio-spinner-rolling-3hvvs6i9c3b {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
}
.ldio-b9el9z8mymt {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}
.ldio-b9el9z8mymt div {
  box-sizing: content-box;
}
@keyframes ldio-b9el9z8mymt {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
span, button, p, label, select {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  font-size: 18px;
}
small, h1, h2, h3, h4, h5, h6 {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
}
h1, h2, h3, h4, h5, h6 {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  line-height: 50px;
}
span, button {
  margin: 10px 10px 10px 0;
}
.col-md-8 {
  width: 50vw;
  margin: 0 auto;
  align-items: start;
  justify-content: start;
  text-align: start;
}
.card {
  margin-bottom: 10px;

  .card-body {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-link {
    padding: 0;
    margin-right: 10px;
    cursor: pointer;
  }

  .btn-primary,
  .btn-outline-primary {
    margin-right: 10px;
  }

  .text-muted {
    margin-left: auto;
  }

  textarea {
    resize: vertical;
  }

  .mt-2 {
    margin-top: 10px;
  }
}
.body {
  width: 100vw;
  height: 260vh;

  .header {
    width: 100vw;
    height: 90vh;
    margin: 0 auto;
    height: 850px;
    // padding-top: 20px;
    .movieData {
      display: flex;
      .movieDataLeft {
        width: 35%;
        height: 90vh;
        text-align: end;
        align-items: end;
        margin-right: 50px;
      }
      .movieDataRight {
        width: 65%;
        height: 90vh;
        text-align: start;
        align-items: start;
        .movieDataRight1{
          width: 100%;
          height: 20vh;
          display: flex;
            .movieDataRight11{
              width: 10%;
              height: 40vh;
              text-align: start;
              align-items: start;
            }
            .movieDataRight22{
              width: 90%;
              height: 40vh;
              text-align: start;
              align-items: start;
              .type{
                display: flex;
                margin-bottom: 10px;
              }
              .director{
                display: flex;
                margin-bottom: 10px;
              }
              .casts{
                display: flex;
                margin-bottom: 10px;
              }
              .voteAvg{
                display: flex;
                margin-bottom: 10px;
              }
              .movieOverview{
                display: flex;
                margin-bottom: 10px;
              }
          }
        }
      }
    }
  }
  .middle {
    width: 100vw;
    height: 90vh;
    // margin: 0 auto;
  }
  .footer{
    width: 95vw;
    height: 60vh;
    margin: 0 auto;
  }
}

.textTilte{
  font-family:'jf-openhuninn-2.0';
  font-size: 4em;
  margin: 0 0 20px 0;
}
.text{
  font-family:'jf-openhuninn-2.0';
  font-size: 2em;
  width: 80%;
  margin: 0 auto 0 auto;
}
.textall{
  font-family:'jf-openhuninn-2.0';
  font-size: 1.5em;
  margin: 0;
}
.textHeader{
  font-family:'jf-openhuninn-2.0';
  font-size: 2em;
  margin: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.grid-item {
  /* Add your custom styles for each grid item here */
}
.comment{
  
}

.textallx{
  font-family:'jf-openhuninn-2.0';
  font-size: 1.5em;
  margin: 0;
  overflow: auto;  /* 或者使用 overflow: scroll; */
  max-height: 250px;  /* 设置最大高度，超出部分会产生滚动条 */
  // white-space: nowrap;  /* 防止文本换行 */
}
</style>
