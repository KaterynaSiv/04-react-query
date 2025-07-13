import axios from "axios";
import type { Movie } from "../types/movie";

const myMovieToken = import.meta.env.VITE_TMDB_TOKEN;

const baseUrl = "https://api.themoviedb.org/3/search/movie";

const axiosParams = (query: string) => ({
  params: {
    query,
    include_adult: false,
  },
  headers: {
    Authorization: `Bearer ${myMovieToken}`,
  },
});

interface MovieResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(baseUrl, axiosParams(query));
  return response.data.results;
};
