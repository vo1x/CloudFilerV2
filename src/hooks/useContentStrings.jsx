import { useState, useEffect } from 'react';
import useFileSize from './useFileSize';

export default function useContentStrings(data, episodeStartIndex) {
  const [episodeStrings, setEpisodeStrings] = useState([]);
  const [movieStrings, setMovieStrings] = useState([]);

  const { getReadableFS } = useFileSize();

  const extractEpisode = (fileName) => {
    const episodeReg = /S\d{2}E(\d{2})/;
    const match = episodeReg.exec(fileName);
    const epNum = match ? parseInt(match[1], 10) : null;
    return epNum;
  };

  const [totalSz, setTotalSz] = useState(0);
  const validExtensions = ['.mkv', '.zip', '.tar', '.7z', '.rar', '.mp4'];
  const compressedExtensions = ['.zip', '.tar', '.7z', '.rar'];
  useEffect(() => {
    const updateSeriesString = () => {
      const filteredEpisodesList = data.filter((episode) =>
        validExtensions.some((extension) => episode.name.endsWith(extension))
      );
      setTotalSz(
        filteredEpisodesList.reduce((acc, epi) => {
          acc += parseInt(epi.size);
          return acc;
        }, 0)
      );

      const episodesList = filteredEpisodesList.map(
        (episode, index) =>
          `[maxbutton ${
            compressedExtensions.some((extension) => episode.name.endsWith(extension))
              ? `id="3"`
              : `id="2" ${
                  episodeStartIndex
                    ? `text="Episode ${index + episodeStartIndex}"`
                    : `text="Episode ${extractEpisode(episode.name)}"`
                }`
          } url="${episode.webContentLink}" ]`
      );
      setEpisodeStrings(episodesList);
    };

    const updateMoviesString = () => {
      const sortedMovieList = data;
      const movieString = sortedMovieList
        .filter((movie) => movie.name.endsWith('.mkv') || movie.name.endsWith('.mp4'))
        .sort((a, b) => b.size - a.size)
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
  }, [episodeStartIndex]);

  return [movieStrings, episodeStrings, totalSz];
}
