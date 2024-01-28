<script>
import { defineComponent } from 'vue'
import { NCarousel } from 'naive-ui'
import { mapState, mapActions } from 'pinia';
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
// import auth from '../store/auth';
export default defineComponent({
  components: {
    NCarousel
  },

  data() {
    return {
      searchMode: 'original',   // 搜尋模式：original（原始）或 result（結果）
      searchText: '',           // 搜尋文字
      searchResults: '',         // 搜尋結果
      convasIsCloss: false,
      convasIs: false,
      //電影相關
      objPlayMovies: [], //"篩選"過後所剩下的所有電影 (應該是這樣)
      type: [],
      selectedGenre: null, // 現在選擇的電影類型 (下拉不要賦予預設值，就不會影響搜尋文字)
      movieGenres: [], //所有電影類型
      maxVisibleCards: 8, // 控制最大顯示卡片數量
      noResultsModal: false, // 控制無匹配電影時的模板框顯示
      //點選電影海報後，才出現的電影資料
      selectedMovie: null,

      languageTarget: "zh-TW",

      // 帳號相關
      loginAccount: "",
      password: "",
      userLoggedIn: false,
      artName: "",

      //用于存储当前选定电影的图像URL
      carouselImages: [],
      //用於存帳戶
      carouselAccount:[],
      //用於存畫作名稱
      carouselArt:[],

      //關閉展示區的點點
      showDots:false,

      //會員or訪客標題
      pageTitle: '', // 初始化为空

      //畫板相關
      canvasWidth: 763, // 畫板的寬度
      canvasHeight: 450, // 畫板的高度
      canvasContext: null,
      backgroundColor: 'rgba(40, 40, 40)',
      colors: [
        { name: 'white', code: 'white' },
        { name: 'black', code: 'black' },
        { name: 'red', code: '#FF0000' },
        { name: 'blue', code: '#0000FF' },
        { name: 'green', code: '#00FF00' },
        { name: 'yallow', code: '#FFFF00' },
        { name: 'Orange', code: '#FFA500' },
        { name: 'Purple', code: '#800080' },
        { name: 'Pink', code: '#FFC0CB' },
        { name: 'Cyan', code: '#00FFFF' },
        { name: 'Chocolate', code: '#D2691E' },
        { name: 'Gold', code: '#FFD700' },
        { name: 'Pomegranate', code: '#C0392B' },
        { name: 'Rose', code: '#FF007F' },
        { name: 'Vermilion', code: '#E34234' },
        { name: 'Alizarin Crimson', code: '#E32636' },
        { name: 'Violet', code: '#8B00FF' },
        { name: 'Alice-Blue', code: '#F0F8FF' },
      ],
      currentColor: null,
      currentSize: '20',
      isSizing: false,
      isCanvasMouseDown: false,
      hideToolBar: false,
      hideNavBar: false,
      tools: [
        {
          preClass: 'fas',
          name: 'paint-brush'
        }, {
          preClass: 'fas',
          name: 'eraser'
        }, {
          preClass: 'far',
          name: 'square'
        }],
      currentTool: 'paint-brush',
      tempPosition: null,
      tempCanvas: null,
      count: 0
    }
  },

  created() {
    // 先取得所有電影類型
    this.getMovieType();
    this.logincheck();
    console.log(this.userLoggedIn);

    // 根据用户登录状态设置页面标题文字
    if (this.userLoggedIn) {
      this.pageTitle = '會員';
      console.log(this.pageTitle);
    } else {
      this.pageTitle = '訪客';
      console.log(this.pageTitle);
      
    }
  },
  computed: {
    filteredMovies() {
      // 如有選中的電影類型，則首先過濾電影類型
      let filteredByGenre = this.selectedGenre
        ? this.objPlayMovies.filter(movie => movie.genre_ids.includes(this.selectedGenre.id))
        : this.objPlayMovies;

      // 如果有输入的搜索文本，则再次过滤电影标题
      if (this.searchText.trim() !== '') {
        const searchTerm = this.searchText.toLowerCase();
        filteredByGenre = filteredByGenre.filter(movie => movie.title.toLowerCase().includes(searchTerm));
      }

      return filteredByGenre;
    },

    visibleFilteredMovies() {
      // 仅显示前 maxVisibleCards 个过滤后的卡片
      return this.filteredMovies.slice(0, this.maxVisibleCards);
    },
  },

  methods: {

    logincheck() {
      this.userLoggedIn = Cookies.get('userLoggedIn') === 'true'
      if (this.userLoggedIn) {
        this.loginAccount = Cookies.get('account')
        Cookies.set('account', this.loginAccount, { expires: 7, path: '/' });
      }
      // console.log(this.userLoggedIn)
      console.log(this.loginAccount)
    },


    PerformSearch() {
      // 執行搜尋邏輯
      this.searchResults = this.searchText;
      this.searchMode = 'result';
      this.convasIsCloss = true;
      this.checkCanEnterArea(); // 每次搜索后检查是否可以进入区域

      if (this.selectedGenre && this.selectedGenre.value === '') {
        // 如果選擇的是「所有電影」，顯示所有電影
        this.filteredMovies = this.objPlayMovies;
      } else if (this.searchText === '') {
        // 如果搜索文本为空，显示所有电影（這裡保留原有的邏輯）
        this.filteredMovies = this.objPlayMovies;
      } else {
        // 根据搜索文本和選擇的類型過濾電影
        const searchTerm = this.searchText.toLowerCase();
        this.filteredMovies = this.objPlayMovies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) &&
          (!this.selectedGenre || movie.genre_ids.includes(this.selectedGenre.id))
        );

        // 检查是否有搜索结果
        if (this.filteredMovies.length === 0) {
          // 显示无匹配电影的模态框
          this.noResultsModal = true;
          // 切回原始模式
          this.searchMode = 'original';
          return; // 结束方法，不再继续执行
        }
      }
      // 切换到结果模式this.searchMode = 'original'
      // this.searchMode = 'result';
      console.log('Performing search:', this.searchText);
    },
    ResetSearch() {
      // 重置搜尋相關資料
      this.searchText = '';
      this.searchResults = '';
      // this.selectedGenre = this.movieGenres[0]; // 重置选中的电影类型
      this.maxVisibleCards = 8; // 重置显示卡片数量
      this.noResultsModal = false; // 確保這行存在並將 noResultsModal 設為 false
      this.searchMode = 'original';
      this.convasIsCloss = false;
      this.convasIs = false;
      this.canEnterArea = true; // 重置为可以进入区域
    },

    filterMoviesByGenre() {
      // 根据下拉菜单选择的电影类型过滤电影
      this.filteredMovies = this.objPlayMovies.filter(movie => movie.genre_ids.includes(this.selectedGenre.id));
    },

    checkCanEnterArea() {
      // 检查是否可以进入区域
      this.canEnterArea = this.filteredMovies.length > 0;
    },


    onCanvasMouseDown() {
      this.isCanvasMouseDown = true
      this.setTempCanvas()
    },
    onCanvasMouseUp() {
      this.saveCanvasToHistory()
      this.resetToolState()
    },
    onSizeMouseDown() { this.isSizing = true },
    canvasToImage() {
      let url = this.$refs['sketchpad'].toDataURL("image/png", 1.0)

      //將相對路徑保存到變數
      // const relativePath = `images/circl${this.count}.png`;
      // console.log(relativePath);

      const link = document.createElement('a')
      link.innerText = 'Download'
      link.href = url
      link.download = `circl${this.count}`
      this.count++
      link.click()

      console.log(this.selectedMovie)

      fetch('http://localhost:8080/movie/art/create', {
        method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movie: this.selectedMovie.title,
          movieId: this.selectedMovie.id,
          artname: this.artName,
          artlocation: url,
          account: this.loginAccount

        })
      })
        .then(response => response.json())
        .then(data => {
          // 處理返回的數據
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    setWindowEvent() {
      window.addEventListener('mousemove', (event) => {

        let currentPos = this.getCanvasMousePosition(event.clientX, event.clientY)

        if (this.isSizing && this.tempPosition) {
          let dragValue = currentPos.y - this.tempPosition.y
          this.checkSizeDrag(dragValue)
        }

        if (this.isCanvasMouseDown && this.tempPosition) {
          let pos = this.getCanvasMousePosition(event.clientX, event.clientY)
          switch (this.currentTool) {
            case 'paint-brush':
              this.draw((ctx) => {
                ctx.strokeStyle = this.currentColor.code
                ctx.moveTo(this.tempPosition.x, this.tempPosition.y)
                ctx.lineTo(pos.x, pos.y)
              })
              break;
            case 'eraser':
              this.draw((ctx) => {
                ctx.strokeStyle = this.backgroundColor
                ctx.moveTo(this.tempPosition.x, this.tempPosition.y)
                ctx.lineTo(pos.x, pos.y)
              })
              break;
            case 'square':
              this.draw((ctx) => {
                // ctx.moveTo(this.tempPosition.x,this.tempPosition.y)
                // ctx.lineTo(pos.x,pos.y)
                let currentPos = this.getCanvasMousePosition(event.clientX, event.clientY)

                ctx.strokeStyle = this.currentColor.code
                let tempx = this.tempPosition.x
                let tempy = this.tempPosition.y
                let width = currentPos.x - tempx
                let height = currentPos.y - tempy

                ctx.putImageData(this.tempCanvas, 0, 0)
                ctx.rect(tempx, tempy, width, height);
              })

              break;
          }
        }
        if (this.currentTool == 'square' && this.isCanvasMouseDown) return
        this.setCanvasTempPosition(currentPos.x, currentPos.y)


      })
      window.addEventListener('popstate', (e) => {
        this.canvasContext.putImageData(e.state, 0, 0);
      })
    },
    checkSizeDrag(dragValue) {
      if (dragValue < 0) {
        this.currentSize = parseInt(this.currentSize) + 1
      } else if (dragValue > 0 && this.currentSize >= 1) {
        this.currentSize = parseInt(this.currentSize) - 1
      }
    },
    draw(action) {
      let canvasContext = this.canvasContext
      canvasContext.beginPath()
      canvasContext.lineWidth = this.currentSize * 2;
      action(canvasContext)
      canvasContext.stroke()
    },
    resetToolState() {
      this.isSizing = false
      this.tempPosition = null
      this.isCanvasMouseDown = false
    },
    setColor(selectedColor) {
      this.currentColor = selectedColor;
    },
    isColorActive(color) {
      return this.currentColor && color == this.currentColor.name
        ? 'active' : ''
    },
    isToolActive(tool) {
      return tool == this.currentTool ? 'active' : ''
    },
    resetCanvas() {
      let canvas = this.canvasContext.canvas
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      this.saveCanvasToHistory()
    },
    setCanvas() {
      let canvas = this.$refs['sketchpad']
      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;
      let ctx = canvas.getContext('2d')
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      this.canvasContext = ctx
    },
    setTempCanvas() {
      let ctx = this.canvasContext
      let canvas = ctx.canvas
      let tempCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.tempCanvas = tempCanvas
    },
    saveCanvasToHistory() {
      let ctx = this.canvasContext
      let canvas = ctx.canvas
      let tempCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
      window.history.pushState(tempCanvas, null);
    },
    getCanvasMousePosition(clientX, clientY) {
      let canvasPosition = this.canvasContext.canvas.getBoundingClientRect()
      let x = clientX - canvasPosition.x
      let y = clientY - canvasPosition.y
      return { x, y }
    },
    setCanvasTempPosition(x, y) {
      this.tempPosition = { x, y }
    },
    back() {
      window.history.back()
    },
    forward() {
      window.history.forward()
    },



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
      let count = 500; //要抓的電影數
      let playingMovies = [];//上映中的電影

      try {
        // 循環遞增頁數，直到達到指定的電影數量
        while (playingMovies.length < count) {
          // 組成 API 請求的 URL
          const api = `https://api.themoviedb.org/3/search/movie?query=${this.searchText}&include_adult=false&language=${this.languageTarget}&page=${page}`;
          // 發送 API 請求
          const response = await fetch(api, options);

          // 檢查是否成功獲取數據
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }


          // 解析 JSON 數據
          const data = await response.json();

          // 檢查poster_path是否存在
          const moviesOnPage = data.results.filter((movie) => {
            if (!movie.poster_path) {
              return false;
            }
            // if (!movie.genre_ids || movie.genre_ids.length === 0) {
            //   return false;
            // }
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
        const playMovies = playingMovies.filter((movie) => movie.poster_path && movie.genre_ids && movie.genre_ids.length > 0).slice(0, count);
        this.objPlayMovies = playMovies;
        // 打印出被過濾前的電影數量
        console.log('Before filtering, total movies:', playingMovies.length);
        const playMoviesWithGenre = playingMovies.filter((movie) => movie.poster_path && movie.genre_ids && movie.genre_ids.length > 0).slice(0, count);
        this.objPlayMoviesWithGenre = playMoviesWithGenre;

        // 打印出被過濾掉的電影信息
        const filteredOutMovies = playingMovies.filter(movie => !playMovies.includes(movie));
        console.log('Filtered out movies:', filteredOutMovies);

        console.log('After slicing:', this.objPlayMovies.length);
        console.log('上映中 PlayMovies:', this.objPlayMovies);

        this.searchResults = this.searchText;
        this.searchMode = 'result';
        
        if (this.userLoggedIn) {
          this.convasIsCloss = true;
          console.log(this.convasIsCloss);
        }
        console.log(this.convasIsCloss);
        this.convasIs = true;
        this.checkCanEnterArea(); // 每次搜索后检查是否可以进入区域

        // 检查是否有搜索结果
        if (this.filteredMovies.length === 0) {
          // 显示无匹配电影的模态框
          this.noResultsModal = false;
          // 切回原始模式
          this.searchMode = 'original';
          this.convasIsCloss = false;
          this.convasIs = false;
          return; // 结束方法，不再继续执行
          
        }
        if (this.userLoggedIn) {
          await Swal.fire({
        title: "會員身分登入!",
        text: "請點選 電影海報 開始屬於你的創作!",
        icon: "success"
      });
    } else {
      // 沒有進入區域的 SweetAlert2 彈窗
      await Swal.fire({
        title: "訪客身分登入!",
        text: "如需 創作 請登入會員!!",
        icon: "success"
      });
        }
        
      } catch (error) {
        // 處理錯誤
        console.error(error);
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
      fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', options)
        .then((response) => response.json())
        .then((response) => {
          // 使用扩展运算符将this.type的内容赋值给movieGenres，并保留this.type
          this.movieGenres = [...response.genres];
          console.log(this.movieGenres);

          // 設置 預設電影類型 (選項的value值由"genre.id"更改為"genre")
          if (this.movieGenres.length > 0) {
            this.selectedGenre = ""; //修改1
            // this.selectedGenre = this.movieGenres.find(genre => genre.id === 28); //這個也可以用
            console.log("Selected Genre:", this.selectedGenre);
          }
        })
        .catch(err => console.error(err));
    },

    enterGenreArea() { //下拉選單的方法，選擇電影類型
      // this.searchMode = 'result'; //這行註解掉的原因是，不管有沒有搜到電影 他都會跳進下一頁
      //this.convasIsCloss = true;
      // 在这里执行进入区域的逻辑
      console.log('進入區域，選擇的電影類型是：', this.selectedGenre);
      // 可以根据选中的电影类型执行相应的操作
    },

    getMoviePosterPath(posterPath) {
      // 返回电影的完整海报路径
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    },

    // 显示更多卡片
    showMoreCards() {
      // 每次点击增加显示的卡片数量
      this.maxVisibleCards += 4; // 或其他你希望增加的数量
    },

    searchMovie(movie) {
      this.selectedMovie = movie;

      fetch('http://localhost:8080/movie/art/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movie: this.selectedMovie.title,
          movieId: this.selectedMovie.id,
          artname: this.artName,
        })
      })
        .then(response => response.json())
        .then(img => {
          console.log(img)
          console.log(img.artList[0].artLocation);
          console.log(img.artList[0].artName);
          console.log(img.artList[0].account);

          this.carouselArt = img.artList.map(art => art.artName);
          console.log(this.carouselArt);

          this.carouselAccount = img.artList.map(art => art.account);
          console.log(this.carouselAccount);

          this.carouselImages = img.artList.map(art => art.artLocation);
          console.log(this.carouselImages);
          // this.carouselImages =img.artList[1].artLocation
          // this.carouselImages =img.artList[2].artLocation
          // this.carouselImages =img.artList[3].artLocation
          ;
        })
    },


    //點選電影海報的展示區 (需要抓他的電影名稱，去展示所有這部電影的作品)
    selectMovie(movie) {
      // if(this.userLoggedIn == true)
      this.selectedMovie = movie;

    },

  },


  async mounted() {
    this.searchResults = this.searchText;
    this.searchMode = 'original';
    this.setCanvas()
    this.currentColor = this.colors[0]
    this.setWindowEvent()
    await this.getPlayMovie();
    await this.getMovieType();
    this.logincheck();
  },

});
</script>

