// Global Object
const global = {
  currentPage: window.location.pathname,
  api_key: "7d543d12dc79b07ebb2b405afc72fc92",
  api_url: "https://api.themoviedb.org/3/",
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
}

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link")
const popularMovies = document.getElementById("popular-movies")
const popularShows = document.getElementById("popular-shows")
const movieDetails = document.getElementById("movie-details")
const showDetails = document.getElementById("show-details")
const spinner = document.querySelector(".spinner-btn")
const swiperWrapper = document.querySelector(".swiper-wrapper")
const trendingSwiper = document.getElementById("trending-swiper")
const upcomingMoviesSwiper = document.getElementById("upcoming-movies-swiper")
const upcomingShowsSwiper = document.getElementById("upcoming-shows-swiper")
const alert = document.getElementById("alert")
const searchResults = document.getElementById("search-results")
const searchResultHeading = document.getElementById("search-results-heading")
const pagination = document.getElementById("pagination")

// Function to fetch the Data from the TMBD API
async function fetchAPIData(endpoint) {
  const API_URL = global.api_url
  const API_KEY = global.api_key

  showSpinner()
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US}`
  )
  const data = await response.json()
  hideSpinner()
  return data
}

// Function to search the Data from the TMBD API
async function searchAPIData(endpoint) {
  const API_URL = global.api_url
  const API_KEY = global.api_key

  showSpinner()
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )
  const data = await response.json()
  hideSpinner()
  return data
}

// Function to display 20 most popular Movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular")

  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="card-img-top" />`
          : `<img src="./images/no-image.jpg" alt="${movie.title}" class="card-img-top" />`
      }
      </a>
      <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
      </div>
    `
    popularMovies.appendChild(div)
  })
}

// Function to display 20 most popular TV Shows
async function displayPopularShows() {
  const { results } = await fetchAPIData("tv/popular")

  results.forEach((show) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" class="card-img-top" />`
          : `<img src="./images/no-image.jpg" alt="${show.name}" class="card-img-top" />`
      }
      </a>
      <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${show.first_air_date}</small>
      </p>
      </div>
    `
    popularShows.appendChild(div)
  })
}

// Function to display the Movie Details
async function displayMovieDetails() {
  const movieId = new URLSearchParams(window.location.search).get("id")
  const movie = await fetchAPIData(`movie/${movieId}`)
  const { cast } = await fetchAPIData(`movie/${movieId}/credits`)

  displayBackdrop("movie", movie.backdrop_path)
  const detailsTop = document.createElement("div")
  detailsTop.classList.add("details-top")
  detailsTop.innerHTML = `
    <div>
    ${
      movie.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="details-img" />`
        : `<img src="./images/no-image.jpg" alt="${movie.title}" class="card-img-top" />`
    }
    </div>
    <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres
        .map((genre) => {
          return `<li>${genre.name}</li>`
        })
        .join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  `
  const detailsBottom = document.createElement("div")
  detailsBottom.classList.add("details-bottom")
  detailsBottom.innerHTML = `
    <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${movie.budget.toLocaleString()}</li>
      <li><span class="text-secondary">Revenue:</span> $${movie.revenue.toLocaleString()}</li>
      <li><span class="text-secondary">Runtime:</span> ${
        movie.runtime
      } minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((company) => {
      return `<p>${company.name}</>`
    })}</div>
    </div>
  `

  const detailsCast = document.createElement("div")
  detailsCast.classList.add("details-cast")
  detailsCast.innerHTML = `
    <h2>Top Cast</h2>
  <div class="cast-grid">
  ${cast
    .slice(0, 12)
    .map((member) => {
      return `
      <div class="cast-content">
      ${
        member.profile_path
          ? `<img src="https://image.tmdb.org/t/p/w500${member.profile_path}" alt="${member.name}" class="cast-img" />`
          : `<img src="./images/no-image.jpg" alt="${member.name}" class="cast-img" />`
      }
      <div class="cast-name">
        <p><strong>${member.name}</strong></p>
        <p>${member.character}</p>
      </div>
     </div>
     `
    })
    .join("")}
    </div>
  `

  movieDetails.appendChild(detailsTop)
  movieDetails.appendChild(detailsBottom)
  movieDetails.appendChild(detailsCast)
}

