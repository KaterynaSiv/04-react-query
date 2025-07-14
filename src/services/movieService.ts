import axios from "axios";
import type { Movie } from "../types/movie";

const myMovieToken = import.meta.env.VITE_TMDB_TOKEN;

const baseUrl = "https://api.themoviedb.org/3/search/movie";

const axiosParams = (query: string, page: number) => ({
  params: {
    query,
    include_adult: false,
    page,
  },
  headers: {
    Authorization: `Bearer ${myMovieToken}`,
  },
});

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    baseUrl,
    axiosParams(query, page)
  );
  return response.data;
};
