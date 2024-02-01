<template>
    <div class="view">
        <div class="check">
            <div class="movieName">
                <p>電影名稱：</p>
                <input type="text" v-model="this.movieName">
            </div>
            <div class="cinema">
                <p>影院：</p>
                <input type="text" name="" id="" v-model="this.cinema">
            </div>
            <div class="onDate">
                <p style="margin: 0;">播放日期：</p>
                <input type="date" name="" id="" v-model="this.startDate">
                <p>到</p>
                <input type="date" name="" id="" v-model="this.endDate">
            </div>
            <button class="buttonZ" type="button" @click="search()">搜尋</button>
        </div>
        <div style="display: flex;width: 90vw;">
            <i class="fa-solid fa-plus  fa-xs icon" @click="create()"></i>
            <p class="textTC">點此新增場次</p>
        </div>
        {{ this.selectedMovies }}
        <table class="table1">
            <thead>
                <tr class="index">
                    <th style="width: 5vw;">刪除</th>
                    <th style="width: 15vw;">電影名稱</th>
                    <th style="width: 12vw;">影院</th>
                    <th style="width: 12vw;">影廳</th>
                    <th style="width: 4vw;">價格</th>
                    <th style="width: 10vw;">播放日期</th>
                    <th style="width: 15vw;">播放時段</th>
                    <th style="width: 10vw;">購票開放</th>
                    <th style="width: 10vw;">修改場次</th>
                </tr>
                <tr v-for="(movie, index) in displayedMovies" :key="index">
                    <td style="background-color: #b9c3d5;">
                        <i class="fa-solid fa-trash" @click="this.deleteMovie(movie.number)" v-if="!movie.onSell"></i>
                        <i class="fa-solid fa-xmark" v-if="movie.onSell"></i>
                    </td>
                    <td style="background-color: #b9c3d5;">{{ movie.movie }}</td>
                    <td style="background-color: #b9c3d5;">{{ movie.cinema }}</td>
                    <td style="background-color: #b9c3d5;">{{ movie.area }}</td>
                    <td style="background-color: #b9c3d5;">{{ movie.price }}</td>
                    <td style="background-color: #b9c3d5;">{{ movie.onDate }}</td>
                    <td style="background-color: #b9c3d5;">{{ visableTime(movie.onTime) }}</td>
                    <td style="background-color: #b9c3d5;">{{ visableSell(movie.onSell) }}</td>
                    <td style="background-color: #b9c3d5;">
                        <!-- 修改按鈕 -->
                        <button type="button" class="fixword" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                            @click="showEditModal(movie); searchTime()" :disabled="movie.onSell" v-if="!movie.onSell">
                            修改
                        </button>
                        <button type="button" class="fixwordX" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                            @click="showEditModal(movie); searchTime()" :disabled="movie.onSell" v-if="movie.onSell">
                            停止修改
                        </button>

                    </td>
                </tr>
            </thead>
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
            <button v-for="pageNumber in pageNumbers" :key="pageNumber" @click="goToPage(pageNumber)"
                :class="{ 'active-page': pageNumber === currentPage }">{{ pageNumber }}</button>
            <button @click="nextPage" :disabled="currentPage === totalPages">下一頁</button>
        </div>
    </div>

    <!-- 修改視窗 -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">{{ this.editMovie.movieName }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <select class="form-select form-select mb-3" v-model="this.editMovie.movieCinema">
                        <option selected>選擇影院</option>
                        <option value="紹人戲院">紹人戲院</option>
                        <option value="裕峰影城">裕峰影城</option>
                        <option value="梓宏影院">梓宏影院</option>
                        <option value="暐衡劇院">暐衡劇院</option>
                    </select>
                    <select class="form-select form-select mb-3" v-model="this.editMovie.movieArea">
                        <option selected>選擇影廳</option>
                        <option value="1號影廳">1號影廳</option>
                        <option value="2號影廳">2號影廳</option>
                        <option value="3號影廳">3號影廳</option>
                        <option value="4號影廳">4號影廳</option>
                    </select>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="floatingPrice" placeholder="票價"
                            v-model="this.editMovie.moviePrice">
                        <label for="floatingPrice">票價</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="floatingTime" placeholder="播放日期"
                            v-model="this.editMovie.movieOnDate">
                        <label for="floatingTime">播放日期</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="time" class="form-control" id="floatingTime" placeholder="播放時間" v-model="movieNewTime">
                        <label for="floatingTime">播放時間</label>
                        <button type="button" @click="movieTimeAdd()" class="buttonS">加入</button>
                    </div>
                    <p style="margin: 0;" class="textT">時間選項</p>
                    <div class="playTime">
                        <tr v-for="(time, index) in editMovie.movieOnTime" :key="index">
                            <td><input type="checkbox" v-model="selectedItems[index]"></td>
                            <td>{{ time }}</td>
                        </tr>
                    </div>
                    <button v-if="editMovie.movieOnTime != ''" type="button" @click="deleteSelected()"
                        class="buttonS">刪除</button>
                </div>
                <div class="modal-footer">
                    <button id="cancel" type="button" class="btn btn-secondary buttonY" data-bs-dismiss="modal">取消</button>
                    <button id="cancel" type="button" class="btn btn-secondary buttonA" data-bs-dismiss="modal"
                        @click="updateS()">僅儲存</button>
                    <button type="button" class="btn btn-primary buttonX" @click="updateP()">確認傳送</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'
