import { FiCopy } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useState } from 'react';

function EmbedCode(props) {
  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleCodeCopy = (item) => {
    navigator.clipboard.writeText(item).then(() => {
      const notify = () => {
        toast.success('Embed code copied!', {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };

      notify();
    });
    console.log(item);
  };

  const sortedMovieList = props.data.slice().sort((m1, m2) => m2.size - m1.size);
  const movieString = sortedMovieList
    .filter((movie) => movie.name.endsWith('.mkv') || movie.name.endsWith('.mp4'))
    .map(
      (movie) =>
        `<p style="text-align: center;"><strong><span style="color: #000000;">${movie.name} </span>
        <span style="color: #000000;">[</span><span style="color: #ff0000;">${getReadableFS(movie.size)}</span><span style="color: #000000;">]</span></strong></p>
        <p style="text-align: center;">[maxbutton id="1" url="${movie.webContentLink}" ]</p>
        <p style="text-align: center;">[mks_separator style="solid" height="2"]</p>`
    );
  console.log(movieString);
  const episodesList = props.data
    .filter((episode) => episode.name.endsWith('.mkv') || episode.name.endsWith('.mp4'))
    .map(
      (episode, index) =>
        `[maxbutton id="2" url="${episode.webContentLink}" text="Episode ${index + 1}" ]`
    );

  const seriesString = `<p style="text-align: center;">` + episodesList.join(' ') + `</p>`;

  return (
    <div className="flex h-max flex-col content-center gap-3 rounded-md border border-white/20 bg-white/5 p-5">
      <span className=" text-center text-3xl font-bold">Embed Code</span>
      <Tabs>
        <TabList className="my-3 flex w-max rounded-md border border-white/20 bg-white/5 text-sm ">
          <Tab
            className={`w-max cursor-pointer rounded-l-md px-5 py-2 ${activeTabIndex === 0 ? 'bg-white text-black' : ''}`}
            onClick={() => setActiveTabIndex(0)}
            key={'movieTab'}
          >
            Movie
          </Tab>
          <span className="border border-white/20"></span>
          <Tab
            className={`w-max cursor-pointer rounded-r-md px-5 py-2 ${activeTabIndex === 1 ? 'bg-white text-black' : ''}`}
            onClick={() => setActiveTabIndex(1)}
            key={'seriesTab'}
          >
            Series
          </Tab>
        </TabList>

        <div className="w-screen-lg relative max-w-screen-lg rounded-md border border-white/20 bg-white/5">
          <TabPanel>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap p-10">
              {movieString.join('')}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap p-10">{seriesString}</div>
          </TabPanel>

          <div>
            <button
              onClick={() =>
                handleCodeCopy(activeTabIndex === 0 ? movieString.join('') : seriesString)
              }
              className="absolute right-0 top-0 mr-4 mt-4 text-xl text-white/50  hover:text-white"
            >
              <FiCopy></FiCopy>
            </button>
          </div>
        </div>
        {/* <div>preview apnel</div> */}
      </Tabs>
    </div>
  );
}

export default EmbedCode;
