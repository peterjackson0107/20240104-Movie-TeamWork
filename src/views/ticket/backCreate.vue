<template>
    
    <div class="view">
        <div class="check" >
            <div class="movieName">
                <p>電影名稱:</p>
                <input type="text" v-model="this.movieName">
            </div>
            <div class="onDate">
                <p>上映日期:</p>
                <input type="date" name="" id="" v-model="this.onDate">
            </div>
            <button class="search1" type="submit" @click="getPlayMovie()">正在熱映</button>
            <button class="search" type="submit" @click="getMovieName()" >搜尋</button>
        </div>
        <div class="icon">
            <button type="button" @click="gobackSearch()"><i class="fa-solid fa-rotate-left"></i></button>
        </div>
        <table class="table1">
            <thead>
                <tr class="index">
                    <th>電影海報</th>
                    <th>電影ID</th>
                    <th>電影名稱</th>
                    <th>上映日期</th>
                    <th>新增</th>

                </tr>
                <tr v-for="(movie, index) in displayedMovies " :key="index" >

                    <td><img :src="'https://image.tmdb.org/t/p/w92' + movie.poster_path" alt="" @click="gotoSeat(movie)"></td>
                    <td>{{ movie.id }}</td>
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.release_date }}</td>
                    <td><button class="create" type="button" @click="gotoSeat(movie)">建立</button></td>
                </tr>
            </thead>
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
            <button @click="nextPage" :disabled="currentPage === Math.ceil(objPlayMovies.length / pageSize)">下一頁</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            //電影相關資料
            objPlayMovies: [],
            movieName: "",
            onDate: "",
            //上下頁以及一頁有幾個的變數
            currentPage: 1,
            pageSize: 10,
            pageNumber: "",
            //語言標籤
            languageTarget: "zh-TW",
            target: "",
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < Math.ceil(this.objPlayMovies.length / this.pageSize)) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
        },
        gobackSearch() {
            this.$router.push('/backSearch')
        },
        gobackAdd() {
            this.$router.push('/backAdd')
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
            let count = 100; //要抓的電影數
            let playingMovies = [];

            try {
                const nowDate = new Date();
                const twoMonth = new Date();
                twoMonth.setMonth(nowDate.getMonth() - 2);
                while (playingMovies.length < count) {
                    const api = `https://api.themoviedb.org/3/movie/now_playing?language=zh-TW&page=${page}`;
                    const response = await fetch(api, options);

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    const moviesOnPage = data.results.filter((movie) => {
                        const releaseDate = new Date(movie.release_date);
                        // 檢查發佈日期是否在指定範圍內
                        if (!(releaseDate >= twoMonth && releaseDate <= nowDate)) {
                            return false;
                        }
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
            } catch (error) {
                console.error(error);
            }
        },
        gotoSeat(movie) {
            console.log(movie)
            this.$router.push({
                name: 'backAdd',
                query: {
                    movieId: movie.id,
                    movieTitle: movie.title,
                }
            });
        },
        async getMovieName() { //上映中
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10'
                },
            };

            let page = 1;
            let count = 100; //要抓的電影數
            let playingMovies = [];

            try {
                while (playingMovies.length < count) {
                    const api = `https://api.themoviedb.org/3/search/movie?query=${this.movieName}&include_adult=false&language=${this.languageTarget}&page=${page}`;
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
            } catch (error) {
                console.error(error);
            }
        },
    },
    mounted() {
        this.getPlayMovie()
    },
    computed: {
        displayedMovies() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.objPlayMovies.slice(startIndex, endIndex);
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


        .movieName {
            width: 100vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 50px;

            input {
                width: 75%;
                height: 5vh;
                margin-left: 3vw;
            }
        }

        .onDate {
            width: 50vw;
            display: flex;
            justify-content: start;
            align-items: center;
            font-size: 16pt;
            margin-left: 50px;

            input {
                height: 5vh;
                width: 50%;
                margin-left: 3vw;
                font-size: 16pt;
            }
        }

        .search {
            width: 8%;
            height: 5vh;
            margin-top: 35px;
            color: white;
            background-color: salmon;
        }

        .search1 {
            width: 10%;
            height: 5vh;
            margin-top: 35px;
            color: white;
            background-color:salmon;
            margin-right: 35px;
        }

        p {
            margin: 0;
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

    .table1 {
        width: 80vw;
        height: auto;

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

        .create {
            border: 0;
            background-color: white;
            color: salmon;
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