<script>
import Cookies from "js-cookie";
import axios from "axios";
export default {
  data() {
    return {
      // 電影相關
      movieInfo: {},
      directors: {},
      casts: {},
      trailerLink: null,
      type: [], // 所有類型19個
      movieType: [], // 此電影類型
      movieTime: "",
      hours: "",
      minutes: "",
      // 帳號相關
      name: "snsdarea1209", // 帳號
      userLoggedIn: false,
      loginAccount: "",
      // 評論區相關
      sortOrder: "sort",
      baoleiButton: false, // 暴雷按鈕
      blurredArea: true, // 模糊區域
      commentText: "",
      comments: [],
      commentReplies: [], // 子留言資料
      commentIndex: null,
      commentIndexOrder: null,
      replyText: "",
      objPlayingMovie: [],
      selectedTime: "",
    };
  },
  computed: {
    sortComments() { // 篩選留言
      const sorted = this.comments.slice();
      switch (this.sortOrder) {
        case "latest":
          return sorted.sort((a, b) => b.number - a.number);
        case "likes":
          return sorted.sort((a, b) => b.favorite - a.favorite);
        default:
          return sorted.sort((a, b) => a.number - b.number);
      }
    },
  },
  methods: {
    logincheck() { // cookie
      this.userLoggedIn = Cookies.get('userLoggedIn') === 'true'
      if (this.userLoggedIn) {
        this.loginAccount = Cookies.get('account')
        Cookies.set('account', this.loginAccount, { expires: 7, path: '/' });
      }
    },
    // 抓電影
    getPerson() { // 電影相關 上映中 演員*5 + 導演*1
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      fetch(`https://api.themoviedb.org/3/movie/${this.movieInfo.movieId}/credits?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
          const directors = response.crew.filter((person) => person.job === "Director");
          const cast = response.cast.slice(0, 5);
          this.directors = directors;
          this.casts = cast;
          // console.log("導演 objPerson", this.directors);
          // console.log("演員 objPerson", this.casts);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    async getTrailer() { // 預告片
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${this.movieInfo.movieId}/videos?language=en-US`, options);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const firstTrailerKey = data.results?.[0]?.key;
        this.trailerLink = `${firstTrailerKey}`;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    getMovieType() { // 電影類型
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options)
        .then((response) => response.json())
        .then((response) => {
          (this.type = response.genres),
            console.log("此電影類型", this.movieInfo.movieGenreid);
          // console.log(this.movieInfo.movieGenreid.length)
          // console.log(this.type.length)
          // console.log(this.movieInfo.movieGenreid[0])
          // console.log(this.type[6].id)
          // console.log(parseInt(this.movieInfo.movieGenreid[0])===this.type[6].id ? 1:2)
          for (let i = 0; i < this.movieInfo.movieGenreid.length; i++) {
            for (let j = 0; j < this.type.length; j++)
              if (
                parseInt(this.movieInfo.movieGenreid[i]) === this.type[j].id
              ) {
                this.movieType.push(this.type[j].name);
              }
          }
          console.log(this.movieType);
        })
        .catch((err) => console.error(err));
    },
    getMovieTime() { // 電影時間
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };
      fetch(`https://api.themoviedb.org/3/movie/${this.movieInfo.movieId}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
          (this.movieTime = response.runtime),
            // console.log(this.movieTime);
            (this.hours = Math.floor(this.movieTime / 60));
          this.minutes = this.movieTime % 60;
        })
        .catch((err) => console.error(err));
    },
    //評論區相關
    toggleBaolei() { // 暴雷按鈕
      this.baoleiButton = !this.baoleiButton;
    },
    resetBlur() { // 暴雷背景模糊
      this.blurredArea = false;
    },
    commentTimeDif(commentTime) { // 留言時間時間差
      let time = null;
      if (typeof commentTime === "string" && commentTime.includes("T")) {
        time = Date.parse(commentTime);
      } else {
        time = parseInt(commentTime);
      }
      const now = Date.now(); // 毫秒數
      const timeDif = now - time; // 抓過來為2024/01/16 10:52轉毫秒數
      const seconds = Math.floor(timeDif / 1000); // 與現在差幾秒
      if (seconds < 60) {
        // 不到1分鐘
        return `${seconds}秒前`;
      } else if (seconds < 3600) {
        // 不到1小時
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分鐘前`;
      } else if (seconds < 86400) {
        // 不到1天
        const hours = Math.floor(seconds / 3600);
        return `${hours}小時前`;
      } else if (seconds < 86400 * 30) {
        // 不到1個月
        const days = Math.floor(seconds / 86400);
        return `${days}天前`;
      } else if (seconds < 86400 * 30 * 12) {
        // 不到1年
        const months = Math.floor(seconds / (86400 * 30));
        return `${months}個月前`;
      } else {
        return "1年前";
      }
    },
    chooseComment(comment, index) { // 顯示點擊回覆留言的編號123
      // console.log('回覆按鈕被點擊，主要留言的位置：', index);
      this.commentIndex = index;
      comment.replying = true;
    },
    addReply(comment) { // 回覆留言且顯示於畫面
      // console.log(this.replyText);
      if (this.replyText.trim() !== "") {
        this.commentReplies.push({
          account: Cookies.get("account"),
          commentText: this.replyText,
          commentTime: Date.now(),
          commentIndex: this.commentIndex,
        });
        // console.log(this.commentReplies);
        comment.replyText = "";
        comment.replying = false;
        this.replyText = "";
      }
    },
    cancelReply(comment) { // 取消回覆 
      comment.replying = false;
      this.replyText = null;
    },
    likeButton(comment, index, indexOrder) { // 喜歡
      this.commentIndex = index;
      this.commentIndexOrder = indexOrder;
      // 計算 like 的變化值
      const likeChange = comment.isLiked ? -1 : 1;
      // 更新 like 數量
      comment.favorite += likeChange;

      fetch("http://localhost:8080/movie/comment/likeAndDislike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: index,
          commentIndexOrder: indexOrder,
          movieID: this.movieInfo.movieId,
          like: likeChange,
          dislike: 0,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      // 切換 isLiked 狀態
      comment.isLiked = !comment.isLiked;
    },
    dislikeButton(comment, index, indexOrder) { // 不喜歡
      this.commentIndex = index;
      this.commentIndexOrder = indexOrder;
      const dislikeChange = comment.isDisLiked ? -1 : 1;
      comment.dislike += dislikeChange;
      
      fetch("http://localhost:8080/movie/comment/likeAndDislike", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: index,
          commentIndexOrder: indexOrder,
          movieID: this.movieInfo.movieId,
          like: 0,
          dislike: dislikeChange,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
      comment.isDisLiked = !comment.isDisLiked;
    },
    startEditing(comment, index, indexOrder) { // 開始編輯留言
      this.commentIndex = index;
      this.commentIndexOrder = indexOrder;
      comment.editing = true;
      comment.editingText = comment.commentText;
    },
    saveEdit(comment, index, indexOrder) { // 儲存留言
      this.commentIndex = index;
      this.commentIndexOrder = indexOrder;
      comment.commentText = comment.editingText;
      comment.editing = false;
      fetch("http://localhost:8080/movie/comment/update", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: this.commentIndex,
          commentIndexOrder: this.commentIndexOrder,
          movie: this.movieInfo.movieTitle,
          movieID: this.movieInfo.movieId,
          commentText: comment.commentText,
          account: Cookies.get("account"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        });
    },
    filterComments(commentText) { // 偵測敏感字符
    const dirtyWords = ['黃牛'];
    let filteredText = commentText;
    for (const word of dirtyWords) {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    }
    return filteredText;
    },
    // 後端api
    commentCreate() { // 留言
      fetch("http://localhost:8080/movie/comment/create", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieID: this.movieInfo.movieId,
          commentText: this.commentText,
          movie: this.movieInfo.movieTitle,
          account: Cookies.get("account"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
          if (this.commentText.trim() !== "" && data.code === 200) {
            this.comments.push({
              account: Cookies.get("account"),
              commentText: this.commentText,
              favorite: 0,
              dislike: 0,
              commentTime: Date.now(),
              replying: false,
              replyText: "",
              replies: [],
            });
            this.commentText = "";
          }
          this.sortComments;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    commentSearch() { // 抓此電影所有留言
      fetch("http://localhost:8080/movie/comment/search", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieID: this.movieInfo.movieId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
          this.comments = data.commentList;
          for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].commentIndexIndex !== 0) {
              this.commentReplies.push(this.comments[i]);
              this.comments.splice(i, 1);
            }
          }
          // console.log(this.commentReplies);
          // console.log(this.comments);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    commentCreateChild() { // 回覆留言
      fetch("http://localhost:8080/movie/comment/createchild", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: this.commentIndex,
          movie: this.movieInfo.movieTitle,
          movieID: this.movieInfo.movieId,
          commentText: this.replyText,
          account: Cookies.get("account"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    commentDeleteFather(comment, index) { // 刪除父留言
      this.commentIndex = index;
      const index11 = this.comments.indexOf(comment);
      if (index11 !== -1) {
        this.comments.splice(index11, 1);
      }
      fetch("http://localhost:8080/movie/comment/deleteF", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: this.commentIndex,
          movieID: this.movieInfo.movieId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    commentDeleteChild(comment, index, indexOrder) { // 刪除子留言
      this.commentIndex = index;
      this.commentIndexOrder = indexOrder;
      const index11 = this.commentReplies.indexOf(comment);
      if (index11 !== -1) {
        this.commentReplies.splice(index11, 1);
      }
      fetch("http://localhost:8080/movie/comment/deleteC", {
        method: "POST", // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentIndex: this.commentIndex,
          commentIndexOrder: this.commentIndexOrder,
          movieID: this.movieInfo.movieId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // 處理返回的數據
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    cinemaSearch(selectedCinema) {
      const movieId = this.movieInfo.movieId;
      const movieName = selectedCinema;
      axios({
        url: "http://localhost:8080/movie/movieinfo/search",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          movieId: movieId,
          cinema: movieName,
        },
      }).then((res) => {
        console.log(res);
        console.log(res.data.movieInfoList);
        this.objPlayingMovie = res.data.movieInfoList;
      });
    },
    gotoSeat(movie) {
      if (!this.selectedTime) {
        // 如果沒有選擇時間，可以進行相應的處理，例如顯示提示訊息
        alert("請選擇時間");
        return;
      }
      // 在這裡可以進行相應的處理，比如導航到座位選擇頁面
      this.$router.push({
        name: "seat",
        query: {
          movieId: this.movieInfo.movieId,
          movieName: this.movieInfo.movieTitle,
          cinema: movie.cinema, // 假設影院資訊存儲在 movie 物件中
          area: movie.area,
          price: movie.price, // 假設票價資訊存儲在 movie 物件中
          playDate: movie.onDate, // 假設撥放日期資訊存儲在 movie 物件中
          playTime: this.selectedTime, // 已經從下拉選單中選擇的時間
        },
      });
    },
  },
  mounted() {
    this.movieInfo = this.$route.query;
    console.log("Movie Details:", this.movieInfo);
    this.logincheck();
    setTimeout(() => {
      $(".loader").hide();
    }, 300);
    this.getTrailer();
    this.getPerson();
    this.getMovieType();
    this.commentSearch();
    this.getMovieTime();
  },
};
</script>

<template>
  <!-- 讀取資料過場 -->
  <div class="loader">
    <div class="loadingio-spinner-rolling-3hvvs6i9c3b">
      <div class="ldio-b9el9z8mymt">
        <h1>請稍後......</h1>
        <div></div>
      </div>
    </div>
  </div>
  
  <div class="body">
    <!-- 電影資料 -->
    <div class="header">
      <div class="movieData">
        <div class="movieDataLeft">
          <img :src="'https://image.tmdb.org/t/p/w500' + this.movieInfo.moviePoster" alt=""/>
        </div>
        <div class="movieDataRight">
          <h1>{{ this.movieInfo.movieTitle }}</h1>
          <h6>{{ this.movieInfo.movieOriginaltitle }}</h6>
          <h2 class="textHeader">
            上映日期：{{ this.movieInfo.movieReleasedate }}</h2><hr />
          <h2>Movie Info</h2>
          <div class="movieDataRight1">
            <div class="movieDataRight22">
              <div class="type">
                <h3 class="textHeader">類型：</h3>
                <span class="textall" style="line-height: 50px" v-for="(item, index) in this.movieType" :key="index">{{ item }}<span v-if="index < this.movieType.length - 1" class="textall" style="font-size: 1em">、</span></span><br />
              </div>
              <div class="director">
                <h3 class="textHeader">片長：</h3>
                <span class="textallx" style="line-height: 50px">{{ this.hours == 0 && this.minutes == 0 ? "未知" : this.hours + "h" + this.minutes + "m" }}</span><br />
              </div>
              <div class="director">
                <h3 class="textHeader">導演：</h3>
                <span class="textall" style="line-height: 50px" v-for="(item, index) in this.directors" :key="index">{{ item.original_name }}<span v-if="index < this.directors.length - 1">,</span></span><br />
              </div>
              <div class="casts">
                <h3 class="textHeader" style="width: 105px; height: 50px">演員：</h3>
                <div style="width: 90%; display: flex">
                  <p class="textall" style="line-height: 50px" v-for="(item, index) in this.casts" :key="index">{{ item.original_name }}<span v-if="index < this.casts.length - 1" class="textall" style="font-size: 1em">、</span></p><br/>
                </div>
              </div>
              <div class="voteAvg">
                <h3 class="textHeader">評分：</h3>
                <h2 class="textall" style="line-height: 50px">{{ this.movieInfo.movieVoteavg }}</h2>
              </div>
              <div class="movieOverview">
                <h3 class="textHeader" style="width: 105px; height: 50px">簡介：</h3>
                <p class="textallx" v-if="this.movieInfo.movieOverview" style="width: 90%; line-height: 50px">{{ this.movieInfo.movieOverview }}</p>
                <p class="textall" v-else>此電影無簡介</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />

    <!-- 預告片 -->
    <div class="middleInfo">
      <div class="middle">
        <div class="mid">電影預告</div>
      </div>
      <div class="trailer">
        <!-- <iframe width="80%" height="500" :src="'https://www.youtube.com/embed/' + trailerLink" frameborder="0" allowfullscreen></iframe> -->
      </div>
      <div class="down">
        <div class="turn">線上訂票</div>
      </div>
    </div>

    <!-- 選擇影城 -->
    <div class="middle1" v-if="this.userLoggedIn">
      <div class="selectTheater">選取影城</div>
      <div class="selectButton">
        <button type="button" @click="cinemaSearch('紹仁戲院')">紹仁戲院</button>
        <button type="button" @click="cinemaSearch('裕峰影城')">裕峰影城</button>
        <button type="button" @click="cinemaSearch('梓宏影院')">梓宏影院</button>
        <button type="button" @click="cinemaSearch('暐衡劇院')">暐衡劇院</button>
      </div>
      <div class="selectDate" v-for="(movie, index) in objPlayingMovie">
        <h6>{{ movie.onDate }}</h6>
        <h5>{{ movie.area }}</h5>
        <select v-model="this.selectedTime">
          <option value="">選擇時間</option>
          <option v-for="(time, timeIndex) in JSON.parse(movie.onTime)" :key="timeIndex">
            {{ time }}
          </option>
        </select>
        <button type="button" @click="gotoSeat(movie)">選取位置</button>
      </div>
    </div>

    <!-- 討論區 -->
    <h1>討論區</h1>
    <div class="footer">
      <div class="row">
        <div class="col-md-8">
          <!-- 暴雷區的開關 -->
          <div class="mb-3">
            <div class="form-check form-switch">
              <input v-model="baoleiButton" @input="toggleBaolei" class="form-check-input" type="checkbox" id="baoleiSwitch"/>
              <label class="form-label">暴雷按鈕</label>
            </div>
          </div>
          <!-- 留言區 -->
          <div :style="{ filter: blurredArea && !baoleiButton ? 'blur(5px)' : 'none', }">
          <!-- 排序下拉框 -->
          <div class="mb-3">
            <span>{{ this.comments.length + "件留言" }}</span>
            <select v-model="sortOrder" id="sortSelect">
              <option value="sort">排序</option>
              <option value="latest">最新留言</option>
              <option value="likes">最多喜歡</option>
            </select>
          </div>
          <!-- 新增留言 -->
          <div class="mt-4">
            <div class="mb-3" v-if="this.userLoggedIn">
              <label for="commentInput" class="form-label"><span>新增留言</span></label>
              <textarea rows="1" v-model="commentText" class="form-control" name="comment" id="commentInput" required style="border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black;"></textarea>
              <div style="text-align: end">
                <button type="submit" class="btn btn-outline-dark" @click="commentCreate">留言</button>
              </div>
            </div>
          </div>
            <!-- 遍歷並顯示留言 -->
            <div v-for="comment in sortComments" :key="comment.number" class="card mb-2">
              <!-- 留言內容 -->
              <div class="card-body">
                <span>{{ "@" + comment.account }}</span>
                <small class="text-muted">{{ this.commentTimeDif(comment.commentTime) }}</small>
                <!-- 編輯按鈕 -->
                <button v-if="userLoggedIn && !comment.editing && this.loginAccount==comment.account" @click="startEditing(comment)" class="btn btn-link" style="margin-left: 10px; text-decoration: none">編輯</button>
                <!-- 保存按鈕 -->
                <button v-if="comment.editing" type="submit" class="btn btn-link" @click="saveEdit( comment, comment.commentIndex, comment.commentIndexIndex ) " style="margin-left: 10px; text-decoration: none" required>儲存</button>
                <!-- 刪除按鈕 -->
                <button v-if="userLoggedIn && !comment.editing && this.loginAccount==comment.account" @click="commentDeleteFather(comment, comment.commentIndex)" class="btn btn-link" style="text-decoration: none">刪除</button><br />
                <!-- 留言內容 -->
                <span>{{ filterComments(comment.commentText) }}</span>
                <!-- 編輯模式下顯示編輯框 -->
                <textarea v-if="comment.editing" v-model="comment.editingText" rows="1" class="form-control" name="comment" id="commentInput" required style="border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black;"></textarea><br />
                <!-- 按讚 -->
                <button v-if="userLoggedIn" @click="likeButton( comment, comment.commentIndex, comment.commentIndexIndex )" class="btn btn-outline-primary" style="border: 0">
                  <i class="fa-regular fa-thumbs-up"></i>
                  {{ comment.favorite }}
                </button>
                <button v-if="userLoggedIn" @click="dislikeButton( comment, comment.commentIndex, comment.commentIndexIndex )" class="btn btn-outline-danger" style="border: 0">
                <i class="fa-regular fa-thumbs-down"></i>
                  {{ comment.dislike }}
                </button>

                <!-- 回覆按鈕 -->
                <button v-if="this.userLoggedIn" @click="chooseComment(comment, comment.commentIndex)" class="btn btn-link" style="text-decoration: none; margin-left: 5px">回覆</button>
                <!-- 回覆留言的表單 -->
                <form v-if="comment.replying" @submit.prevent="addReply(comment, comment.replyText)" class="mt-2">
                  <div class="mb-3">
                    <label for="replyInput" class="form-label">回覆留言</label>
                    <textarea rows="1" v-model="replyText" class="form-control" id="replyInput" style="border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black;"></textarea>
                  </div>
                  <button v-if="this.userLoggedIn" type="submit" class="btn btn-outline-dark" @click="commentCreateChild()">回覆</button>
                  <button type="button" class="btn btn-outline-dark" @click="cancelReply(comment)">取消</button>
                </form>

                <!-- 顯示回覆的區域 -->
                <div v-if="commentReplies.length > 0" style="border: 0">
                  <div v-for="item in commentReplies" :key="item.commentIndex" class="card mb-2" style="border: 0">
                    <div class="card-body" v-if="item.commentIndex === comment.commentIndex">
                      <div>
                        <span>{{ "@" + item.account }}</span>
                        <small class="text-muted">{{ this.commentTimeDif(item.commentTime) }}</small>
                        <!-- 編輯按鈕 -->
                        <button v-if="userLoggedIn && !item.editing && this.loginAccount==item.account" @click="startEditing(item)" class="btn btn-link" style="margin-left: 10px; text-decoration: none">編輯</button>
                        <!-- 保存按鈕 -->
                        <button v-if="item.editing" @click="saveEdit( item, item.commentIndex, item.commentIndexIndex )" class="btn btn-link" style="margin-left: 10px; text-decoration: none">儲存</button>
                        <!-- 刪除按鈕 -->
                        <button v-if="userLoggedIn && !item.editing && this.loginAccount==item.account" @click="commentDeleteChild( item, item.commentIndex, item.commentIndexIndex )" class="btn btn-link" style="text-decoration: none">刪除</button><br />
                        <!-- 回覆內容 -->
                        <span>{{ filterComments(item.commentText) }}</span><br/>
                        <!-- 編輯模式下顯示編輯框 -->
                        <textarea v-if="item.editing" v-model="item.editingText" rows="1" class="form-control" required style="border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black;"></textarea>
                        <!-- 按讚 -->
                        <button v-if="userLoggedIn" @click="likeButton( item, item.commentIndex, item.commentIndexIndex )" class="btn btn-outline-primary" style="border: 0">
                          <i class="fa-regular fa-thumbs-up"></i>
                          {{ item.favorite }}
                        </button>
                        <button v-if="userLoggedIn" @click="dislikeButton( item, item.commentIndex, item.commentIndexIndex )" class="btn btn-outline-danger" style="border: 0">
                          <i class="fa-regular fa-thumbs-down"></i>
                          {{ item.dislike }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

span,
button,
p,
label,
select {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  font-size: 18px;
}

small,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Montserrat", sans-serif, sans-serif, "M PLUS 1";
  color: #557;
  line-height: 50px;
}

span,
button {
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

  .mt-2 {
    margin-top: 10px;
  }
}

.body {
  width: 100vw;
  height: 200vh;

  .header {
    width: 95vw;
    height: 110vh;
    margin: 0 auto;
    padding-top: 20px;

    .movieData {
      display: flex;

      .movieDataLeft {
        width: 35%;
        height: 110vh;
        text-align: end;
        align-items: end;
        margin-right: 50px;
      }

      .movieDataRight {
        width: 65%;
        height: 110vh;
        text-align: start;
        align-items: start;

        .movieDataRight1 {
          width: 100%;
          height: 20vh;
          display: flex;

          .movieDataRight11 {
            width: 10%;
            height: 40vh;
            text-align: start;
            align-items: start;
          }

          .movieDataRight22 {
            width: 90%;
            height: 40vh;
            text-align: start;
            align-items: start;

            .type {
              display: flex;
              margin-bottom: 10px;
            }

            .director {
              display: flex;
              margin-bottom: 10px;
            }

            .casts {
              display: flex;
              margin-bottom: 10px;
            }

            .voteAvg {
              display: flex;
              margin-bottom: 10px;
            }

            .movieOverview {
              display: flex;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }

  .middleInfo {
    .middle {
      display: flex;
      justify-content: start;
      width: 100vw;
      height: 4em;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 2px solid rgb(230, 230, 230);

      .mid {
        font-weight: 300;
        letter-spacing: 0.5em;
        color: rgb(51, 51, 51);
        height: 100%;
        margin-left: 5vw;
        font-size: 1.5em;
        padding: 0px 2em;
        display: flex;
        align-items: center;
        border-left: 1px solid rgb(230, 230, 230);
        border-right: 1px solid rgb(230, 230, 230);
        background: repeating-linear-gradient(
          -45deg,
          rgba(0, 0, 0, 0.067),
          rgba(0, 0, 0, 0.067) 2px,
          rgba(0, 0, 0, 0) 2px,
          rgba(0, 0, 0, 0) 4px
        );
      }
    }

    .trailer {
      width: 100vw;
      height: 500px;
      background-color: black;
    }

    .down {
      display: flex;
      justify-content: start;
      width: 100vw;
      height: 4em;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid rgb(230, 230, 230);

      .turn {
        font-weight: 300;
        letter-spacing: 0.5em;
        color: rgb(51, 51, 51);
        height: 100%;
        margin-left: 5vw;
        font-size: 1.5em;
        padding: 0px 2em;
        display: flex;
        align-items: center;
        border-left: 1px solid rgb(230, 230, 230);
        border-right: 1px solid rgb(230, 230, 230);
        background: repeating-linear-gradient(
          -45deg,
          rgba(0, 0, 0, 0.067),
          rgba(0, 0, 0, 0.067) 2px,
          rgba(0, 0, 0, 0) 2px,
          rgba(0, 0, 0, 0) 4px
        );
      }
    }
  }

  .middle1 {
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 15px;
    width: 100%;
    // height: 50%;
    margin-left: auto;
    margin-right: auto;
    font-size: 1.8em;
    letter-spacing: 0.2em;
    font-weight: 300;

    .selectTheater {
      margin-bottom: 1em;
    }

    .selectButton {
      width: 100vw;
      border-bottom: 3px solid rgb(238, 238, 238);

      button {
        width: 10vw;
        height: 6vh;
        margin-right: 1em;
        margin-bottom: 0.6em;
        padding: 5px;
      }
    }

    .selectDate {
      width: 100vw;
      display: flex;
      padding: 1em 0px;
      justify-content: space-around;
      align-items: center;
      border-bottom: 3px solid rgb(238, 238, 238);
      font-weight: 300;
    }
  }

  .commentArea {
    width: 95vw;
    height: 30vh;
    margin: 0 auto;
  }
}

.textTilte {
  font-family: "jf-openhuninn-2.0";
  font-size: 4em;
  margin: 0 0 20px 0;
}

.text {
  font-family: "jf-openhuninn-2.0";
  font-size: 2em;
  width: 80%;
  margin: 0 auto 0 auto;
}

.textall {
  font-family: "jf-openhuninn-2.0";
  font-size: 1.5em;
  margin: 0;
}

.textHeader {
  font-family: "jf-openhuninn-2.0";
  font-size: 2em;
  margin: 0;
}

.selectTheater {
  margin-bottom: 1em;
}

.selectButton {
  width: 100vw;
  border-bottom: 3px solid rgb(238, 238, 238);

  button {
    margin-right: 1em;
    margin-bottom: 0.6em;
    padding: 5px;
  }
}
.textallx {
  font-family: "jf-openhuninn-2.0";
  font-size: 1.5em;
  margin: 0;
  overflow: auto;
  max-height: 250px;
}
</style>
