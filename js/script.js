// Global Object
const global = {
  currentPage: window.location.pathname,
  api_key: "7d543d12dc79b07ebb2b405afc72fc92",
  api_url: "https://api.themoviedb.org/3/",
}

// DOM Elements
const navLinks = document.querySelectorAll(".nav-link")
const popularMovies = document.getElementById("popular-movies")

// Function to fetch the Data from the TMBD API
async function fetchAPIData(endpoint) {
  const API_URL = global.api_url
  const API_KEY = global.api_key

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  )
  const data = await response.json()
  return data
}

// Function to display 20 most popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData("movie/popular")

  results.forEach((movie) => {
    console.log(movie)
  })
  
  console.log(results)
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
      console.log("Shows Page")
      break
    case "/movie-details.html":
      console.log("Movie Details Page")
      break
    case "/tv-details.html":
      console.log("Show Details Page")
      break
    case "/search.html":
      console.log("Search Page")
      break
  }
  highlightActiveLink()
}
document.addEventListener("DOMContentLoaded", init)
