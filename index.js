const searchBtn = document.getElementById('search')
const movieContainer = document.getElementById('movies-container')
const myWatchListBtn = document.getElementById('myWatchlist-btn')
const navEl = document.getElementById("nav-el")
const watchListBtn = document.getElementById('watchList')
const title = document.getElementById('title')
let myWatchlist = []

searchBtn.addEventListener('click',handleMovies)
watchListBtn.addEventListener('click',handleWatchList)
movieContainer.addEventListener('click',function(e){
    if(e.target.dataset.addToWatchList){
        const targetMovieId = e.target.dataset.addToWatchList
        const movieToAdd = myWatchlist.find(movie => movie.imdbID===targetMovieId)
        if(movieToAdd){
            const currentWatchlist = JSON.parse(localStorage.getItem('movieWatchListArr')) || [];
            
            if (!currentWatchlist.some(m => m.imdbID === targetMovieId)) {
                currentWatchlist.push(movieToAdd);
                localStorage.setItem('movieWatchListArr', JSON.stringify(currentWatchlist));
                alert("Added to watchlist!");
            }
            else{
                alert('Movie already exists in watchlist!')
            }
        }
    }  
})



async function handleMovies(){
    const movie = document.getElementById('movie').value
    if(movie){
        const response = await fetch(`https://www.omdbapi.com/?apikey=2e6f723c&s=${encodeURIComponent(movie)}`)
        const data = await response.json()
        renderMovies(data.Search)
    }
    else{
        movieContainer.classList.add("movies-container")
        movieContainer.innerHTML = `<p class="error-search">Unable to find what you’re looking for. Please try another search.</p>`        
    }
}
async function handleMovie(movie) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=2e6f723c&i=${movie.imdbID}`)
    const data = await response.json()
    return data
}
async function renderMovies(moviesArr){
    moviesArr = moviesArr.slice(0,5)
    const moviePromises = moviesArr.map(movie => handleMovie(movie))
    myWatchlist = await Promise.all(moviePromises);
    let html = ''
    html += myWatchlist.map(movie => {
        const {Poster,Title,imdbRating,Runtime,Genre,Plot} = movie
        return `
            <div class="movie-container" id="movie-container">
                <img src=${Poster} alt="${Title} image not found"/>
                <div class="movie-info">
                    <section class="first-row">
                        <h1>${Title}</h1>
                        <img src="./images/Star.png" />
                        <span class="rating">${imdbRating}</span>
                    </section>
                    <section class="second-row">
                        <p>${Runtime}</p>
                        <p>${Genre}</p>
                        <button class="watchlist-btn" id="watchlist-btn" data-add-to-watch-list="${movie.imdbID}">Watchlist</button>
                    </section>
                    <p>${Plot}</p>
                </div>
            </div>
            <hr/>
        `
    }).join('')
    movieContainer.classList.add('setToFlexStart')
    movieContainer.innerHTML = html
    
}
function handleWatchList(){
    const myWatchList = JSON.parse(localStorage.getItem('movieWatchListArr')) || []
    if(myWatchList.length>0){
        let html = ''
        html += myWatchList.map(movie => {
            const {Poster,Title,imdbRating,Runtime,Genre,Plot} = movie
            return `
                <div class="movie-container" id="movie-container">
                    <img src=${Poster} alt="${Title} image not found"/>
                    <div class="movie-info">
                        <section class="first-row">
                            <h1>${Title}</h1>
                            <img src="./images/Star.png" />
                            <span class="rating">${imdbRating}</span>
                        </section>
                        <section class="second-row">
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <button class="watchlist-btn" id="watchlist-btn" data-add-to-watch-list="${movie.imdbID}">Watchlist</button>
                        </section>
                        <p>${Plot}</p>
                    </div>
                </div>
                <hr/>
            `
        }).join('')
        movieContainer.innerHTML = html
        navEl.innerHTML = `
            <h1 id="title">My Watchlist</h1>
            <button id="watchList" class="se">Search for movies</button>
        `
    }
    else{
        movieContainer.innerHTML = `
            <p class="p">Your watchlist is looking a little empty...</p>
            <span class="lets-add-container">
                <img src="./images/Add.png"/>
                <p>Let’s add some movies!</p>   
            <span>
        `
    }
}