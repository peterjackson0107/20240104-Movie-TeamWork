<template>
    <div class="view">
        <h1>{{ this.movieInfo.movieTitle }}</h1>
        <div class="createMovieInfo">

            <select class="form-select form-select mb-3" v-model="this.movieCinema">
                <option selected>選擇影院</option>
                <option value="紹仁戲院">紹仁戲院</option>
                <option value="裕峰影城">裕峰影城</option>
                <option value="梓宏影院">梓宏影院</option>
                <option value="暐衡劇院">暐衡劇院</option>
            </select>
            <select class="form-select form-select mb-3" v-model="this.movieArea">
                <option selected>選擇影廳</option>
                <option value="1號影廳">1號影廳</option>
                <option value="2號影廳">2號影廳</option>
                <option value="3號影廳">3號影廳</option>
                <option value="4號影廳">4號影廳</option>
            </select>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingPrice" placeholder="票價" v-model="this.moviePrice">
                <label for="floatingPrice">票價</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" class="form-control" id="floatingTime" placeholder="撥放日期" v-model="this.movieDate">
                <label for="floatingTime">撥放日期</label>
            </div>
            <div class="form-floating mb-3">
                <input type="time" class="form-control" id="floatingTime" placeholder="撥放時間" v-model="this.movieTime">
                <label for="floatingTime">撥放時間</label>
                <button type="button" @click="movieTimeAdd()">加入</button>
            </div>
            <p style="margin: 0;">時間選項</p>
            <div class="playTime">
                <tr v-for="(play, index) in movieAllTime " :key="index">
                    <td><input type="checkbox" v-model="selectedItems[index]"></td>
                    <td>{{ play }}</td>
                </tr>
            </div>
            <button v-if="movieAllTime.length > 0" type="button" @click="deleteSelected()">刪除</button>
            <div class="checkButton">
                <button type="button" @click="backCreate()">返回</button>
                <button type="button" @click="create()">送出</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            //電影相關資訊
            movieId: "",
            movieName: "",
            movieCinema: "選擇影院",
            movieArea: "選擇影廳",
            moviePrice: "",
            movieDate: "",
            movieTime: "",
            //電影撥放時間
            runtime: "",
            //全部的時間用push推的
            movieAllTime: [],
            //checkbox去篩選要刪掉的物件需要推進去相關的代號
            selectedItems: [],
            //上一頁推過來的電影資訊
            movieInfo: [],
        }
    },
    methods: {
        movieTimeAdd() {
            // 檢查是否至少相隔一個 runtime
            if (this.checkTimeGap()) {
                this.movieAllTime.push(this.movieTime);
                // 對 movieAllTime 進行排序
                this.movieAllTime.sort();
                this.movieTime=""
            } else {
                alert("新加入的時間必須至少相隔 " + this.runtime + " 分鐘");
            }
        },
        checkTimeGap() {
            // 如果 movieAllTime 長度為 0，直接允許加入
            if (this.movieAllTime.length === 0) {
                return true;
            }

            const currentTimeMinutes = this.convertTimeToMinutes(this.movieTime);

            // 檢查新加入時間與所有已存在時間的時間差
            for (const existingTime of this.movieAllTime) {
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
        deleteSelected() {
            // 過濾出被勾選的項目並更新 movieAllTime
            this.movieAllTime = this.movieAllTime.filter((play, index) => !this.selectedItems[index]);
            // 刪除後清空 selectedItems 陣列
            this.selectedItems = [];
        },
        backCreate() {
            this.$router.push('/backCreate')
        },
        create() {
            // 初始化錯誤訊息
            let errorMessage = "";

            // 檢查每個必填項目
            if (this.movieName === "") {
                errorMessage += "請填寫電影名稱\n";
            }
            if (this.movieCinema === "選擇影院") {
                errorMessage += "請選擇影院\n";
            }
            if (this.movieArea === "選擇影廳") {
                errorMessage += "請選擇影廳\n";
            }
            if (isNaN(this.moviePrice) || this.moviePrice === ""||this.moviePrice === "0") {
                errorMessage += "請填寫有效的價格\n";
            }
            if (this.movieDate === "") {
                errorMessage += "請填寫撥放日期\n";
            }
            if (this.movieAllTime.length === 0) {
                errorMessage += "請填寫影片播放時間\n";
            }

            // 如果 errorMessage 不為空，表示有未填寫的項目
            if (errorMessage !== "") {
                // 顯示提示訊息
                alert(errorMessage);
            } else {
                // 所有必填項目都填寫了，執行後續的操作
                axios({
                    url: 'http://localhost:8080/movie/movieinfo/create',
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: {
                        movie: this.movieName,
                        movieId: this.movieId,
                        cinema: this.movieCinema,
                        area: this.movieArea,
                        price: this.moviePrice,
                        onDate: this.movieDate,
                        onTime: JSON.stringify(this.movieAllTime)
                    },
                }).then(res => {
                    console.log(res);
                    this.$router.push("/backSearch");
                });
            }
        },
        searchTime() {
            axios({
                method: 'GET',
                url: `https://api.themoviedb.org/3/movie/${this.movieId}`,
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
        }
    },
    mounted() {
        this.movieInfo = this.$route.query;
        this.movieName = this.movieInfo.movieTitle
        this.movieId = this.movieInfo.movieId
        console.log("Movie Details:", this.movieInfo);
        this.searchTime()
    },
}
</script>


<style scoped lang="scss">
.view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .createMovieInfo {
        width: 50vw;

        .form-select {
            height: 10vh;
            font-size: 14pt;
            border: 1px solid;
        }

        .form-control {
            height: 10vh;
            font-size: 14pt;
            border: 1px solid;
        }

        .checkButton {
            display: flex;
            justify-content: space-around;
            width: 50vw;

            button {
                width: 10vw;
                height: 5vh;
            }
        }
    }

    .playTime {
        height: 15vh;
        border: 1px solid black;
        overflow-y: auto;
    }
}
</style>