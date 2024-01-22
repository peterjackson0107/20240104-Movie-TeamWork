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
                <p style="margin-left: 35px;">到</p>
                <input type="date" name="" id="" v-model="this.endDate">
            </div>
            <button class="search" type="button" @click="search()">搜尋</button>
        </div>
        <div class="icon">
            <button type="button" @click="create()"><i class="fa-solid fa-plus"></i></button>
        </div>
        <table class="table">
            <thead>
                <tr class="index">
                    <th>電影名稱</th>
                    <th>影院</th>
                    <th>影廳</th>
                    <th>價格</th>
                    <th>撥放日期</th>
                    <th>修改</th>
                </tr>
                <tr v-for="(movie, index) in displayedMovies" :key="index">
                    <td>{{ movie.movie }}</td>
                    <td>{{ movie.cinema }}</td>
                    <td>{{ movie.area }}</td>
                    <td>{{ movie.price }}</td>
                    <td>{{ movie.onDate }}</td>
                </tr>
            </thead>
        </table>
        <div class="pagination">
            <button @click="prevPage()" :disabled="currentPage === 1">上一頁</button>
            <button @click="nextPage()" :disabled="currentPage === Math.ceil(movieList.length / pageSize)">下一頁</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            movieList: [],
            movieName: "",
            cinema: "",
            area: "",
            price: "",
            onDate: "",
            startDate: "",
            endDate: "",
            currentPage: 1,
            pageSize: 10,
        }
    },
    methods: {
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
            }
            )
            this.movieName = ""
            this.cinema = ""
            this.startDate = ""
            this.endDate = ""
        },
        create() {
            this.$router.push('/backSearch')
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
    },
    mounted() {
        this.search()
    },
    computed: {
        displayedMovies() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.movieList.slice(startIndex, endIndex);
        }
    },
}
</script>


<style scoped lang="scss">
.view {
    margin-top: 20px;
    margin-left: 8vw;

    .check {
        display: flex;
        flex-wrap: wrap;
        width: 80vw;
        height: 25vh;
        border: 1px solid black;

        .search {
            width: 8%;
            height: 5vh;
            margin-left: 16px;
            margin-top: 35px;
            color: white;
            background-color: salmon;
        }

        .movieName {
            width: 100vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 50px;

            input {
                width: 85%;
                height: 5vh;
                margin-left: 3vw;
            }
        }

        .cinema {
            width: 30%;
            display: flex;
            justify-content: start;
            align-items: center;
            margin-left: 90px;
            font-size: 16pt;

            input {
                height: 5vh;
                width: 60%;
                margin-left: 3vw;
                font-size: 16pt;
            }
        }

        .onDate {
            width: 50%;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;

            input {
                height: 5vh;
                width: 30%;
                margin-left: 3vw;
                font-size: 16pt;
            }

        }

        p {
            margin: 0;
        }
    }

    .table {
        width: 80vw;
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
        margin-top: 3vh;
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
</style>