<template lang="">
<!-- Search First -->
      <div class="First" v-if="searchMode === 'original'">
        <!-- <select v-model="selectedGenre" @change="enterGenreArea" class="selectionBoxGenres">
          <option value="">All genres</option>  -->
          <!-- <option v-for="genre in movieGenres" :key="genre.id" :value="genre">{{ genre.name }}</option>
        </select> -->
        <div class="" style="background-color:#525f75; width:42%; height:80%; margin-top:90px; margin-left:29%; border-radius:20px;">
          <h1 style="position:absolute; left:40.8%; top:40%; color:white;">{{ "您的身分為: " + pageTitle }}</h1>
        <div class="form-floating mb-3" style="position:absolute; left:37.5%; top:47%;">
          <input type="text" class="form-control tb" id="floatingInput" placeholder="name@example.com" v-model="searchText"style="margin-top:70px;" >
          <label class="tbc" for="floatingInput" v-if="!searchText.trim()">搜尋電影...</label>
          <!-- <label class="tbc" for="floatingInput" v-else-if="noResultsModal">無相關電影</label> -->
        </div>
        <!-- <input class="searchMovie1" type="text" v-model="searchText"  placeholder="搜尋電影..."> -->
        <button @click="getPlayMovie()" class="btn btn-primary allbuttonshoulduseit2" style="margin-left:7.8%; margin-top:56%;" >進入區域</button>
      </div>
        <!-- 提示信息 -->
  <!-- <p v-if="!searchText.trim()">請輸入搜索條件</p> //修改1 整合功能510行
  <p v-else-if="noResultsModal">無相關電影</p> -->
  </div>

  <!-- Search First Result -->
  <div class="First2" v-if="searchMode === 'result'">
    <button @click="ResetSearch" style="margin-top:4.5rem;" class="btn btn-primary allbuttonshoulduseit">重新搜尋</button>
    <div class="moviePosterAll">
      <div v-for="(movie, index) in visibleFilteredMovies" :key="movie.id" class="card" style="width: 18rem; height: 34.8rem; margin-right:2%; margin-top:2%; margin-bottom:2%;">
        <div class="box" >
      <div class="box1"></div><a href="#bord" class="btn btn-primary goforarea" @click="selectMovie(movie)" style="">
        <img class="card-img-top" :src="getMoviePosterPath(movie.poster_path)" alt="Card image cap" style="height: 27rem;">
        </a>
      </div>
        <div class="card-body" style="height: 10rem;">
          <h5 class="card-title">{{ movie.title }}</h5>
          <div class="GoShowText">
          <a href="#Second" class="btn btn-primary goforarea" @click="searchMovie(movie)">前往展示區</a>
        </div>
        </div>
      </div>
    </div>
    <!-- Learn More 按钮 -->
    <button v-if="visibleFilteredMovies.length < filteredMovies.length" @click="showMoreCards" class="btn btn-primary allbuttonshoulduseit">查看更多</button>
    <a href="#" class="btn btn-primary allbuttonshoulduseit" style="">回頂部</a>
