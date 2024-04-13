import { useState, useEffect } from 'react';

export default function useContentStrings(data) {
  const [episodeStrings, setEpisodeStrings] = useState([]);
  const [movieStrings, setMovieStrings] = useState([]);
  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const updateSeriesString = () => {
      const filteredEpisodesList = data.filter(
        (episode) =>
          episode.name.endsWith('.mkv') ||
          episode.name.endsWith('.zip') ||
          episode.name.endsWith('.tar') ||
          episode.name.endsWith('.7z') ||
          episode.name.endsWith('.rar') ||
          episode.name.endsWith('.mp4')
      );
      var totalSz = filteredEpisodesList.reduce((acc, epi) => {
        acc += parseInt(epi.size);
        return acc;
      }, 0);
      const episodesList = filteredEpisodesList.map(
        (episode, index) =>
          `[maxbutton id="${
            episode.name.endsWith('.zip') ||
            episode.name.endsWith('.tar') ||
            episode.name.endsWith('.7z') ||
            episode.name.endsWith('.rar')
              ? '3'
              : '2'
          }" url="${episode.webContentLink}" ${
            episode.name.endsWith('.zip') ||
            episode.name.endsWith('.tar') ||
            episode.name.endsWith('.7z') ||
            episode.name.endsWith('.rar')
              ? ''
              : `text="Episode ${index + 1}"`
          }  ]`
      );
      setEpisodeStrings(episodesList);
    };

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
    updateSeriesString();
  }, []);

  return [movieStrings, episodeStrings];
}
