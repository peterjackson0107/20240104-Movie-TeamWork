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
            <button v-if="movieAllTime != ''" type="button" @click="deleteSelected()">刪除</button>
            <div class="checkButton">
                <button type="button" @click="backSearch()">返回</button>
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
            movieInfo: [],
            movieId: "",
            movieName: "",
            movieCinema: "選擇影院",
            movieArea: "選擇影廳",
            moviePrice: "",
            movieDate: "",
            movieTime: "",
            movieAllTime: [],
            selectedItems: []
        }
    },
    methods: {
        movieTimeAdd() {
            // if (this.movieTime !== "") {
            //     this.movieAllTime.push(this.movieTime);
            //     this.movieTime = ""; // 推送時間後清除輸入
            // }
            if (this.movieTime !== "") {
                // 將使用者輸入的時間轉換為Date物件
                const selectedTime = new Date(`2000-01-01 ${this.movieTime}`);

                // 取得小時和分鐘部分
                let hours = selectedTime.getHours();
                let minutes = selectedTime.getMinutes();

                // 判斷是否為下午，如果是，將小時部分減去12
                const period = hours >= 12 ? '下午' : '上午';
                hours = hours % 12 || 12; // 如果是12點，則保留12

                // 格式化小時和分鐘，確保分鐘顯示為兩位數
                const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

                // 重新賦值給movieTime
                this.movieTime = `${period} ${hours}:${formattedMinutes}`;

                // 推送時間到movieAllTime陣列
                this.movieAllTime.push(this.movieTime);
                // 清除輸入框中的時間
                this.movieTime = "";
            }




        },
        deleteSelected() {
            // 過濾出被勾選的項目並更新 movieAllTime
            this.movieAllTime = this.movieAllTime.filter((play, index) => !this.selectedItems[index]);

            // 刪除後清空 selectedItems 陣列
            this.selectedItems = [];
        },
        backSearch() {
            this.$router.push('/backSearch')
        },
        create() {
            if (this.movieId !== "" &&
                this.movieName !== "" &&
                this.movieCinema !== "" &&
                this.movieArea !== "" &&
                this.moviePrice !== "" &&
                this.movieDate !== "" &&
                this.movieAllTime !== "") {
                this.movieAllTime = JSON.stringify(this.movieAllTime)
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
                        onTime: this.movieAllTime
                    },
                }).then(res => {
                    console.log(res);
                    this.movieId = ""
                    this.movieName = ""
                    this.movieCinema = ""
                    this.movieArea = ""
                    this.moviePrice = ""
                    this.movieDate = ""
                    this.movieAllTime = ""
                    this.$router.push("/backCreate")
                })
            } else {
                // 顯示提示訊息或採取其他處理方式
                alert("請填寫所有必填項目");
            }

        }
    },
    mounted() {
        this.movieInfo = this.$route.query;
        this.movieName = this.movieInfo.movieTitle
        this.movieId = this.movieInfo.movieId
        console.log("Movie Details:", this.movieInfo);
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