</div>
    

    <div v-show="convasIsCloss"  class="bord" id="bord">
      <!-- 用來推的div -->
      <div style="color:rgba(255, 255, 255, 0.01);">232</div>
      <div><h1 style="margin-top:20px;">創作區</h1></div>
      <div v-if="this.selectedMovie">
        <div class="CreateOoeName">
          <!-- 用來推的p -->
          <p style="color:rgb(82, 95, 117);">232</p>
        <p style="font-size:20pt; margin-top:20px; color:white;">創作主題: {{ selectedMovie.title }}</p>
        <!-- <p>電影id: {{ selectedMovie.id }}</p> -->
        <p style="font-size:21pt; margin-top:40px; color:white;">{{"設計者:" + this.loginAccount}}</p>
        <div style="height:45%; width:75%; margin-left:13%; margin-top:8px; background-color:#7E8EAB; border-radius:20px;">
          <!-- 用來推的p -->
          <p style="color:#7E8EAB;">232</p>
        <p style="font-size:15pt; margin-top:38px;">請為您的作品命名:</p>              
<textarea rows="1" v-model="artName" required style="width:18vw; border-radius: 0%; outline: none; resize: none; border: 0; background: none; border-bottom: 1px solid black; margin-bottom:30px;"></textarea>
          </div>      
            </div>
    <!-- 其他的顯示內容... -->
  </div>
 <ul class="navbar " 
     :class="{hideNavBar}"
     >
   <li @click="canvasToImage">
     <i class="fa fa-save imageColor"></i>
     儲存
   </li>
   <li  @click="resetCanvas"> 
     <i class="fa fa-chalkboard imageColor"></i>
     清空
    </li>
   <li @click="back()">
      <i class="fa fa-undo imageColor"></i>
      返回
   </li>

   <li  @click="forward()"  >
      <i class="fas fa-redo imageColor"></i>
      取消
   </li>
   <div class="btn up " @click="hideNavBar = !hideNavBar"></div>
 </ul>
 
 <canvas ref="sketchpad" 
   @mousedown="onCanvasMouseDown"
   @mouseup="onCanvasMouseUp"
   :style="`background-color:${backgroundColor}; border: 2px solid #000; `"
   ></canvas>

 <ul class="toolbar" :class="{hideToolBar}">
   <div class="btn btn-toolbar down" @click="hideToolBar = !hideToolBar"></div>
   <li class="toolbar__tool">
    <i v-for="(tool,index) in tools "
       :key="index"
       
       :class="`${tool.preClass } fa-${tool.name} `+ isToolActive(tool.name)" 
       @click="currentTool=tool.name"
       ></i>
  </li>
  <li class="toolbar__size">
    <span>畫筆:</span>
    <input type="text" 
     @mousedown="onSizeMouseDown"
     @mouseup="resetToolState"
     v-model="currentSize"
     class="size-controller">
    <!-- <span class="textColor">px</span> -->
  </li>

  <span>顏色:</span>
  <li class="toolbar__color">
    
    <div
      v-for="(color, index) in colors"
      :key="index"
      :class="{ 'color': true, 'active': isColorActive(color) }"
      :style="{ backgroundColor: color.code }"
      @click="setColor(color)"
    ></div>
    
  </li>
 </ul>