export default {
    data() {
        return {
            //搜尋到的資料 電影資料相關
            movieList: [],
            //checkbox去篩選要刪掉的物件需要推進去相關的代號
            selectedItems: [],
            //全部的時間用push推的
            movieAllTime: [],
            //添加前的時間
            movieNewTime: "",
            //上下頁以及一頁有幾個的變數
            currentPage: 1,
            pageSize: 10,
            // 添加一个用于编辑模态框的数据对象
            editMovie: [],
            //電影播放時間
            runtime: "",
            //電影相關資訊
            number: "",
            movieName: "",
            cinema: "",
            area: "",
            price: "",
            onDate: "",
            startDate: "",
            endDate: "",
        }
    },
    components: {
        Swal,
    },
    computed: {
        displayedMovies() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;

            // 先拷贝数组，避免直接修改原数组
            const sortedMovies = [...this.movieList];

            // 根据播放日期进行排序
            sortedMovies.sort((a, b) => {
                const dateA = new Date(a.onDate).getTime();
                const dateB = new Date(b.onDate).getTime();
                return dateA - dateB;
            });

            // 返回排序后的片段
            return sortedMovies.slice(startIndex, endIndex);
        },
        pageNumbers() {
            const totalPages = Math.ceil(this.movieList.length / this.pageSize);
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        },
        visableTime() {
            return function (x) {
                let onTimeString = x;
                let cleanedOnTime = onTimeString.replace(/[\[\]"']/g, '');
                let onTimeArray = cleanedOnTime.split(',');
                let formattedOnTime = onTimeArray.join(', ');
                return formattedOnTime;
            };
        },
        visableSell() {
            return function (x) {
                let cc = x
                if (x == true || x == "true") {
                    cc = "開放購票"
                } else {
                    cc = "尚未開放購票"
                }
                return cc;
            };
        },
        
    },
    methods: {
        //滑到最上面
        scrollToTop() {
            window.scrollTo(0, 0);
        },
        //跳轉到指定頁數
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.scrollToTop()
        },
        //計算頁數
        calculateTotalPages() {
            this.totalPages = Math.ceil(this.movieList.length / this.pageSize);
        },
        //添加時間
        movieTimeAdd() {
            if (this.movieNewTime == "") {
                Swal.fire("新加入的時間不能是空的");
                return
            }
            // 檢查是否至少相隔一個 runtime
            if (this.checkTimeGap()) {
                this.editMovie.movieOnTime.push(this.movieNewTime);
                // 對 editMovie.movieOnTime 進行排序
                this.editMovie.movieOnTime.sort();
            } else {
                Swal.fire("新加入的時間必須至少相隔 " + this.runtime + " 分鐘");
            }
        },
        //確認時間的間隔差
        checkTimeGap() {
            // 如果 editMovie.movieOnTime為空，直接允許加入
            if (this.editMovie.movieOnTime === "") {
                return true;
            }

            const currentTimeMinutes = this.convertTimeToMinutes(this.movieNewTime);

            // 檢查新加入時間與所有已存在時間的時間差
            for (const existingTime of this.editMovie.movieOnTime) {
                const existingTimeMinutes = this.convertTimeToMinutes(existingTime);
                const timeDifference = Math.abs(currentTimeMinutes - existingTimeMinutes);

                // 如果任何一個時間差小於 runtime，則返回 false
                if (timeDifference < this.runtime) {
                    return false;
                }
            }
            // 所有時間差都大於等於 runtime，返回 true
            return true;
        },
        //把電影時間解析程分鐘
        convertTimeToMinutes(time) {
            // 解析時間為分鐘
            return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
        },
        //搜尋電影時間
        searchTime() {
            axios({
                method: 'GET',
                url: `https://api.themoviedb.org/3/movie/${this.editMovie.movieId}`,
                params: { language: 'en-US' },
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10'
                }
            }).then(res => {
                console.log(res);
                this.runtime = res.data.runtime + 40
                console.log(this.runtime);
            })
        },
        //刪除勾選的時間
        deleteSelected() {
            // 過濾出被勾選的項目並更新 movieAllTime
            this.editMovie.movieOnTime = this.editMovie.movieOnTime.filter((time, index) => !this.selectedItems[index]);
            // 刪除後清空 selectedItems 陣列
            this.selectedItems = [];
        },
        //把要修改的影片資訊傳入修改頁面
        showEditModal(movie) {
            this.editMovie = {
                number: movie.number,
                movieId: movie.movieId,
                movieName: movie.movie,
                movieCinema: movie.cinema,
                movieArea: movie.area,
                moviePrice: movie.price,
                movieOnDate: movie.onDate,
                movieOnTime: JSON.parse(movie.onTime).sort(),
            };
            console.log(this.editMovie);
            // this.movieAllTime = JSON.parse(movie.onTime).sort();
        },
        //搜尋電影時刻表
        search() {
            axios({
                url: 'http://localhost:8080/movie/movieinfo/search',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                data: {
                    movie: this.movieName,
                    cinema: this.cinema,
                    on_date: this.onDate,
                    startDate: this.startDate,
                    endDate: this.endDate
                },
            }).then(res => {
                console.log(res);
                console.log(res.data.movieInfoList);
                this.movieList = res.data.movieInfoList

                // //將播放時間變成可視化格式
                // for (let i = 0; i < this.movieList.length; i++) {
                //     let onTimeString = this.movieList[i].onTime;
                //     let cleanedOnTime = onTimeString.replace(/[\[\]"']/g, '');
                //     let onTimeArray = cleanedOnTime.split(',');
                //     let formattedOnTime = onTimeArray.join(', ');
                //     this.movieList[i].onTime = formattedOnTime;
                // }
                // console.log(this.movieList);

                //設置一個新時間  設置時間在今天的零時零分離秒
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                //把movieInfoList篩選  設置一個movieDate= 一個新的時間序列  當movieDate >= today才會回傳到movieList裡面
                this.movieList = res.data.movieInfoList.filter(movie => {
                    const movieDate = new Date(movie.onDate).getTime();
                    return movieDate >= today;
                });
            }
            )
            this.movieName = ""
            this.cinema = ""
            this.startDate = ""
            this.endDate = ""
        },
        //前往創造頁面
        create() {
            this.$router.push('/backCreate')
        },
        //下一頁
        nextPage() {
            if (this.currentPage < Math.ceil(this.movieList.length / this.pageSize)) {
                this.currentPage++;
            }
        },
        //上一頁
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        //刪除電影的功能
        async deleteMovie(movieNumber) {
            Swal.fire({
                title: "確定嗎?",
                text: "你確定要刪除這部電影資訊!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: "取消",
                confirmButtonText: "我確定!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "刪除!",
                        text: "你的資料已刪除.",
                        icon: "success"
                    });
                    const response = axios.post('http://localhost:8080/movie/movieinfo/delete', {
                        number: movieNumber

                    });
                    setTimeout(() => { location.reload(); }, 2000);
                }
            });
            await this.search();
            // // 提示使用者確認是否刪除
            // const confirmDelete = window.confirm('確定要刪除此電影嗎？');
            // if (confirmDelete) {
            //     // 如果使用者確認刪除，再進行刪除操作
            //     const response = await axios.post('http://localhost:8080/movie/movieinfo/delete', {
            //         number: movieNumber
            //     }
            //     );
            //     this.search();

            // }
        },
        //更新電影不可購票
        updateS() {
            const repet = this.movieList.some(movie =>
                movie.cinema === this.editMovie.movieCinema &&
                movie.area === this.editMovie.movieArea &&
                movie.onDate === this.editMovie.movieOnDate &&
                movie.number !== this.editMovie.number
            );
            console.log(repet);

            if (repet) {
                Swal.fire("此影城的影廳在這一天已經有排程了");
                return;
            }
            // 初始化錯誤訊息
            let errorMessage = "";
            // 檢查每個必填項目
            if (this.editMovie.movieName === "") {
                errorMessage += "請填寫電影名稱\n";
            }
            if (this.editMovie.movieCinema === "選擇影院") {
                errorMessage += "請選擇影院\n";
            }
            if (this.editMovie.movieArea === "選擇影廳") {
                errorMessage += "請選擇影廳\n";
            }
            if (isNaN(this.editMovie.moviePrice) || this.editMovie.moviePrice === "" || this.editMovie.moviePrice === "0") {
                errorMessage += "請填寫有效的價格\n";
            }
            if (this.editMovie.movieOnDate === "") {
                errorMessage += "請填寫播放日期\n";
            }
            if (this.editMovie.movieOnTime == "") {
                errorMessage += "請填寫影片播放時間\n";
            }
            // 如果 errorMessage 不為空，表示有未填寫的項目
            if (errorMessage !== "") {
                // 顯示提示訊息
                Swal.fire(errorMessage);
            } else {
                axios({
                    url: 'http://localhost:8080/movie/movieinfo/update',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        number: this.editMovie.number,
                        movieId: this.editMovie.movieId,
                        movie: this.editMovie.movieName,
                        cinema: this.editMovie.movieCinema,
                        area: this.editMovie.movieArea,
                        price: this.editMovie.moviePrice,
                        onDate: this.editMovie.movieOnDate,
                        onTime: JSON.stringify(this.editMovie.movieOnTime),
                    },
                }).then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        document.getElementById('cancel').click();
                        location.reload();
                    }
                });
            }
        },
        //更新電影可購票
        updateP() {

            const repet = this.movieList.some(movie =>
                movie.cinema === this.editMovie.movieCinema &&
                movie.area === this.editMovie.movieArea &&
                movie.onDate === this.editMovie.movieOnDate &&
                movie.number !== this.editMovie.number
            );
            console.log(repet);

            if (repet) {
                Swal.fire("此影城的影廳在這一天已經有排程了");
                return;
            }

            // 初始化錯誤訊息
            let errorMessage = "";
            // 檢查每個必填項目
            if (this.editMovie.movieName === "") {
                errorMessage += "請填寫電影名稱\n";
            }
            if (this.editMovie.movieCinema === "選擇影院") {
                errorMessage += "請選擇影院\n";
            }
            if (this.editMovie.movieArea === "選擇影廳") {
                errorMessage += "請選擇影廳\n";
            }
            if (isNaN(this.editMovie.moviePrice) || this.editMovie.moviePrice === "" || this.editMovie.moviePrice === "0") {
                errorMessage += "請填寫有效的價格\n";
            }
            if (this.editMovie.movieOnDate === "") {
                errorMessage += "請填寫播放日期\n";
            }
            if (this.editMovie.movieOnTime == "") {
                errorMessage += "請填寫影片播放時間\n";
            }
            // 如果 errorMessage 不為空，表示有未填寫的項目
            if (errorMessage !== "") {
                // 顯示提示訊息
                Swal.fire(errorMessage);
            } else {
                // 所有必填項目都填寫了，執行後續的操作
                axios({
                    url: 'http://localhost:8080/movie/movieinfo/update',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        number: this.editMovie.number,
                        movieId: this.editMovie.movieId,
                        movie: this.editMovie.movieName,
                        cinema: this.editMovie.movieCinema,
                        area: this.editMovie.movieArea,
                        price: this.editMovie.moviePrice,
                        onDate: this.editMovie.movieOnDate,
                        onTime: JSON.stringify(this.editMovie.movieOnTime),
                        onSell: true
                    },
                }).then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        document.getElementById('cancel').click();
                        location.reload();
                    }
                });
            }
        },
    },
    mounted() {
        this.search()
    },
}
</script>


