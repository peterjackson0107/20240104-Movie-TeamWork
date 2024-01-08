<script>
export default {
  data() {
    return {
      objPlayMovie: [],
      objComeMovie: [],
      directors: [],
      cast: [],
      comments: [
        //先放假資料
        { id: 1, text: "good!!!", likes: 100, dislikes: 0, timestamp: Date.now() - 1000 * 60 * 5, replies: [], editing: false, },
        { id: 2, text: "what???", likes: 50, dislikes: 20, timestamp: Date.now() - 1000 * 86400 * 70, replies: [], editing: false, },
        { id: 3, text: "bad...", likes: 0, dislikes: 100, timestamp: Date.now() - 1000 * 86400 * 700, replies: [], editing: false, },
        // ...其他假留言...
      ],
      name: "John123456",
      commentText: "",
      sortOrder: "sort",
      baoleiButton: false, //暴雷按鈕
      blurredArea: true, //模糊區域
    };
  },
  computed: {
    // ...mapState(data, ["objP", "objC", "objPData", "objCData"]),
    sortedComments() {
      //篩選留言
      const sorted = this.comments.slice();
      switch (this.sortOrder) {
        case "latest":
          return sorted.sort((a, b) => b.timestamp - a.timestamp);
        case "likes":
          return sorted.sort((a, b) => b.likes - a.likes);
        default:
          return sorted.sort();
      }
    },
  },
  methods: {
    async getPlayMovie() { //熱映中電影
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      let page = 1;
      let count = 2; //要抓的電影數
      let playingMovies = [];

      try {
        const currentDate = new Date();
        const oneMonth = new Date();
        oneMonth.setMonth(currentDate.getMonth() - 2);

        while (playingMovies.length < count) {
          const api = `https://api.themoviedb.org/3/movie/now_playing?language=zh-TW&page=${page}`;
          const response = await fetch(api, options);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results.filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate >= oneMonth && releaseDate <= currentDate;
          });
          playingMovies = playingMovies.concat(moviesOnPage);
          if (page < data.total_pages) {
            page++;
          } else {
            break;
          }
        }
        const playMovies = playingMovies.slice(0, count);
        this.objPlayMovie = playMovies;
        console.log(this.objPlayMovie);
      } catch (error) {
        console.error(error);
      }
    },
    async getComeMovie() { //即將上映電影
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      let page = 1;
      let count = 2; //要抓的電影數
      let comingMovies = [];

      try {
        const currentDate = new Date();
        const oneMonth = new Date();
        oneMonth.setMonth(currentDate.getMonth() + 1);

        while (comingMovies.length < count) {
          const api = `https://api.themoviedb.org/3/movie/upcoming?language=zh-TW&page=${page}`;
          const response = await fetch(api, options);

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          const moviesOnPage = data.results.filter((movie) => {
            const releaseDate = new Date(movie.release_date);
            return releaseDate >= currentDate && releaseDate <= oneMonth;
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
        this.objComeMovie = comeMovies;
        console.log(this.objComeMovie);
      } catch (error) {
        console.error(error);
      }
    },
    getPerson() { //演員*5 + 導演*1
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZTBiNGVhYWYyMjVhZTdmYzFhNjdjYzk0ODk5Mjk5OSIsInN1YiI6IjY1N2ZjYzAzMGU2NGFmMDgxZWE4Mjc3YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3d6GcXTBf2kwGx9GzG7O4_8eCoHAjGxXNr9vV1lVXww",
        },
      };

      fetch(`https://api.themoviedb.org/3/movie/1029575/credits?language=en-US`, options)
      // fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
        .then((response) => response.json())
        .then((creditsData) => {
          const directors = creditsData.crew.filter(
            (person) => person.job === "Director"
          );
          const cast = creditsData.cast.slice(0, 5);
          console.log(directors);
          console.log(cast);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getTrailer(movieId) { //預告片
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
        .then((videosData) => {
          const firstTrailerKey = videosData.results.find(
            (video) => video.type === "Trailer"
          )?.key;

          const trailerLink = `https://www.youtube.com/watch?v=${firstTrailerKey}`;

          console.log(trailerLink);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    toggleBaolei() { //暴雷按鈕
      this.baoleiButton = !this.baoleiButton;
    },
    addComment() { //新增留言
      if (this.commentText.trim() !== "") {
        this.comments.push({
          id: this.comments.length + 1,
          text: this.commentText,
          likes: 0,
          dislikes: 0,
          timestamp: Date.now(),
          replying: false,
          replyText: "",
          replies: [],
        });
        this.commentText = "";
      }
    },
    commentTimeDif(timestamp) { //留言時間到現在時間差
      const now = Date.now();
      const timeDif = now - timestamp; 
      const seconds = Math.floor(timeDif / 1000);

      if (seconds < 60) {
        return `${seconds}秒前`;
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分鐘前`;
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}小時前`;
      } else if (seconds < 86400 * 30) {
        const days = Math.floor(seconds / 86400);
        return `${days}天前`;
      }  else if (seconds < 86400 * 30 * 12) {
        const months = Math.floor(seconds / (86400 * 30));
        return `${months}個月前`;
      } else {
        return "1年前";
      }
    },
    deleteComment(comment) { //刪除留言
      const index = this.comments.indexOf(comment);
      if (index !== -1) {
        this.comments.splice(index, 1);
      }
    },
    likeButton(comment) { //喜歡按鈕
      comment.likes++;
    },
    dislikeButton(comment) { //不喜歡按鈕
      comment.dislikes++;
    },
    commentTime(timestamp) { //回覆時間
      const date = new Date(timestamp);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return new Intl.DateTimeFormat("TW", options).format(date);
    },
    editComment(comment) { //編輯按鈕
      this.commentText = comment.text;
      comment.editing = true;
    },
    saveEdit(comment) { //儲存編輯按鈕
      if (this.commentText.trim() !== "") {
        comment.text = this.commentText;
        comment.editing = false;
        this.commentText = "";
      }
    },
    replyComment(comment) { //回覆留言
      comment.replying = true;
    },
    addReply(comment) { //回覆留言
      if (comment.replyText.trim() !== "") {
        comment.replies.push({
          id: comment.replies.length + 1,
          text: comment.replyText,
          timestamp: Date.now(),
        });
        comment.replyText = "";
        comment.replying = false;
      }
    },
    deleteReply(comment, reply) { //刪除回覆
      const index = comment.replies.indexOf(reply);
      if (index !== -1) {
        comment.replies.splice(index, 1);
      }
    },
    resetBlur() { //暴雷背景模糊
      this.blurredArea = false;
    },
    
  },
  mounted() {
    this.getPlayMovie();
    this.getComeMovie();
    setTimeout(() => {
    this.objPlayMovie.forEach((item) => {
      this.getPerson(item.id);
    });
  }, 2000);
  },
};
</script>

<template>
  <button type="button"  @click="getPlayMovie()">按我看正在上映</button>
  <button type="button" @click="getComeMovie()">按我看即將上映</button>
  <button type="button" @click="getPerson()">按我看導演+演員</button>
  <!-- {{ this.objPlayMovie }} -->
  <!-- {{ this.objComeMovie }} -->

  <!-- 電影資料 -->
  <div class="movieData">
    <table border="1" style="width: 50vw; margin: auto; color: #557">
      <thead style="background-color: rgb(194, 190, 190)">
        <th>id</th>
        <th>海報</th>
        <th>原文名稱</th>
        <th>名稱</th>
        <th>簡介</th>
        <th>上映日期</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) of this.objPlayMovie" :key="index">
          <td>{{ item.id }}</td>
          <td>
            <!-- w92/w154/w185/w342/w500/original(原圖大小) -->
            <img :src="'https://image.tmdb.org/t/p/w92' + item.poster_path" alt="Movie Poster"/> 
          </td>
          <td>{{ item.original_title }}</td>
          <td>{{ item.title }}</td>
          <td class="font state" v-if="item.overview === ''">此電影無簡介</td>
          <td class="font state" v-if="item.overview !== ''">{{ item.overview }}</td>
          <td>{{ item.release_date }}</td>
        </tr>
      </tbody>
    </table>

    <div class="personData" style="height: 20vh;">
      <!-- 導演演員資料 -->
      <div class="director">
        <span>{{ this.directors.original_name }}</span>
      </div>
      <div class="cast" v-for="(item, index) of this.cast" :key="index">
        <span>{{ item.original_name }}</span>  
      </div>
    </div>
  </div>

  <!-- 討論區 -->
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <!-- 暴雷區的開關 -->
        <div class="mb-3">
          <div class="form-check form-switch">
            <input v-model="baoleiButton" @input="toggleBaolei" class="form-check-input" type="checkbox" id="baoleiSwitch"/>
            <!-- <label class="form-check-label" for="baoleiSwitch">{{ baoleiButton ? '關閉' : '開啟' }}</label> -->
            <label class="form-label">影評按鈕</label>
          </div>
        </div>
        <!-- 留言區 -->
        <div
          :style="{ filter: blurredArea && !baoleiButton ? 'blur(5px)' : 'none', }">
          <!-- 排序下拉框 -->
          <div class="mb-3">
            <span>{{ this.comments.length + "件留言" }}</span>
            <select v-model="sortOrder" id="sortSelect">
              <option value="sort">排序方式</option>
              <option value="latest">最新</option>
              <option value="likes">喜歡數</option>
            </select>
          </div>

          <!-- 新增留言 -->
          <form @submit.prevent="addComment" class="mt-4">
            <div class="mb-3">
              <label for="commentInput" class="form-label"><span>新增留言</span></label>
              <textarea rows="1" v-model="commentText" class="form-control" id="commentInput" required style=" resize: none; border: 0; background: none; border-bottom: 1px solid black; "></textarea>
            </div>
            <button type="submit" class="btn btn-outline-dark">留言</button>
          </form>
          <!-- 遍歷並顯示留言 -->
          <div v-for="comment in sortedComments" :key="comment.id" class="card mb-2">
            <!-- 留言內容 -->
            <div class="card-body">
              <span>{{ "@" + this.name }}</span>
              <small class="text-muted">{{ commentTimeDif(comment.timestamp) }}</small><br/>
              <span>{{ comment.text }}</span>
              <button @click="editComment(comment)" class="btn btn-link" style="text-decoration: none">
                編輯
              </button>
              <button @click="deleteComment(comment)" class="btn btn-link" style="text-decoration: none">刪除</button><br />
              <button @click="likeButton(comment)" class="btn btn-outline-primary" style="border: 0">
                <i class="fa-regular fa-thumbs-up"></i>{{ comment.likes }}
              </button>
              <button @click="dislikeButton(comment)" class="btn btn-outline-danger" style="border: 0">
                <i class="fa-regular fa-thumbs-down"></i>{{ comment.dislikes }}
              </button>
              <button @click="replyComment(comment)" class="btn btn-link" style="text-decoration: none; margin-left: 5px">回覆</button>
              <button v-if="comment.editing" @click="saveEdit(comment)" class="btn btn-link" style="text-decoration: none">儲存</button>

              <!-- 顯示回覆的區域 -->
              <div v-if="comment.replies.length > 0" class="mt-2">
                <h6>回覆:</h6>
                <!-- 遍歷並顯示回復 -->
                <div v-for="reply in comment.replies" :key="reply.id" class="card mb-2">
                  <!-- 回覆內容 -->
                  <div class="card-body">
                    <span>{{ "@" + this.name }}</span>
                    <small class="text-muted">{{ commentTime(reply.timestamp) }}</small><br />
                    <span>{{ reply.text }}</span>
                    <button @click="deleteReply(comment, reply)" class="btn btn-link" style="text-decoration: none">刪除</button>
                  </div>
                </div>
              </div>
              <!-- 回覆留言的表單 -->
              <form v-if="comment.replying" @submit.prevent="addReply(comment)" class="mt-2">
                <div class="mb-3">
                  <label for="replyInput" class="form-label">回覆留言</label>
                  <textarea v-model="comment.replyText" class="form-control" id="replyInput" rows="2" required style="resize: none"></textarea>
                </div>
                <button type="submit">發送回覆</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
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

  .btn-primary, .btn-outline-primary {
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
</style>