</div>
  <div class="Second" v-show="convasIs" id="Second">
    
   <!-- 用來推的p -->
   <p style="color:rgb(255, 255, 255, 0.01);">232</p>
    <h1 style="margin-top:50px;">展示區</h1>
    <!-- 用來推的div -->
    <div style="color:rgba(255, 255, 255, 0.01);">232</div>
    
    <div class="ShowPoster">
      
      
      <!-- <p>電影名稱: {{ selectedMovie.title }}</p> -->
 <n-carousel
  direction="vertical"
  :show-dots="showDots"
  dot-placement="right"
  mousewheel
  style="width: 610.4px; height: 360px;"
  class="NColor"
>
<div v-for="(image, index) in carouselImages" :key="index">
    <img class="carousel-img" :src="image" style=" margin-top:0px; max-width: 100%; max-height: 100%; object-fit: cover;" />
    <div class="" style="position:absolute; left:3.1%; bottom:1.2%;">
      <p style=" color:black; background-color:pink; border-radius:20px; margin-bottom:10px; padding: 5px 15px;">{{ "設計者:" + carouselAccount[index] }}</p>
        <p style=" color:black; background-color:#7e8eab; border-radius:20px; padding: 5px 15px;">{{ "作品名稱:" + carouselArt[index] }}</p>
      </div>
  </div>

