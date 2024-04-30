import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
function Field(props) {
  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [seriesPreviewStrings, setSeriesPreviewString] = useState('');
  const [moviesPreviewStrings, setMoviesPreviewStrings] = useState('');
  const [embedString, setEmbedString] = useState('');
  const [episodeStrings, setEpisodeStrings] = useState([]);
  const [movieStrings, setMovieStrings] = useState([]);
  const handleCodeCopy = (item) => {
    try {
      navigator.clipboard.writeText(item).then(() => {
        const notify = () => {
          toast.success(`Field embed code copied!`, {
            theme: 'colored',
            autoClose: 2000,
            position: 'bottom-right'
          });
        };

        notify();
      });
    } catch (error) {
      const notify = () => {
        toast.error(`Error:${error}`, {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };

      notify();
    }
  };

  const updateSeriesString = () => {
    setSeriesPreviewString('');
    const filteredEpisodesList = props.data.filter(
      (episode) => episode.name.endsWith('.mkv') || episode.name.endsWith('.mp4')
    );
    var totalSz = filteredEpisodesList.reduce((acc, epi) => {
      acc += parseInt(epi.size);
      return acc;
    }, 0);

    const episodesList = filteredEpisodesList.map(
      (episode, index) =>
        `[maxbutton id="2" url="${episode.webContentLink}" text="Episode ${index + 1}"]`
    );
    setEpisodeStrings(episodesList);

    const seriesString =
      `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>` +
      `\n<p style="text-align: center;"><span style="color: #000000;"><strong>${filteredEpisodesList[0].name.slice(0, -4).replace(/(S\d+)\s*E\d+/, '$1')}\n[<span style="color: #ff0000;">${getReadableFS(totalSz / filteredEpisodesList.length)}/<span style="color: #0000ff;">E</span></span>]</strong></span></p>\n` +
      `<p style="text-align: center;"> ${episodesList.join(' ')} </p>` +
      `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>`;
    setSeriesPreviewString(seriesString);
    setEmbedString(seriesString);
  };

  const updateMoviesString = () => {
    setMoviesPreviewStrings('');

    const sortedMovieList = props.data.slice().sort((m1, m2) => m2.size - m1.size);
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
    console.log(movieString.join(''));
    setMovieStrings(movieString);
    setMoviesPreviewStrings(movieString.join(''));
    setEmbedString(movieString.join(''));
  };

  useEffect(() => {
    if (props.contentType === 'movie') {
      updateMoviesString();
    } else if (props.contentType === 'series') {
      updateSeriesString();
    }
  }, [props.contentType]);
  return (
    <>
      <div className="flex flex-col rounded-md border border-white/20 bg-white/5 p-2">
        <div className="flex items-center justify-between ">
          <span className="font-bold text-neutral-100">Field {props.fieldIndex} </span>
        </div>
        <span className="my-2 border-b border-neutral-500"></span>

        <div className="overflow-hidden whitespace-normal break-all">
          {props.data.map((sub, i) => (
            <div className="mb-2 flex justify-center rounded-md border border-neutral-700 bg-neutral-700 p-1 text-sm">
              <div>{sub.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Field;
