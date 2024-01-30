<template>
    <div class="view">
        <h1 style="color: rgb(0, 0, 0);">{{ this.movieInfo.movieTitle }}</h1>
        <div class="createMovieInfo">

            <select class="form-select form-select mb-3" v-model="this.movieCinema">
                <option selected class="textTX">選擇影院</option>
                <option value="紹仁戲院" class="textTX">紹仁戲院</option>
                <option value="裕峰影城" class="textTX">裕峰影城</option>
                <option value="梓宏影院" class="textTX">梓宏影院</option>
                <option value="暐衡劇院" class="textTX">暐衡劇院</option>
            </select>
            <select class="form-select form-select mb-3" v-model="this.movieArea">
                <option selected class="textTX">選擇影廳</option>
                <option value="1號影廳" class="textTX">1號影廳</option>
                <option value="2號影廳" class="textTX">2號影廳</option>
                <option value="3號影廳" class="textTX">3號影廳</option>
                <option value="4號影廳" class="textTX">4號影廳</option>
            </select>
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="floatingPrice" placeholder="票價" v-model="this.moviePrice">
                <label for="floatingPrice">票價</label>
            </div>
            <div class="form-floating mb-3">
                <input type="date" class="form-control" id="floatingTime" placeholder="撥放日期" v-model="this.movieDate">
                <label for="floatingTime">播放日期</label>
            </div>
            <div class="form-floating mb-3">
                <input type="time" class="form-control" id="floatingTime" placeholder="撥放時間" v-model="this.movieTime">
                <label for="floatingTime">播放時間</label>
                <button type="button" @click="movieTimeAdd()" :disabled="isDisabled || isDisabledtime"
                    class="buttonX">新增場次時段</button>
            </div>
            <p v-if="isDisabled"
                style="color: rgb(255, 0, 0); background-color: rgb(221, 161, 65); border-radius: 20px;margin: 10px 0 10px 0 ;height: 30px;line-height: 1.7em;">
                每個項目都必須填入才可以新增場次時段</p>
            <p v-if="isDisabledtime"
                style="color: rgb(255, 0, 0); background-color: rgb(221, 161, 65); border-radius: 20px;height: 30px;line-height: 1.7em;">
                播放日期必須在今天之後！</p>
            <p style="margin: 0;" class="textT">時間選項</p>
            <div class="playTime" style="background-color: white;">
                <tr v-for="(play, index) in movieAllTime " :key="index">
                    <td><input type="checkbox" v-model="selectedItems[index]"></td>
                    <td>{{ play }}</td>
                </tr>
            </div>
            <button v-if="movieAllTime.length > 0" type="button" @click="deleteSelected()" class="buttonS">刪除</button>
            <div class="checkButton">
                <button type="button" @click="backCreate()" class="buttonX">返回</button>
                <button type="button" @click="createS()" class="buttonX">送出資料</button>
                <button type="button" @click="createP()" class="buttonXL">送出資料並開啟售票</button>
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
            //把搜尋的電影時刻傳進來
            movieList: [],

        }
    },
    computed: {
        isDisabled() {
            const today = new Date();
            const selectedDate = new Date(this.movieDate);

            // 添加条件检查
            return (
                this.movieCinema === '選擇影院' ||
                this.movieArea === '選擇影廳' ||
                this.moviePrice === '' ||
                this.movieDate === '' ||
                this.movieTime === ''
            );
        },
        isDisabledtime() {
            const today = new Date();
            const selectedDate = new Date(this.movieDate);

            // 添加条件检查
            return (
                selectedDate <= today
            );
        }
    },
    components: {
        Swal,
    },
    methods: {
        //添加時間
        movieTimeAdd() {
            // 檢查是否至少相隔一個 runtime
            if (this.checkTimeGap()) {
                this.movieAllTime.push(this.movieTime);
                // 對 movieAllTime 進行排序
                this.movieAllTime.sort();
                this.movieTime = ""
            } else {
                Swal.fire("新加入的時間必須至少相隔 " + this.runtime + " 分鐘");
            }
        },
        //確認時間的間隔差
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
        //把電影時間解析程分鐘
        convertTimeToMinutes(time) {
            // 解析時間為分鐘
            return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
        },
        //刪除勾選的時間
        deleteSelected() {
            // 過濾出被勾選的項目並更新 movieAllTime
            this.movieAllTime = this.movieAllTime.filter((play, index) => !this.selectedItems[index]);
            // 刪除後清空 selectedItems 陣列
            this.selectedItems = [];
        },
        //返回創造頁面
        backCreate() {
            this.$router.push('/backCreate')
        },
        //傳送資訊 不可購票
        createS() {

            const repet = this.movieList.some(movie =>
                movie.cinema === this.movieCinema &&
                movie.area === this.movieArea &&
                movie.onDate === this.movieDate
            );
            console.log(repet);

            if (repet) {
                Swal.fire("此影城的影廳在這一天已經有排程了");
                return;
            }
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
            if (isNaN(this.moviePrice) || this.moviePrice === "" || this.moviePrice === "0") {
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
                Swal.fire(errorMessage);
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
                        onTime: JSON.stringify(this.movieAllTime),
                        onSell: false
                    },
                }).then(res => {
                    console.log(res);
                    Swal.fire("以儲存到電影時刻表中!!")
                    this.$router.push("/backSearch");
                });
            }
        },
        //傳送資訊 可購票
        createP() {

            const repet = this.movieList.some(movie =>
                movie.cinema === this.movieCinema &&
                movie.area === this.movieArea &&
                movie.onDate === this.movieDate
            );
            console.log(repet);

            if (repet) {
                Swal.fire("此影城的影廳在這一天已經有排程了");
                return;
            }
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
            if (isNaN(this.moviePrice) || this.moviePrice === "" || this.moviePrice === "0") {
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
                Swal.fire(errorMessage);
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
                        onTime: JSON.stringify(this.movieAllTime),
                        onSell: true
                    },
                }).then(res => {
                    console.log(res);
                    Swal.fire("以儲存到電影時刻表中，且可開始購票!!")
                    this.$router.push("/backSearch");
                });
            }
        },
        //搜尋電影時間
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
                this.runtime = res.data.runtime + 40
                console.log(this.runtime);
            })
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
        },
    },
    mounted() {
        this.movieInfo = this.$route.query;
        this.movieName = this.movieInfo.movieTitle
        this.movieId = this.movieInfo.movieId
        console.log("Movie Details:", this.movieInfo);
        this.searchTime()
        this.search()
    },
}
</script>


