import { defineStore } from "pinia";

export default defineStore("counter", {
    //需要輸入兩個參數，1自建資料庫名稱，2資料庫內容

    //與.vue中 script 預設匯出概念相同，只是名稱不同data
    state() {
        return {
            location: 1,
        };
    },

    getters: {
        locationInfo(state) {
            return `現在位置: ${state.location}`;
        },
    },

    actions: {
        getLocation() {
            console.log(this.location);
        },
        setLocation(num) {
            this.location = num;
        },
    },
    nowPlaying(){
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTFmNDFjYjUxYWI2NmIzMjJkMGM1OGZkMDY1Y2I1YSIsInN1YiI6IjY1NThmNzFmMDgxNmM3MDBhYmJlNWQ3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RtMbqdUQUCfdqaLD5SoZ18e4PlSq9Ap4ShtGhmUMm10",
            },
        };
        
        fetch(
            "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
            options
        )
            .then((response) => response.json())
            .then((response) => console.log(response))
            .catch((err) => console.error(err));
        }
});
