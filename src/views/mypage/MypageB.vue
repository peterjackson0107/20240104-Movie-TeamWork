<script>
import Popper from "vue3-popper";
import { RouterLink, RouterView } from "vue-router";
import Swal from 'sweetalert2'
export default{
    data(){
        return{
        searchText:"",
        searchStart:"",
        searchEnd:"",
        localDate:"",
        currentPage:1,
        itemsPerPage:10,
        packageB:[],
        movietitle:["中文電影標題","英文電影標題","日文電影標題"],
        language:["zh-TW","中文電影標題","en-US","英文電影標題","ja","日文電影標題"],
        languageTarget:"中文電影標題",
        objPlayMovies:{},
        whatever:{},
        showSerch:false,
        show:false,
        //登入
        account:"",
        password:"",
        love:[],
        moviewall:[],
        }
    },
    components: {
      RouterLink,
      Popper,
      Swal,
    },
    computed: {
    //計算總頁數
      totalPages() {
        return Math.ceil(this.objPlayMovies.length / this.itemsPerPage);
      },
    },
    methods:{
      async getMovieName() { //上映中
        this.currentPage = 1
        let index = this.language.indexOf(this.languageTarget)
        let value = this.language[index - 1];  // 因為每個語言對應兩個值，所以取 index - 1 的值
        console.log(value);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10'
        },
      };

      let page = 1;
      let count = 30; //要抓的電影數
      let playingMovies = [];
      try {
        while (playingMovies.length < count) {
          const api = `https://api.themoviedb.org/3/search/movie?query=${this.searchText}&include_adult=false&language=${value}&page=${page}`;
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
        this.showSerch = true
      } catch (error) {
        console.error(error);
      }
    },
    changePage(newPage) {
      this.pageC = ""
      this.currentIndexToDelete = 0
      if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      console.log(this.currentPage)
      } else if(newPage > this.totalPages) {
        this.pageC = "資料沒有那麼多"
      } else if(this.currentPage == 1) {
        this.pageC = "你已經到第一頁了"
      } 
    },
      getLocalDate() {
          const now = new Date();
          // 西元年-月-日格式
          this.localDate = now.toLocaleDateString('en-US'); 
          let dateObject = new Date(this.localDate)
          this.localDate = dateObject.getFullYear() + '-' + (dateObject.getMonth() + 1).toString().padStart(2, '0') + '-' + (dateObject.getDate()).toString().padStart(2, '0');
          console.log(this.localDate)
        },
        clickC(){
      let e = document.getElementsByName("eye")
      let acc = document.getElementById("acc")
      if(e.class == "fa-solid fa-eye fa-lg eye"){
        e.class="fa-solid fa-eye-slash fa-lg eye"
        acc.type="text"
        this.show = 1
      } else{
        e.class="fa-solid fa-eye fa-lg eye"
        acc.type="password"
        this.show = 0
      }
    },
    writeRespond(x){
      localStorage.setItem("quizIndex",JSON.stringify(x))
      this.$router.push("/quizAnswer")
    },
    savetolove(id,Gid,title,overview,poster,Originaltitle,Releasedate,Voteavg){
      this.love = []
      let cc = {
        movieId:id,
        movieGenreid:Gid,
        movieTitle:title,
        movieOverview:overview,
        moviePoster:poster,
        movieOriginaltitle:Originaltitle,
        movieReleasedate:Releasedate,
        movieVoteavg:Voteavg,
      }
      this.love.push(cc)
      console.log(this.love)
      Swal.fire('增加至我的最愛');
    },
    savetomoviewall(id,Gid,title,overview,path,Originaltitle,Releasedate,Voteavg){
        // 檢查 moviewall 陣列中是否已經存在具有相同 movieid 的物件
        console.log(id)
        const existingMovie = this.moviewall.find(movie => movie.movieId === id);
        if (!existingMovie) {
          // 如果不存在，則將 id 加入 moviewall
          let cc = {
            movieId:id,
            movieGenreid:Gid,
            movieTitle:title,
            movieOverview:overview,
            moviePoster:path,
            movieOriginaltitle:Originaltitle,
            movieReleasedate:Releasedate,
            movieVoteavg:Voteavg,
          }
          this.moviewall.push(cc);
          console.log(this.moviewall);
          Swal.fire("已加入電影牆");
        } else {
          console.log('該電影已存在電影牆，不重複加入：' + title);
          Swal.fire('該電影已存在電影牆　'+ title);
        }
    },
    goshow() { //點電影飛去新路由
      this.$router.push({
        name: 'mypageShow',
        query: { 
          love: JSON.stringify(this.love),
          moviewall: JSON.stringify(this.moviewall)
        }
      });
    },
  },
    mounted(){
      this.getLocalDate()
      // this.search()
    },
}
</script>