</n-carousel>

</div>
</div>
</template>

<style scoped lang="scss">
.First {
  width: 100vw;
  height: 90vh;
  // border: 1px solid black;
  background-image: url(../src/picture/CreateBackground.png);
  background-repeat: no-repeat;
  background-size: cover;
  overflow-x: hidden; //隱藏水平滾動條
  overflow-y: hidden; //隱藏垂直滾動條

  .searchMovie1 {
    margin-top: 280px;
  }

  .selectionBoxGenres {
    margin: 20px 0;
    height: 5%;
    width: 50%;
    background-color: rgb(176, 182, 213);
    border-radius: 10px;
    border: none;
    padding-left: 15px;
  }
}

.First2 {
  position: relative;
  overflow: auto;
  // width: 100vw;
  // height: 100vh;
  // border: 1px solid black;
  background-color: rgb(202, 207, 230);
  .moviePosterAll {
    width: 100%;
    // height: 100%;
    // border: 1px solid black; 修改1 不要黑框線超醜
    display: flex;
    flex-wrap: wrap;
    height: auto;
    justify-content: center;
    align-items: center;


    a.btn.btn-primary {
      text-decoration: none !important;
      /* 使用 !important 強制覆蓋其他樣式 */
      border: none;
      /* 移除邊框 */
      outline: none;
      /* 移除聚焦時的藍色框線 */
    }

    .box {
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.2s;
      // cursor: pointer; //變手指選擇
    }

    .box1 {
      position: absolute;
      left: -110%;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, .5), rgba(255, 255, 255, 0));
      transform: skew(-30deg);
    }

    box {
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.2s;
      cursor: pointer;
    }

    .box1 {
      position: absolute;
      left: -110%;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, .5), rgba(255, 255, 255, 0));
      transform: skew(-30deg);
      transition: all 1s;
      /* 將 transition 移至這裡 */
    }

    .box:hover .box1 {
      left: 110%;
      transform: skew(-30deg) scaleX(2);
      /* 新增一個 scaleX 可以讓閃爍效果更突顯 */
    }

    .box:hover {
      transform: translateY(-20px);
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
    }

    /* 新增的部分，使用 animation 來產生瞬間變化 */
    .box1-shimmer {
      animation: shimmer 1s;
    }

    @keyframes shimmer {

      0%,
      100% {
        transform: skew(-30deg) scaleX(0);
      }

      50% {
        transform: skew(-30deg) scaleX(2);
      }
    }

    .card-title {
      //修改1 調整文字大小
      margin-top: 10px;
      font-size: 1.5em;
    }

    .GoShowText {
      //修改1 修整按鍵大小
      position: absolute;
      bottom: 10px;
      width: 70%;
      height: 8%;
      left: 15%;

      .goforarea {
        width: 80%;
        height: 100%;
        font-size: 1.5em;
        padding: 2px 0 0 0;
        // border-radius: 20px;
       
      }
    }
  }
}