<style scoped lang="scss">
.view {
    height: 92vh;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background-image: url(../../picture/Movie1.jpg);
    background-repeat: no-repeat;
    background-size: cover;

    .check {
        display: flex;
        // flex-wrap: wrap;
        width: 90vw;
        height: 12vh;
        // border: 1px solid black;
        border-radius: 10px;
        margin-top: 25px;
        background-color: #525f75;

        .search {
            height: 5vh;
            width: 5vw;
            margin-top: 3.5vh;
            color: white;
            background-color: salmon;
        }

        .movieName {
            width: 21vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 10px;
            color: white;

            input {
                width: 14vw;
                height: 5vh;
            }
        }

        .cinema {
            width: 16vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 1vw;
            color: white;

            input {
                width: 11vw;
                height: 5vh;
                font-size: 16pt;
            }
        }

        .onDate {
            width: 43vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 10px;
            color: white;

            input {
                width: 15vw;
                height: 5vh;
                font-size: 16pt;
            }

            p {
                margin: 15px 15px;
            }
        }

        p {
            margin: 0;
        }
    }

    .table1 {
        width: 90vw;
        height: auto;


        // border: 1px solid black;
        .index {
            background-color: #525f75;
        }

        th {
            height: 5vh;
            border: 1px solid black;
            color: rgb(237, 235, 235);

        }

        td {
            // width: 10vw;
            height: 5vh;
            border: 1px solid black;
            color: rgb(0, 0, 0);
            font-size: 16pt;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .icon {
        display: flex;
        width: 60px;
        height: 9vh;
        font-size: 48pt;
        // line-height: 2em;
        padding-top: 30px;
    }

    .textTC {
        font-family: 'jf-openhuninn-2.0';
        font-size: 1.5em;
        margin-top: 20px;
        color: rgb(0, 0, 0);
        // margin-bottom: 50px;
    }

    .pagination {
        width: 90vw;
        justify-content: center;
        align-items: center;
        background-color: #525f75;

        button {
            color: rgb(255, 255, 255);
            font-size: 18pt;
            background-color: #525f75;
            border: 0px;

            &.active-page,
            &:hover {
                color: rgb(0, 0, 0); // 上一页、下一页的颜色
            }
        }

    }
}

// .playTime {
//     height: 15vh;
//     border: 1px solid black;
//     overflow-y: auto;
// }

.fixword {
    width: 6.2vw;
    height: 3.9vh;
    border: none;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    color: rgb(0, 0, 0);
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    border: none;
    background: none;
    outline: none;

    &:hover {
        color: rgb(255, 255, 255);
        transform: scale(1.2, 1.2);
    }
}

.fixwordX {
    width: 6.2vw;
    height: 3.9vh;
    border: none;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    color: rgb(0, 0, 0);
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    border: none;
    background: none;
    outline: none;
}

.buttonS {
    width: 6.2vw;
    height: 3.9vh;
    border: none;
    background-color: rgb(176, 182, 213);
    border-radius: 10px;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 20px 10px 20px;

    &:hover {
        background-color: gainsboro;
        color: darkslategray;
        transform: scale(1.1, 1.1);
    }
}

.buttonX {
    width: 6.2vw;
    height: 5.9vh;
    border: none;
    background-color: rgb(74, 174, 46);
    border-radius: 10px;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 20px 10px 20px;

    &:hover {
        background-color: rgb(65, 227, 20);
        color: rgb(255, 255, 255);
        transform: scale(1.1, 1.1);
    }
}

.buttonY {
    width: 6.2vw;
    height: 5.9vh;
    border: none;
    background-color: rgb(174, 46, 46);
    border-radius: 10px;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 90px 10px 20px;

    &:hover {
        background-color: rgb(227, 20, 20);
        color: rgb(255, 255, 255);
        transform: scale(1.1, 1.1);
    }
}

.buttonZ {
    width: 5.2vw;
    height: 4.9vh;
    border: none;
    background-color: rgb(176, 182, 213);
    border-radius: 10px;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    transition: 0.4s;
    line-height: 1em;
    margin: 25px 0 0 0;

    &:hover {
        background-color: gainsboro;
        color: darkslategray;
        transform: scale(1.1, 1.1);
    }
}

.buttonA {
    width: 6.2vw;
    height: 5.9vh;
    border: none;
    background-color: rgb(110, 110, 226);
    border-radius: 10px;
    font-size: 1em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 10px 10px 20px;

    &:hover {
        background-color: blue;
        color: rgb(255, 255, 255);
        transform: scale(1.1, 1.1);
    }

}

.textT {
    font-family: 'jf-openhuninn-2.0';
    font-size: 1.5em;
    margin-top: 20px;
    color: rgb(0, 0, 0);
    margin-bottom: 50px;
}

.playTime {
    margin-top: 10px;
    padding: 5px 0 0 10px;
    height: 15vh;
    border: 2px solid black;
    overflow-y: auto;
    border-radius: 10px;
}
</style>