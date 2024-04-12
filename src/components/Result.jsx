import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import {
  FiVideo,
  FiFolder,
  FiCopy,
  FiInfo,
  FiArrowDown,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import EmbedCode from './EmbedCode';
import { useCallback, useState } from 'react';
function Result(props) {
  const handleItemCopy = (type, item) => {
    navigator.clipboard.writeText(item).then(() => {
      const notify = () => {
        toast.success(`${type} copied!`, {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };
      notify();
    });
  };
  const [episodeStrings, setEpisodeStrings] = useState([]);
  const [movieStrings, setMovieStrings] = useState([]);

  const updateSeriesString = () => {
    const filteredEpisodesList = props.data.filter(
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
    const sortedMovieList = props.data;
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

  useEffect(() => {
    updateMoviesString();
    updateSeriesString();
  }, [props.data]);

  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const toggleIsExpanded = useCallback(() => {
    setIsExpanded((isExpanded) => !isExpanded);
  }, []);

  return (
    <>
      <div className=" flex flex-col gap-5 p-5">
        <div className="relative h-max rounded-md border border-white/20 bg-white/5 p-3">
          <div className="flex items-center justify-between p-2">
            <span className="text-xl font-bold">Folder Information</span>

            <button onClick={toggleIsExpanded} className="text-2xl">
              {!isExpanded ? <FiChevronDown /> : <FiChevronUp />}
            </button>
          </div>

          <div className="mb-3  flex items-center justify-between border-b border-b-white/20 p-2 text-lg">
            <span>
              {' '}
              Found <span className="font-bold">{props.data.length}</span> Files
            </span>

            <input
              type="text"
              className="w-30 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
              placeholder="Enter a query"
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* <span className="text-sm text-white/50">Files are sorted by name</span> */}
          </div>
          <ul
            className={`gap grid max-h-96 grid-flow-row gap-3 overflow-auto p-3 ${isExpanded ? '' : 'hidden'} `}
          >
            {inputValue === ''
              ? props.data.map((data, i) => (
                  <li key={data.id} className="rounded-md border border-white/20 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div>
                          <span
                            className="font-bold hover:cursor-pointer hover:text-blue-200"
                            onClick={(e) => handleItemCopy('File Name', e.target.innerText)}
                          >
                            {data.name}
                          </span>
                        </div>
                        <div>
                          <span
                            className="hover:cursor-pointer hover:text-blue-200"
                            onClick={(e) => handleItemCopy('File Size', e.target.innerText)}
                          >
                            {getReadableFS(data.size)}
                          </span>
                        </div>
                        <div>
                          <span
                            className="hover:cursor-pointer hover:text-blue-200"
                            onClick={(e) => handleItemCopy('File URL', e.target.innerText)}
                          >
                            {data.webContentLink}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="mx-4 h-20 border border-neutral-700"></span>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => handleItemCopy(e.target.innerText, movieStrings[i])}
                            className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
                          >
                            Movie Code
                          </button>
                          <button
                            onClick={(e) => handleItemCopy(e.target.innerText, episodeStrings[i])}
                            className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
                          >
                            Series Code
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : props.data
                  .filter((element) =>
                    element.name.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((data, i) => (
                    <li key={data.id} className="rounded-md border border-white/20 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div>
                            <span
                              className="font-bold hover:cursor-pointer hover:text-blue-200"
                              onClick={(e) => handleItemCopy('File Name', e.target.innerText)}
                            >
                              {data.name}
                            </span>
                          </div>
                          <div>
                            <span
                              className="hover:cursor-pointer hover:text-blue-200"
                              onClick={(e) => handleItemCopy('File Size', e.target.innerText)}
                            >
                              {getReadableFS(data.size)}
                            </span>
                          </div>
                          <div>
                            <span
                              className="hover:cursor-pointer hover:text-blue-200"
                              onClick={(e) => handleItemCopy('File URL', e.target.innerText)}
                            >
                              {data.webContentLink}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="mx-4 h-20 border border-neutral-700"></span>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={(e) => handleItemCopy(e.target.innerText, movieStrings[i])}
                              className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
                            >
                              Movie Code
                            </button>
                            <button
                              onClick={(e) => handleItemCopy(e.target.innerText, episodeStrings[i])}
                              className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
                            >
                              Series Code
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
          </ul>
        </div>
        {props.data.some((file) => file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) && (
          <EmbedCode data={props.data}></EmbedCode>
        )}
      </div>
    </>
  );
}

export default Result;

// [ { "webContentLink": "https://drive.google.com/uc?id=1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP&export=download",
// "size": "7453418553", "id": "1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP",
// "name": "Decoys (2004) 1080p AMZN WEB-DL [Hindi DD 2.0 + English DDP 5.1] x264-ABM[VoLx].mkv" } ]