// Function to display the TV Show Details
async function displayShowDetails() {
  const showId = new URLSearchParams(window.location.search).get("id")
  const show = await fetchAPIData(`tv/${showId}`)
  const { cast } = await fetchAPIData(`tv/${showId}/credits`)

  displayBackdrop("show", show.backdrop_path)
  const detailsTop = document.createElement("div")
  detailsTop.classList.add("details-top")
  detailsTop.innerHTML = `
    <div>
    ${
      show.poster_path
        ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" class="card-img-top" />`
        : `<img src="./images/no-image.jpg" alt="${show.name}" class="card-img-top" />`
    }
    </div>
    <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed()} / 10
    </p>
    <p class="text-muted">Release Date: ${show.first_air_date}</p>
    <p>${show.overview}</p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres
        .map((genre) => {
          return `<li>${genre.name}</li>`
        })
        .join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
  `
  const detailsBottom = document.createElement("div")
  detailsBottom.classList.add("details-bottom")
  detailsBottom.innerHTML = `
    <h2>Show Info</h2>
    <ul>
    <li><span class="text-secondary">Number Of Seasons:</span> ${
      show.number_of_seasons
    }</li>
      <li><span class="text-secondary">Number Of Episodes:</span> ${
        show.number_of_episodes
      }</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${
          show.last_air_date
        }
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies
      .map((company) => {
        return `<p>${company.name}</p>`
      })
      .join("")}</div>
  `

  const detailsCast = document.createElement("div")
  detailsCast.classList.add("details-cast")
  detailsCast.innerHTML = `
    <h2>Top Cast</h2>
  <div class="cast-grid">
  ${cast
    .slice(0, 12)
    .map((member) => {
      return `
      <div class="cast-content">
      ${
        member.profile_path
          ? `<img src="https://image.tmdb.org/t/p/w500${member.profile_path}" alt="${member.name}" class="cast-img" />`
          : `<img src="./images/no-image.jpg" alt="${member.name}" class="cast-img" />`
      }
      <div class="cast-name">
        <p><strong>${member.name}</strong></p>
        <p>${member.character}</p>
      </div>
     </div>
     `
    })
    .join("")}
    </div>
  `

  showDetails.appendChild(detailsTop)
  showDetails.appendChild(detailsBottom)
  showDetails.appendChild(detailsCast)
}

// Function to display Movie Slider
async function displayMovieSlider() {
  const { results } = await fetchAPIData("movie/now_playing")
  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
            : `<img src="./images/no-image.jpg" alt="${movie.title}" />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>

    `
    swiperWrapper.appendChild(div)
    initSwiper()
  })
}

// Function to display TV Show Slider
async function displayShowSlider() {
  const { results } = await fetchAPIData("tv/airing_today")
  results.forEach((show) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />`
            : `<img src="./images/no-image.jpg" alt="${show.name}" />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
          1
        )} / 10
      </h4>

    `
    swiperWrapper.appendChild(div)
    initSwiper()
  })
}

// Function to display Trending Slider
async function displayTrending() {
  const { results } = await fetchAPIData("trending/all/week")
  results.forEach((trending) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
      <a href="${
        trending.media_type === "movie"
          ? "movie-details.html"
          : "tv-details.html"
      }?id=${trending.id}">
        ${
          trending.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${trending.poster_path}" alt="${trending.title}" />`
            : `<img src="./images/no-image.jpg" alt="${trending.title}" />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${trending.vote_average.toFixed(
          1
        )} / 10
      </h4>

    `
    trendingSwiper.appendChild(div)
    initSwiper()
  })
}