.bord {
  height: 170vh;
  
  // margin-top: 50px;
  background-image: url(../src/picture/bordImage.jpg);
  background-repeat: no-repeat;
  background-size: cover;

  .CreateOoeName{
    width: 35%;
    height: 370px;
    margin-left: 32.5%;
    margin-top: 20px;
    background-color: rgb(82, 95, 117);
    border-radius: 20px;
  }
}

.Second {
  width: 100vw;
  height: 130vh;
  // border: 1px solid black;
  background-image: url(../src/picture/bordImage.jpg);
  background-repeat: no-repeat;
  background-size: cover;



  .ShowPoster {
    width: 903px;
    height: 700px;
    margin-left: 21%;
    margin-top: 3.5%;
    // border: 1px solid black;
  background-image: url(../src/picture/12345603.png);
  background-repeat: no-repeat;
  background-size: contain;

  
    position: relative;

    .n-carousel {
      position: absolute;
      top: 22%;
      left: 23%;
      // border: 1px solid black;
    }

    .carousel-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

  }


}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.navbar {
  text-align: center;
  line-height: 60px;
  height: 75px;
  margin-left: 385px;
  margin-top: 40px;
  // border: 2px solid #000;

  // left: 50%; 
  // top: 0;
  // transform: translateX(-50%);
  width: 49.9%;
  background-color: #535353;
  transition: all 0.1s;

  li {
    font-size: 15px;
    margin: 0 40px;
    padding: 0px 30px;
    display: inline-block;
    list-style: none;
    border-radius: 50px;
    color: pink;

    &:hover {
      background-color: pink;
      color: #535353;
      transform: scale(1.1, 1.1);
      cursor: pointer;
      transition: 0.2s;
      border-radius: 30px;
    }
  }

}

