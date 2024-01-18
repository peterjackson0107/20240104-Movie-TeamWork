<script>
import { mapState,mapActions } from 'pinia';
import auth from '../store/auth';
export default {
  data() {
    return {
      //電影相關
      movieInfo: {},
      directors: {},
      casts: {},
      trailerLink: null,
      type: [],
      movieType: [],
      //評論區相關
      baoleiButton: false, // 暴雷按鈕
      blurredArea: true, // 模糊區域
      name: "snsdarea1209", // 帳號
      commentText: "",
      comments: [],
      commentReplies: [],  // 留言資料
      comment_index: null,
      replyText: "",
      sortOrder: "sort",
    };
  },
  computed: {
    ...mapState(auth,["getAuth","getuser"]),
    sortedComments() {
      //篩選留言
      const sorted = this.comments.slice();
      switch (this.sortOrder) {
        case "latest":
          return sorted.sort((a, b) => b.commentTime - a.commentTime);
        case "likes":
          return sorted.sort((a, b) => b.favorite - a.favorite);
        default:
          return sorted.sort();
      }
    },
  },
  methods: {
    // 預告片
    initYouTubePlayer() { // 影片嵌入相關
      if (window.YT && window.YT.Player) {
        const videoId = this.trailerLink;
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
      fetch(
        `https://api.themoviedb.org/3/movie/${this.movieInfo.movieId}/credits?language=en-US`,
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
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${this.movieInfo.movieId}/videos?language=en-US`,
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
    getMovieType() { // 電影類型 
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
          console.log(this.movieInfo.movieGenreid)
          // console.log(this.movieInfo.movieGenreid.length)
          // console.log(this.type.length)
          // console.log(this.movieInfo.movieGenreid[0])
          // console.log(this.type[6].id)
          // console.log(parseInt(this.movieInfo.movieGenreid[0])===this.type[6].id ? 1:2)
          for(let i=0;i<this.movieInfo.movieGenreid.length;i++){
            for(let j=0;j<this.type.length;j++)
            if(parseInt(this.movieInfo.movieGenreid[i])===this.type[j].id){
              this.movieType.push(this.type[j].name)
            }
          }
          console.log(this.movieType)
        })
        .catch(err => console.error(err));
    },
    //評論區相關
    toggleBaolei() { // 暴雷按鈕
      this.baoleiButton = !this.baoleiButton;
    },
    resetBlur() { //暴雷背景模糊
      this.blurredArea = false;
    },
    commentTimeDif(timestamp) { // 留言時間到現在時間差
      const now = Date.now(); //毫秒數
      const timeDif = now - Date.parse(timestamp); //抓過來為2024/01/16 10:52轉毫秒數
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
      } else if (seconds < 86400 * 30 * 12) {
        const months = Math.floor(seconds / (86400 * 30));
        return `${months}個月前`;
      } else {
        return "1年前";
      }
    },
    chooseComment(comment, index) { // 回傳點擊回覆留言的編號
      console.log('回覆按鈕被點擊，主要留言的位置：', index);
      this.comment_index = index;
      comment.replying = true;
    },
    // 後端api
    commentCreate() { //留言
      fetch('http://localhost:8080/movie/comment/create', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          movieID:this.movieInfo.movieId,
          commentText:this.commentText,
          movie:this.movieInfo.movieTitle,
          account: this.getuser,
        })
      })
      .then(response => response.json())
      .then(data => { // 處理返回的數據
        console.log(data);
        if (this.commentText.trim() !== "" && data.code===200) {
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
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    commentSearch() { //資料庫抓電影所有留言
      fetch('http://localhost:8080/movie/comment/search', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movieID:this.movieInfo.movieId,
            })
          })
          .then(response => response.json())
          .then(data => {
            // 處理返回的數據
            console.log(data);
            this.comments = data.commentList;
            console.log(this.comments);
            for(let i=0;i<this.comments.length;i++){
              if(this.comments[i].commentIndexIndex!=0){
                this.commentReplies.push(this.comments[i])
                this.comments.splice(i, 1)[0];
              }
            }
            console.log(this.comments);
            console.log(this.commentReplies);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
        });
    },
    commentCreateChild() { //回覆留言
      fetch('http://localhost:8080/movie/comment/createchild', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          commentIndex: this.comment_index,
          movie: this.movieInfo.movieTitle,
          movieID: this.movieInfo.movieId,
          commentText: this.replyText,
          account: this.getuser,
        })
      })
      .then(response => response.json())
      .then(data => { // 處理返回的數據
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    },
    // 以下待解決
    addReply(comment) {
      if (this.replyText.trim() !== "") {
        this.commentReplies.push({
          id: this.movieInfo.movieId,
          text: this.replyText,
          timestamp: Date.now(),
        });
        console.log(this.commentReplies);
        comment.replyText = "";
        comment.replying = false;
      }
    },
    deleteReply(reply) {
      // 假設你的回覆數據結構中有 id 屬性
      const replyIndex = this.commentReplies.findIndex(r => r.id === reply.id);
      if (replyIndex !== -1) {
        this.commentReplies.splice(replyIndex, 1);
      }
    },
    deleteComment(comment) { // 刪除留言
      const index = this.comments.indexOf(comment);
      if (index !== -1) {
        this.comments.splice(index, 1);
      }
    },
    likeButton(comment) { // 喜歡按鈕
      comment.likes++;
    },
    dislikeButton(comment) { // 不喜歡按鈕
      comment.dislikes++;
    },
    editComment(comment) { // 編輯按鈕
      this.commentText = comment.text;
      comment.editing = true;
    },
    saveEdit(comment) { // 儲存編輯按鈕
      if (this.commentText.trim() !== "") {
        comment.text = this.commentText;
        comment.editing = false;
        this.commentText = "";
      }
    },
  },
  async mounted() {
    this.movieInfo = this.$route.query;
    console.log("Movie Details:", this.movieInfo.movieId);
    this.getPerson();
    await this.getTrailer();
    await this.initYouTubePlayer();
    await this.getMovieType();
    setTimeout(() => {
      $(".loader").hide();
    }, 500);
    await this.commentSearch();
  },
};
</script>

<template>
  <!-- 讀取資料過場 -->
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
      <div class="movieData">
        <!-- <img :src="'https://image.tmdb.org/t/p/w342' + this.movieInfo.movieBack " alt="" style="width: 100vw; height: 100vh; opacity: 0.2; position: fixed; top: 0; left: 0;"><br> -->
        <div class="movieDataLeft">
          <img :src="'https://image.tmdb.org/t/p/w500' + this.movieInfo.moviePoster" alt=""/>
        </div>
        <div class="movieDataRight">
          <h1>{{ this.movieInfo.movieTitle }}</h1>
          <h6>{{ this.movieInfo.movieOriginaltitle }}</h6>
          <h2 class="textHeader">上映日期：{{ this.movieInfo.movieReleasedate }}</h2>
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
                <h3 class="textHeader" style="width: 105px; height: 50px;">演員：</h3>
                <div style="width: 90%;display: flex;"><p class="textall" style="line-height: 50px;" v-for="(item, index) in this.casts" :key="index">{{ item.original_name }}<span v-if="index < this.casts.length - 1" class="textall" style="font-size: 1em;">、</span></p><br></div>
              </div>
              <div class="voteAvg">
                <h3 class="textHeader">評分：</h3>
                <h2 class="textall" style="line-height: 50px;">{{ this.movieInfo.movieVoteavg }}</h2>
              </div>
              <div class="movieOverview">
                <h3 class="textHeader" style="width: 105px; height: 50px;">簡介：</h3>
                <p class="textall" v-if="this.movieInfo.movieOverview" style="width: 90%;line-height: 50px;">{{ this.movieInfo.movieOverview }}</p>
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
      <h1>預告片</h1>
      <!-- <video :src="this.trailerLink" controls></video> -->
      <!-- <iframe :src="this.trailerLink" controls></iframe>-->
      <div ref="youtubePlayer"></div>
    </div>
    <hr />
    <!-- 討論區 -->
    <h1>討論區</h1>
    <div class="footer">
      <div class="row">
        <div class="col-md-8">
          <!-- 暴雷區的開關 -->
          <div class="mb-3">
            <div class="form-check form-switch">
              <input v-model="baoleiButton" @input="toggleBaolei" class="form-check-input" type="checkbox" id="baoleiSwitch"/>
              <!-- <label class="form-check-label" for="baoleiSwitch">{{ baoleiButton ? '關閉' : '開啟' }}</label> -->
              <label class="form-label">暴雷按鈕</label>
            </div>
          </div>
          <!-- 留言區 -->
          <!-- <div :style="{ filter: blurredArea && !baoleiButton ? 'blur(5px)' : 'none', }"> -->
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
            <form class="mt-4" @click.prevent="">
              <div class="mb-3" v-if="this.getAuth">
                <label for="commentInput" class="form-label"><span>新增留言</span></label>
                <textarea rows="1" v-model="commentText" class="form-control" name="comment" id="commentInput" required style="border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black;"></textarea>
                <div style="text-align: end;">
                  <button type="submit" class="btn btn-outline-dark" required @click="commentCreate" v-if="this.getAuth">留言</button>
                </div>
              </div>
            </form>
            <!-- 遍歷並顯示留言 -->
            <div v-for="(comment, index) in sortedComments" :key="comment.number" class="card mb-2">
              <!-- 留言內容 -->
              <div class="card-body">
                <span>{{ "@"+comment.account }}</span>
                <small class="text-muted">{{ this.commentTimeDif(comment.commentTime) }}</small>
                <button @click="editComment(comment)" class="btn btn-link" style="margin-left: 10px; text-decoration: none">編輯</button>
                <!-- v-if="this.getAuth" -->
                <button v-if="comment.editing" @click="saveEdit(comment)" class="btn btn-link" style="text-decoration: none">儲存</button>
                <button @click="deleteComment(comment)" class="btn btn-link" style="text-decoration: none">刪除</button><br />
                <!-- v-if="this.getAuth" -->
                <span>{{ comment.commentText }}</span><br>
                <button @click="likeButton(item)" class="btn btn-outline-primary" style="border: 0">
                  <i class="fa-regular fa-thumbs-up"></i>{{ comment.favorite }}
                </button>
                <button @click="dislikeButton(comment)" class="btn btn-outline-danger" style="border: 0">
                  <i class="fa-regular fa-thumbs-down"></i>{{ comment.dislike }}
                </button>
                <button @click="chooseComment(comment, comment.commentIndex)" class="btn btn-link" style="text-decoration: none; margin-left: 5px">回覆</button>
                <button v-if="comment.editing" @click="saveEdit(comment)" class="btn btn-link" style="text-decoration: none">儲存</button>
                
                <!-- 顯示回覆的區域 -->
                <div v-if="commentReplies.length > 0" class="mt-2">
                  <div v-for="item in commentReplies" :key="item.commentIndexIndex" class="card mb-2">
                    <div class="card-body">
                      <span v-if="commentReplies.commentIndex">{{ "@" + item.account }}</span>
                      <small class="text-muted">{{ this.commentTimeDif(item.commentTime) }}</small>
                      <button @click="editComment(comment)" class="btn btn-link" style="margin-left: 10px; text-decoration: none">編輯</button>
                      <button v-if="comment.editing" @click="saveEdit(comment)" class="btn btn-link" style="text-decoration: none">儲存</button>
                      <button @click="deleteReply(item.commentText)" class="btn btn-link" style="text-decoration: none">刪除</button><br/>
                      <span>{{ item.commentText }}</span><br>
                      <button @click="likeButton(item)" class="btn btn-outline-primary" style="border: 0">
                        <i class="fa-regular fa-thumbs-up"></i>{{ comment.favorite }}
                      </button>
                      <button @click="dislikeButton(comment)" class="btn btn-outline-danger" style="border: 0">
                        <i class="fa-regular fa-thumbs-down"></i>{{ comment.dislike }}
                      </button>
                    </div>
                  </div>
                </div>
                <!-- 回覆留言的表單 -->
                <form v-if="comment.replying" @submit.prevent="addReply(comment, comment.replyText)" class="mt-2">
                  <div class="mb-3">
                    <label for="replyInput" class="form-label">回覆留言</label>
                    <textarea v-model="replyText" class="form-control" id="replyInput" rows="2" required style="resize: none"></textarea>
                  </div>
                  <button type="submit" @click="commentCreateChild()">回覆</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- </div> -->
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
    width: 95vw;
    height: 80vh;
    margin: 0 auto;
  }
  .commentArea {
    width: 95vw;
    height: 30vh;
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
</style>
