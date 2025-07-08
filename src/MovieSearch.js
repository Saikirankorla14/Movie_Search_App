import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MovieSearch.css";

const MovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "55af7b0a"; // 👈 Only use the API key (not full URL)

  const searchMovies = async (title) => {
    if (!title.trim()) {
      setError("Please enter a movie title");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}`
      );

      if (response.data.Response === "False") {
        setError(response.data.Error || "No movies found!");
        setMovies([]);
      } else {
        setMovies(response.data.Search);
        setError("");
      }
    } catch (err) {
      setError("API request failed. Try again later.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMovies("Avengers"); // Default search
  }, []);

  return (
    <div className="movie-search-container">
      <h1>Movie Search App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && searchMovies(searchTerm)}
        />
        <button onClick={() => searchMovies(searchTerm)} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie-card">
            <img
              src={
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/300x450?text=No+Poster"
              }
              alt={movie.Title}
            />
            <div className="movie-info">
              <h3>{movie.Title}</h3>
              <p>Year: {movie.Year}</p>
              <p>Type: {movie.Type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieSearch;