<template>
    <div class="box">
        <div class="upbox">
            <div class="searchName">
                <p class="a" >搜尋電影名稱</p>
                <div class="form-floating mb-3">
                  <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="this.searchText">
                  <label class="tbc" for="floatingInput">在這裡輸入搜尋的電影名稱</label>
                </div>
            </div>
            <div class="searchDay">
                <p class="a" >其他條件：</p>
                <select name="" id="" v-model="this.languageTarget">
                  <option  v-for="(item, index) in this.movietitle" :key="index" :value="item">{{ item }}</option>
                </select>
                <!-- <p class="b" >到</p>
                <input type="date" class="searchDayD" name="" id="" v-model="searchEnd"> -->
                <button type="button" class="searchB" @click="getMovieName">搜尋</button>
                <!-- <p class="cca">最愛電影 {{ this.love }}</p>
                <p class="cca">電影牆 {{ this.moviewall }}</p> -->
            </div>
            <div class="searchDay">
                <button type="button" class="searchC" @click="goshow" :disabled="!this.love.length || !this.moviewall.length">瀏覽</button>
            </div>
        </div>
        <div class="tablebox">
            <div class="columT">
                <p class="font number">名稱</p>
                <p class="font name">海報</p>
                <p class="font state">描述</p>
                <P class="font result">結果</P>
            </div>
            <div class="columBox">
              <div class="colum" v-if="this.showSerch" v-for="(item, x) in this.objPlayMovies.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage)" :key="x">
                    <p class="font number">{{ item.title }}</p>
                    <div class="name">
                      <img :src="'https://image.tmdb.org/t/p/w200' + item.poster_path" alt="" >
                    </div>
                    <div class="font start">{{ item.overview }}</div>
                    <div class="save">
                      <button type="button" class="font result" @click="savetolove(item.id,item.genre_ids,item.title,item.overview,item.poster_path,item.original_title,item.release_date,item.vote_average)">儲存進最愛</button>
                      <button type="button" class="font result" @click="savetomoviewall(item.id,item.genre_ids,item.title,item.overview,item.poster_path,item.original_title,item.release_date,item.vote_average)">儲存進電影牆</button>
                    </div>
                    <!-- <p class="font result" @click="searchForRespond">查看</p> -->
              </div> 
            </div>
          <nav aria-label="Page navigation" style="margin-top: 20px;">
            <ul class="pagination justify-content-center labeloverw">
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage - 1)"><a class="page-link" href="#">上一頁</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(page)" ><a class="page-link" href="#" disabled="!isInputValid">{{this.currentPage}}</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage+1)"><a class="page-link" href="#">{{this.currentPage+1}}</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage+2)"><a class="page-link" href="#">{{this.currentPage+2}}</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage+3)"><a class="page-link" href="#">{{this.currentPage+3}}</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage+4)"><a class="page-link" href="#">{{this.currentPage+4}}</a></li>
              </Popper>
              <Popper arrow placement="top" class="root" :content="this.pageC">
                <li class="page-item" @click="changePage(this.currentPage + 1)"><a class="page-link" href="#">上一頁</a></li>
              </Popper>
            </ul>
          </nav>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .font{
        margin: 0;
        font-size: 1.2em;
        font-family: "jf-openhuninn-2.0";
    }
    .box{
        height: 100%;
        width: 100%;
        margin: 0 auto ;
        background-color: #ced2da;
        .upbox{
            height: 40%;
            width: 100%;
            background-color: #72809d;
            // padding-top: 10%;
            // background-color: burlywood;
            .searchName{
                padding-top: 20px;

                display: flex;
                justify-content: start;
                .a{
                    margin: 12px 30px 0 60px;
                    font-size: 1.5em;
                    font-family: "jf-openhuninn-2.0";
                }
                .b{
                    margin: 0 30px 0 30px;
                    font-size: 1.2em;
                    font-family: "jf-openhuninn-2.0";
                }
                .searchInput{
                    width: 70%;
                }
                .searchDayD{
                    width: 20%;
                }
                .searchB{
                    width: 80px;
                    margin-left: 40px;
                    font-size: 1.2em;
                    font-family: "jf-openhuninn-2.0";
                    border: none;
                    border-radius: 5px;
                }
            }
            .searchDay{
                display: flex;
                justify-content: start;
                margin: 30px 0 20px 0;
                .a{
                    margin: 0 52px 0 60px;
                    font-size: 1.5em;
                    font-family: "jf-openhuninn-2.0";
                }
                .b{
                    margin: 0 30px 0 30px;
                    font-size: 1.2em;
                    font-family: "jf-openhuninn-2.0";
                }
                .searchDayD{
                    width: 20%;
                }
                .searchB{
                    width: 80px;
                    margin-left: 30px;
                    font-size: 1.2em;
                    font-family: "jf-openhuninn-2.0";
                    border: none;
                    border-radius: 5px;
                }
                .searchC{
                    width: 200px;
                    margin-left: 82.3%;
                    font-size: 1.2em;
                    font-family: "jf-openhuninn-2.0";
                    border: none;
                    border-radius: 5px;
                }
            }
        }
        .tablebox{
          background-color: #ced2da;
            .columT{
            display: flex;
            width: 100%;
            background-color:grey;
            .number{
                width: 10%;
            }
            .name{
                width: 14.3%;
            }
            .state{
                width: 60.7%;
            }
            .result{
                width: 15%;
            }
            }
        }
    }
    .columBox{
  height: 60%;
  width: 100%;
  margin: 0 auto;
  .colum{
    height: 15%;
    width: 100%;
    display: flex;
    // border: 5px solid slategray;
    .number{
      width: 14.2%;
      border: 1px solid slategray;
    }
    .name{
      width: 20%;
      height: 300px;
      text-align: start;
      border: 1px solid slategray;
    }
    .start{
      width: 85%;
      height: 300px;
      border: 1px solid slategray;
      font-family:'jf-openhuninn-2.0';
      font-size: 1.2em;
      overflow:scroll;
      // white-space: pre-wrap;
    }
    .result{
      width: 100%;
      height: 50%;
      border: 1px solid slategray;
    }
  }
}
.root {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 6px;
    --popper-theme-padding: 32px;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
    font-family: "jf-openhuninn-2.0";
    }
    .tb{
    width: 350%;
    height: 80%;
    margin: 0 auto;
  }
    .tbp{
    width: 80%;
    margin: 0 auto;
    position: relative;
  }
  .eye{
    position: absolute;
    bottom: 50%;
    right: 14%;
    transition: 0.3s;
    &:hover{
      color: rgb(255, 173, 65);
    }
  }
  .labeloverw{
    margin: 0 10px 0 10px;
    background-color: #ced2da;
    padding: 15px;
  }
  .cca{
    margin: 0 20px 0 20px;
    font-size: 1.5em;
    font-family: "jf-openhuninn-2.0";
  }
  .save{
    // display: flex;
    
    width: 22%;
  }
</style>