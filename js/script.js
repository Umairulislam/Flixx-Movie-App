// Global Object
const global = {
  currentPage: window.location.pathname,
  api_key: "7d543d12dc79b07ebb2b405afc72fc92",
  api_url: "https://api.themoviedb.org/3/",
}

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link")
const popularMovies = document.getElementById("popular-movies")
const popularShows = document.getElementById("popular-shows")
const movieDetails = document.getElementById("movie-details")
const showDetails = document.getElementById("show-details")
const spinner = document.querySelector(".spinner-container")

// Function to fetch the Data from the TMBD API
async function fetchAPIData(endpoint) {
  const API_URL = global.api_url
  const API_KEY = global.api_key

  showSpinner()
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
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
    <h2>${show.name}</h2>
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
  console.log(show)
  console.log(cast)
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
  console.log("Spinner Shown")
}

// Function to Hide Spinner
function hideSpinner() {
  spinner.style.display = "none"
  console.log("Spinner Hidden")
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
    case "index.html":
      console.log("Discover Page")
      break
    case "/movies.html":
      displayPopularMovies()
      console.log("Movies Page")
      break
    case "/shows.html":
      displayPopularShows()
      break
    case "/movie-details.html":
      displayMovieDetails()
      break
    case "/tv-details.html":
      displayShowDetails()
      break
    case "/search.html":
      console.log("Search Page")
      break
  }
  highlightActiveLink()
}
document.addEventListener("DOMContentLoaded", init)
