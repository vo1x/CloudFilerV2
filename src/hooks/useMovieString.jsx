import { useState, useEffect } from 'react';
import useFileSize from './useFileSize';

export default function useMovieStrings(data) {

  const [movieStrings, setMovieStrings] = useState([]);

  const { getReadableFS } = useFileSize();


  useEffect(() => {
    const updateMoviesString = () => {
      const sortedMovieList = data;
      const movieString = sortedMovieList
        .filter((movie) => movie.name.endsWith('.mkv') || movie.name.endsWith('.mp4'))
        .map(
          (movie, index) =>
            `${index === 0 ? '\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>\n' : ''}` +
            `<p style="text-align: center;"><strong><span style="color: #000000;">${movie.name}</span>` +
            `\n<span style="color: #000000;">[</span><span style="color: #ff0000;">${getReadableFS(movie.size)}</span><span style="color: #000000;">]</span></strong></p>` +
            `\n<p style="text-align: center;">[maxbutton id="1" url="${movie.webContentLink}" ]</p>` +
            `\n${index === sortedMovieList.length - 1 ? '<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>' : '<p style="text-align: center;">[mks_separator style="solid" height="2"]</p>'}`
        );
      setMovieStrings(movieString);
    };


    updateMoviesString();
  }, [data]);

  return [movieStrings];
}
