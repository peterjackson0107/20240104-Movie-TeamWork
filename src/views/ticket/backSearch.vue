<template>
    <div class="view">
        <div class="check">
            <div class="movieName">
                <p>電影名稱:</p>
                <input type="text" v-model="this.movieName">
            </div>
            <div class="cinema">
                <p>影院:</p>
                <input type="text" name="" id="" v-model="this.cinema">
            </div>
            <div class="onDate">
                <p>撥放日期:</p>
                <input type="date" name="" id="" v-model="this.startDate">
                <p>到</p>
                <input type="date" name="" id="" v-model="this.endDate">
            </div>
            <button class="search" type="button" @click="search()">搜尋</button>
        </div>
        <div class="icon">
            <button type="button" @click="create()"><i class="fa-solid fa-plus  fa-xs"></i></button>
            <!-- <button type="button" @click="deleteMovie()"><i class="fa-solid fa-trash fa-xs"></i></button> -->
        </div>
        {{ this.selectedMovies }}
        <table class="table">
            <thead>
                <tr class="index">
                    <th>刪除按鈕</th>
                    <th>電影名稱</th>
                    <th>影院</th>
                    <th>影廳</th>
                    <th>價格</th>
                    <th>撥放日期</th>
                    <th>修改</th>
                </tr>
                <tr v-for="(movie, index) in displayedMovies" :key="index">
                    <td><button type="button" @click="this.deleteMovie(movie.number)"
                            style="border: 0;background-color: white;"><i class="fa-solid fa-trash"></i></button></td>
                    <td>{{ movie.movie }}</td>
                    <td>{{ movie.cinema }}</td>
                    <td>{{ movie.area }}</td>
                    <td>{{ movie.price }}</td>
                    <td>{{ movie.onDate }}</td>
                    <td>
                        <!-- 修改按鈕 -->
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop" @click="showEditModal(movie);searchTime() " >
                            修改
                        </button>

                    </td>
                </tr>
            </thead>
        </table>
        <div class="pagination">
            <button @click="prevPage()" :disabled="currentPage === 1">上一頁</button>
            <button @click="nextPage()" :disabled="currentPage === Math.ceil(movieList.length / pageSize)">下一頁</button>
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
                        <option value="紹仁戲院">紹仁戲院</option>
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
                        <input type="date" class="form-control" id="floatingTime" placeholder="撥放日期"
                            v-model="this.editMovie.movieOnDate">
                        <label for="floatingTime">撥放日期</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="time" class="form-control" id="floatingTime" placeholder="撥放時間" v-model="movieNewTime">
                        <label for="floatingTime">撥放時間</label>
                        <button type="button" @click="movieTimeAdd()">加入</button>
                    </div>
                    <p style="margin: 0;">時間選項</p>
                    <div class="playTime">
                        <tr v-for="(time, index) in editMovie.movieOnTime" :key="index">
                            <td><input type="checkbox" v-model="selectedItems[index]"></td>
                            <td>{{ time }}</td>
                        </tr>
                    </div>
                    <button v-if="editMovie.movieOnTime != ''" type="button" @click="deleteSelected()">刪除</button>
                </div>
                <div class="modal-footer">
                    <button id="cancel" type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="update()">確認傳送</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
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
            //電影撥放時間
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
    },
    methods: {
        movieTimeAdd() {
            // 檢查是否至少相隔一個 runtime
            if (this.checkTimeGap()) {
                this.editMovie.movieOnTime.push(this.movieNewTime);
                // 對 editMovie.movieOnTime 進行排序
                this.editMovie.movieOnTime.sort();
            } else {
                alert("新加入的時間必須至少相隔 " + this.runtime + " 分鐘");
            }
        },
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
        convertTimeToMinutes(time) {
            // 解析時間為分鐘
            return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
        },
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
                this.runtime = res.data.runtime
                console.log(this.runtime);
            })
        },
        deleteSelected() {
            // 過濾出被勾選的項目並更新 movieAllTime
            this.editMovie.movieOnTime = this.editMovie.movieOnTime.filter((time, index) => !this.selectedItems[index]);
            // 刪除後清空 selectedItems 陣列
            this.selectedItems = [];
        },
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
        create() {
            this.$router.push('/backCreate')
        },
        nextPage() {
            if (this.currentPage < Math.ceil(this.movieList.length / this.pageSize)) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        async deleteMovie(movieNumber) {
            // 提示使用者確認是否刪除
            const confirmDelete = window.confirm('確定要刪除此電影嗎？');

            if (confirmDelete) {
                // 如果使用者確認刪除，再進行刪除操作
                try {
                    const response = await axios.post('http://localhost:8080/movie/movieinfo/delete', {
                        number: movieNumber
                    });

                    // 刪除成功的處理，例如重新載入或更新電影列表
                    console.log(response);
                } catch (error) {
                    // 刪除失敗的處理，例如顯示錯誤信息
                    console.error('刪除電影失敗', error);
                }
            } else {
                // 如果使用者取消刪除，不執行任何操作
                console.log('取消刪除');
            }
            this.search()
        },
        update() {
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
                errorMessage += "請填寫撥放日期\n";
            }
            if (this.editMovie.movieOnTime === "") {
                errorMessage += "請填寫影片播放時間\n";
            }

            // 如果 errorMessage 不為空，表示有未填寫的項目
            if (errorMessage !== "") {
                // 顯示提示訊息
                alert(errorMessage);
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
    },
    mounted() {
        this.search()
    },
}
</script>


<style scoped lang="scss">
.view {
    margin-top: 10px;
    margin-left: 5vw;

    .check {
        display: flex;
        flex-wrap: wrap;
        width: 90vw;
        height: 12vh;
        border: 1px solid black;

        .search {
            height: 5vh;
            width: 5vw;
            margin-top: 3.5vh;
            color: white;
            background-color: salmon;
        }

        .movieName {
            width: 20vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 1vw;

            input {
                width: 14vw;
                height: 5vh;
            }
        }

        .cinema {
            width: 15vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 1vw;

            input {
                width: 11vw;
                height: 5vh;
                font-size: 16pt;
            }
        }

        .onDate {
            width: 45vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 1vw;

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

    .table {
        width: 90vw;
        height: auto;

        // border: 1px solid black;
        .index {
            background-color: gray;
        }

        th {
            height: 5vh;
            border: 1px solid black;
        }

        td {
            height: 5vh;
            border: 1px solid black;
        }
    }

    .icon {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-bottom: 3vh;

        button {
            background-color: white;
            border-width: 0;
            font-size: 32pt;
            width: 5vw;
            height: 5vh;
        }
    }

    .pagination {
        width: 80vw;
        justify-content: center;
        align-items: center;

        button {
            color: salmon;
            background-color: white;
            font-size: 18pt;
        }
    }
}

.playTime {
    height: 15vh;
    border: 1px solid black;
    overflow-y: auto;
}
</style>