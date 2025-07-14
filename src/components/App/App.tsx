import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { MoonLoader } from "react-spinners";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results;
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isError) {
      toast.error("Whoops... Please try again later ☹️");
    } else if (isSuccess && movies?.length === 0) {
      toast.error("No movies found for your request 🤷‍♀️");
    }
  }, [isError, isSuccess, movies?.length]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {!query && (
        <p className={styles.subtitle}>
          Please enter a movie title to start search...
        </p>
      )}

      {movies && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
          <MovieGrid movies={movies} onSelect={handleSelect} />
        </>
      )}

      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Loader />
          <MoonLoader size={50} color="#fff" />
        </div>
      )}

      {isError && <ErrorMessage />}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster />
    </div>
  );
}