.toolbar {
  display: flex;
  flex-wrap: nowrap;
  // justify-content: start;
  align-items: center;
  // bottom: 100px; 
  // left: 50%; 
  // transform: translateX(-50%);
  width: 49.9%;
  margin-left: 385px;
  margin-top: -5.8px; // 往上推
  background-color: #535353;
  height: 80px;
  // border: 2px solid #000;

  // border-radius: 50px;
  li {
    line-height: 35px;
    margin: 0;
    padding: 0 22px;
    list-style: none;

    i {
      // font-size: 50%;
      padding: 5px;
      border-radius: 50px;
      margin-right: 1px;
      cursor: pointer; //變手指選擇

      &:hover {
        background-color: #d8d8d8;
      }
    }

  }
}

.toolbar__size {

  span {
    font-size: 100%;
    margin: 0 20px;
    color: pink;

  }

  input {
    text-align: center;
    background-color: #d8d8d8;
    padding: 10px;
    width: 20%;
    font-size: 100%;
    border-radius: 50px;
    border: none;

    &:focus {
      outline: none;
    }
  }
}

span {
  font-size: 100%;

  // margin-right: 5px;
  // position: a;
  color: pink;
}

.toolbar__color {
  width: 267px;
  height: 52px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;

  .color {
    width: 5%;
    height: 5%;
    // margin-top: 38px;
    margin-top: 6px;
    margin-right: 1.5%;
    padding: 10px;
    border-radius: 50px;
    cursor: pointer; //變手指選擇

    &:hover {
      background-color: #d8d8d8;
    }
  }
}

.imageColor {
  color: red;
}

.toolbar__tool {

  // margin-left: 10px;
  // margin-bottom: 100px;
  .active {
    background-color: #d8d8d8;
  }
}

.tb {
  width: 400px;
  height: 30px;
  margin-left: -0.1%;
  // margin: 0 auto;
  // margin-top: 5%;
}

.tbc {
  margin-left: 0.5%;
  margin-top: 18%;
}

.allbuttonshoulduseit {
  //從這個標籤去找其他修改的地方 修改1
  width: 30%;
  height: 100%;
  font-size: 1.5em;
  margin-right: 28px;
  margin-bottom: 20px;
  background-color: #7e8eab;
  border: #7e8eab;
}

.allbuttonshoulduseit2 {
  width: 20%;
  height: 10%;
  font-size: 1.5em;
  margin-right: 28px;
  margin-bottom: 20px;
  background-color: #7e8eab;
  border: #7e8eab;
}

.NColor{
  background-color: rgb(255, 255, 255,0.01);
  margin-left: -8%;
  margin-top: -8%;
  // border: 2px solid #C0AC6B !important;

}
// 待修改，將輸入進來的電影種類改成中文
</style>