// Function to display Upcoming Movies Slider
async function displayUpcomingMovies() {
  const { results } = await fetchAPIData("movie/upcoming")
  results.forEach((movie) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />`
            : `<img src="./images/no-image.jpg" alt="${movie.title}" />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
          1
        )} / 10
      </h4>
    `
    upcomingMoviesSwiper.appendChild(div)
    initSwiper()
  })
}

// Function to display Upcoming Shows Slider
async function displayUpcomingShows() {
  const { results } = await fetchAPIData("tv/on_the_air")
  results.forEach((show) => {
    const div = document.createElement("div")
    div.classList.add("swiper-slide")
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />`
            : `<img src="./images/no-image.jpg" alt="${show.name}" />`
        }
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average.toFixed(
          1
        )} / 10
      </h4>
    `

    upcomingShowsSwiper.appendChild(div)
    initSwiper()
  })
}

// Function to Display Search Results
async function displaySearchResults(results) {
  results.forEach((result) => {
    const div = document.createElement("div")
    div.classList.add("card")
    div.innerHTML = `
      <a href="${
        global.search.type === "movie"
          ? "movie-details.html"
          : "tv-details.html"
      }?id=${result.id}">
      ${
        result.poster_path
          ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" class="card-img-top" />`
          : `<img src="./images/no-image.jpg" alt="${result.title}" class="card-img-top" />`
      }
      </a>
      <div class="card-body">
      <h5 class="card-title">${result.title || result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          result.release_date || result.first_air_date
        }</small>
      </p>
      </div>
    `
    searchResultHeading.innerHTML = `<h2>${results.length} of ${global.search.totalResults} Results For ${global.search.term} </h2>`
    searchResults.appendChild(div)
  })
  displayPagination()
}

// Function to Search for Movies and TV Shows
async function search() {
  const searchParams = new URLSearchParams(window.location.search)
  global.search.type = searchParams.get("type")
  global.search.term = searchParams.get("search-term")

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchAPIData(
      `search/${global.search.type}`
    )
    global.search.page = page
    global.search.totalPages = total_pages
    global.search.totalResults = total_results

    if (results.length === 0) {
      showAlert("No results found", "error")
    } else {
      displaySearchResults(results)
    }
  } else {
    showAlert("Please enter a search term", "error")
  }
}

// Function to Display Pagination
function displayPagination() {
  const div = document.createElement("div")
  div.classList.add("pagination")
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `
  pagination.appendChild(div)

  const nextBtn = document.getElementById("next")
  const prevBtn = document.getElementById("prev")
  // Disable Prev Button on First Page
  if (global.search.page === 1) {
    prevBtn.disabled = true
  }
  // Disable Next Button on Last Page
  if (global.search.page === global.search.totalPages) {
    nextBtn.disabled = true
  }

  // Event Listener for Next Button
  nextBtn.addEventListener("click", async () => {
    global.search.page++
    const { results } = await searchAPIData(`search/${global.search.type}`)
    searchResults.innerHTML = ""
    pagination.innerHTML = ""
    searchResultHeading.innerHTML = ""
    displaySearchResults(results)
  })

  // Event Listener for Prev Button
  prevBtn.addEventListener("click", async () => {
    global.search.page--
    const { results } = await searchAPIData(`search/${global.search.type}`)
    searchResults.innerHTML = ""
    pagination.innerHTML = ""
    searchResultHeading.innerHTML = ""
    displaySearchResults(results)
  })
}

// Function to init swiper
function initSwiper() {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    },
  })
}

// Function to Display Backdrop Image
function displayBackdrop(type, backdropPath) {
  const backdropDiv = document.createElement("div")
  backdropDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`
  backdropDiv.classList.add("backdrop")
  if (type === "movie") {
    movieDetails.appendChild(backdropDiv)
  } else {
    showDetails.appendChild(backdropDiv)
  }
}

// Functio to Show Spinner
function showSpinner() {
  spinner.style.display = "flex"
}

// Function to Hide Spinner
function hideSpinner() {
  spinner.style.display = "none"
}

// Functiuon to show Alert Message
function showAlert(message, className) {
  const alertBox = document.createElement("div")
  alertBox.className = `alert ${className}`
  alertBox.textContent = message
  alert.appendChild(alertBox)

  setTimeout(() => {
    alertBox.remove()
  }, 3000)
}

// Function to highlight the active link in the navigation bar
function highlightActiveLink() {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// Function to initialize the Application
function init() {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayTrending()
      displayUpcomingMovies()
      displayUpcomingShows()
      break
    case "/movies.html":
      displayMovieSlider()
      displayPopularMovies()
      break
    case "/shows.html":
      displayShowSlider()
      displayPopularShows()
      break
    case "/movie-details.html":
      displayMovieDetails()
      break
    case "/tv-details.html":
      displayShowDetails()
      break
    case "/search.html":
      search()
      break
  }
  highlightActiveLink()
}

document.addEventListener("DOMContentLoaded", init)
