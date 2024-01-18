<script>
import { defineComponent } from 'vue'
import { NCarousel } from 'naive-ui'
import { mapState,mapActions } from 'pinia';
import auth from '../store/auth';
export default defineComponent({
  components: {
    NCarousel
  },

  data() {
    return {
      searchMode: 'original',   // 搜尋模式：original（原始）或 result（結果）
      searchText: '',           // 搜尋文字
      searchResults: '',         // 搜尋結果
      abc: false,
      //電影相關
      objPlayMovies: [], //"篩選"過後所剩下的所有電影 (應該是這樣)
      type: [],
      selectedGenre: null, // 現在選擇的電影類型 (下拉不要賦予預設值，就不會影響搜尋文字)
      movieGenres: [], //所有電影類型
      maxVisibleCards: 8, // 控制最大显示的卡片数量
      noResultsModal: false, // 控制无匹配电影的模态框显示
      //電影海報
      selectedMovie: null,
      //電影獨立id
      

      name: "Kass123",
      artName:"遊戲",

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
  },
  computed: {
    ...mapState(auth,["getAuth","getuser"]),
    filteredMovies() {
      // 如果有选中的电影类型，则首先过滤电影类型
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

    // kk(){
    //   fetch('http://localhost:8080/movie/art/create', {
    //     method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       movie: this.selectedMovie,
    //       // artName: link.download,
    //       artDescription: this.url,
    //       account: this.name,
    //     })
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       // 處理返回的數據
    //       console.log(data);
    //     })
    //     .catch(error => {
    //       console.error('Error fetching data:', error);
    //     });
    // },

    // Create() { //儲存

      // let url = this.$refs['sketchpad'].toDataURL("image/png", 1.0)
      // const link = document.createElement('a')
      // link.innerText = 'Download'
      // link.href = url
      // link.download = `circl${this.count}`
      // this.count++
      // link.click()
    //   console.log(this.selectedMovie)

    //   fetch('http://localhost:8080/movie/art/create', {
    //     method: 'POST', // 這裡使用POST方法，因為後端是@PostMapping
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       movie: this.selectedMovie.title,
    //       movieId: this.selectedMovie.id,
    //       // artName: link.download,
    //       artlocation: this.url,
    //       account: this.name,
          
    //     })
    //   })
    //     .then(response => response.json())
    //     .then(data => {
    //       // 處理返回的數據
    //       console.log(data);
    //     })
    //     .catch(error => {
    //       console.error('Error fetching data:', error);
    //     });
    // },



    PerformSearch() {
      // 執行搜尋邏輯
      this.searchResults = this.searchText;
      this.searchMode = 'result';
      this.abc = true;
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
      this.abc = false;
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
    account: this.name,
    
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
      let count = 900; //要抓的電影數
      let playingMovies = [];//上映中的電影

      try {
        // 循環遞增頁數，直到達到指定的電影數量
        while (playingMovies.length < count) {
          // 組成 API 請求的 URL
          const api = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=zh-TW&page=${page}`;
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
            this.selectedGenre = this.movieGenres[0];
            // this.selectedGenre = this.movieGenres.find(genre => genre.id === 28); //這個也可以用
            console.log("Selected Genre:", this.selectedGenre);
          }
        })
        .catch(err => console.error(err));
    },

    enterGenreArea() { //下拉選單的方法，選擇電影類型
      // this.searchMode = 'result'; //這行註解掉的原因是，不管有沒有搜到電影 他都會跳進下一頁
      //this.abc = true;
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

    //點選電影海報 (需要抓他的電影名稱)
    selectMovie(movie) {
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
  .then(response => response.blob())  // 使用 blob() 來處理二進位資料
  .then(blobData => {
    // 將 Blob 資料轉換成 URL
    const imageUrl = URL.createObjectURL(blobData);

    // 在這裡你可以將 imageUrl 存放在適當的數據結構中，以供輪播使用
    // 可以將 imageUrl 加入到 movie 物件中，或是在 data 中建立一個陣列存放所有的圖片 URL

    // 然後觸發輪播更新或直接修改 visibleFilteredMovies 中相應的 movie 物件
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
},



  },


  async mounted() {
    this.setCanvas()
    this.currentColor = this.colors[0]
    this.setWindowEvent()
    await this.getPlayMovie();
    await this.getMovieType();
  },

});
</script>

<template lang="">
<!-- Search First -->
      <div class="First" v-if="searchMode === 'original'">
        <select v-model="selectedGenre" @change="enterGenreArea">
          <option value="">All genres</option> <!-- 新增這行 -->
          <option v-for="genre in movieGenres" :key="genre.id" :value="genre">{{ genre.name }}</option>
        </select>
        <input class="searchMovie1" type="text" v-model="searchText"  placeholder="搜尋電影...">
        <button @click="PerformSearch">進入區域</button>
        <!-- 提示信息 -->
  <p v-if="!searchText.trim()">請輸入搜索條件</p>
  <p v-else-if="noResultsModal">無相關電影</p>
  </div>

  <!-- Search First Result -->
  <div class="First2" v-if="searchMode === 'result'">
    <button @click="ResetSearch" style="margin-top:25px" >重搜電影</button>
    <!-- <p>電影名稱: {{ searchResults }}</p> -->

    <div class="moviePosterAll">
      <div v-for="(movie, index) in visibleFilteredMovies" :key="movie.id" class="card" style="width: 18rem; height: 34.8rem; margin-right:2%; margin-top:2%;">
        <div class="box" @click="selectMovie(movie)">
      <div class="box1"></div><a href="#bord" class="btn btn-primary" style="">
        <img class="card-img-top" :src="getMoviePosterPath(movie.poster_path)" alt="Card image cap" style="height: 27rem;">
        </a>
      </div>
        <div class="card-body" style="height: 10rem;">
          <h5 class="card-title">{{ movie.title }}</h5>
          <div class="GoShowText">
          <a href="#Second" class="btn btn-primary">前往展示區</a>
        </div>
        </div>
      </div>
    </div>
    <!-- Learn More 按钮 -->
    <button v-if="visibleFilteredMovies.length < filteredMovies.length" @click="showMoreCards">Learn More</button>
    <a href="#" class="btn btn-primary" style="">回頂部</a>
</div>
    

    <div class="bord" v-show="this.getAuth" id="bord">
      <div v-if="selectedMovie">
        <p>電影名稱: {{ selectedMovie.title }}</p>
        <p>電影id: {{ selectedMovie.id }}</p>

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

  <div class="Second" v-show="abc" id="Second">
    <p>電影名稱: {{ searchResults }}</p>
    <div class="ShowPoster">
      <n-carousel
  direction="vertical"
  dot-placement="right"
  mousewheel
  style="width: 54%; height: 68.4%"
>
  <div v-for="(movie, index) in visibleFilteredMovies" :key="movie.id">
    <div>
    <img
      class="carousel-img"
      :src="movie.imageUrl"
    />
    <h5>{{ movie.title }}</h5>
    </div>
  </div>
</n-carousel>
</div>
</div>
</template>

<style scoped lang="scss">
.First {
  width: 100vw;
  height: 100vh;
  border: 1px solid black;

  .searchMovie1 {
    margin-top: 280px;
  }
}

.First2 {
  position: relative;
  overflow: auto;
  // width: 100vw;
  // height: 100vh;
  border: 1px solid black;

  .moviePosterAll {
    width: 100%;
    // height: 100%;
    border: 1px solid black;
    display: flex;
    flex-wrap: wrap;
    height: auto;
    justify-content: center;
    align-items: center;

    
  a.btn.btn-primary {
    text-decoration: none !important; /* 使用 !important 強制覆蓋其他樣式 */
    border: none; /* 移除邊框 */
    outline: none; /* 移除聚焦時的藍色框線 */
}

    .box {
      overflow: hidden;
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.2s;
      cursor: pointer; //變手指選擇
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

    .box:hover .box1 {
      left: 110%;
      transition: all 1s;
    }

    .box:hover {
      transform: translateY(-20px);
      box-shadow: 0 26px 40px -24px rgb(0 36 100 / 50%);
    }

    .card-title {
      margin-top: 10px;
    }

    .GoShowText {
      position: absolute;
      bottom: 20px;
      left: 36%;
    }
  }
}

.bord {
  height: 100vh;
  margin-top: 120px;
}

.Second {
  width: 100vw;
  height: 100vh;
  border: 1px solid black;

  .ShowPoster {
    width: 100%;
    height: 100%;
    border: 1px solid black;
    position: relative;

    .n-carousel {
      position: absolute;
      top: 22%;
      left: 23%;
      border: 1px solid black;
    }

    .carousel-img {
      width: 20%;
      height: 20%;
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
  margin-top: 30px;
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
      transition: 0.5s;
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
</style>