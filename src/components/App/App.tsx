import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";

import { fetchMovies } from "../../services/movieService";
import { useState } from "react";

import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { MoonLoader } from "react-spinners";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (query: string) => {
    setMovies([]);
    setIsLoading(true);
    setError(false);

    try {
      const fetchedMovies = await fetchMovies(query);

      if (!fetchedMovies.length) {
        toast.error("No movies found for your request 🤷‍♀️");
        return;
      }
      setMovies(fetchedMovies);
    } catch {
      setError(true);
      toast.error("Whoops... Please try again later ☹️");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {movies.length === 0 && !isLoading && !error && (
        <p className={styles.subtitle}>
          Please enter a movie title to start search...
        </p>
      )}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Loader />
          <MoonLoader size={50} color="#fff" />
        </div>
      )}

      {error && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster />
    </div>
  );
}