<style scoped lang="scss">
.view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgb(174, 177, 192);
    height: 125vh;

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
            margin: 0 auto 0 auto;
            width: 150%;
        }
    }

    .playTime {
        margin-top: 10px;
        height: 15vh;
        border: 2px solid black;
        overflow-y: auto;
        border-radius: 10px;
    }
}

.buttonS {
    width: 10.2vw;
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
        background-color: rgb(63, 85, 195);
        color: rgb(255, 255, 255);
        transform: scale(1.1, 1.1);
    }
}

.buttonX {
    width: 14.2vw;
    height: 5.9vh;
    border: none;
    background-color: rgb(127, 136, 180);
    border-radius: 10px;
    font-size: 1.5em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 20px 10px 20px;
    color: rgb(0, 0, 0);

    &:hover {
        background-color: rgb(63, 85, 195);
        color: rgb(255, 255, 255);
        transform: scale(1.1, 1.1);
    }
}

.buttonXL {
    width: 14.2vw;
    height: 5.9vh;
    border: none;
    background-color: rgb(127, 136, 180);
    border-radius: 10px;
    font-size: 1.3em;
    font-family: 'jf-openhuninn-2.0';
    margin-top: 2.5%;
    transition: 0.4s;
    line-height: 1em;
    margin: 20px 20px 10px 20px;
    color: rgb(0, 0, 0);

    &:hover {
        background-color: rgb(63, 85, 195);
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

.textTX {
    font-family: 'jf-openhuninn-2.0';
    font-size: 1.2em;
    margin-top: 20px;
    color: rgb(0, 0, 0);
    margin-bottom: 50px;
}
</style>