import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useCallback, useState } from 'react';
import Toggle from 'react-toggle';
import './ReactToggle.css';
import useFileSize from '../hooks/useFileSize';
import useClipboard from '../hooks/useClipboard';
import useContentStrings from '../hooks/useContentStrings';

function EmbedCode(props) {
  const { getReadableFS } = useFileSize();
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [copied, handleItemCopy] = useClipboard();
  const [customValue, setCustomValue] = useState(1);
  const [movieStrings, episodeStrings, totalSz] = useContentStrings(props.data, customValue);

  const filteredEpisodesList = props.data.filter(
    (episode) =>
      episode.name.endsWith('.mkv') ||
      episode.name.endsWith('.zip') ||
      episode.name.endsWith('.tar') ||
      episode.name.endsWith('.7z') ||
      episode.name.endsWith('.rar') ||
      episode.name.endsWith('.mp4')
  );

  const [isTitle, setIsTitle] = useState(true);
  const toggleTitle = () => {
    setIsTitle((isTitle) => !isTitle);
  };

  const seriesString =
    (isTitle
      ? `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>` +
        `\n<p style="text-align: center;"><span style="color: #000000;"><strong>${filteredEpisodesList[0].name.slice(0, -4).replace(/(S\d+)\s*E\d+/, '$1')}\n[<span style="color: #ff0000;">${getReadableFS(totalSz / filteredEpisodesList.length)}/<span style="color: #0000ff;">E</span></span>]</strong></span></p>\n`
      : '') +
    `<p style="text-align: center;"> ${episodeStrings.join(' ')} </p>` +
    (isTitle
      ? `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>\n`
      : '');

  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);
  const togglePreview = useCallback(() => {
    setIsPreviewEnabled((isPreviewEnabled) => !isPreviewEnabled);
  }, []);

  return (
    <div className="flex h-max flex-col content-center gap-3 rounded-md border border-white/20 bg-white/5 p-5">
      <span className=" text-center text-3xl font-bold">Embed Code</span>
      <Tabs>
        <div className="flex items-center justify-between">
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
          {activeTabIndex === 1 && (
            <div>
              <span>Start numbering from: </span>
              <input
                type="number"
                min={1}
                value={customValue}
                onChange={(e) => {
                  if (parseInt(e.target.value) < 1) {
                    setCustomValue(1);
                  } else setCustomValue(parseInt(e.target.value));
                }}
                className="w-30 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
              />
            </div>
          )}

          <div className="flex items-center gap-1 pr-2 ">
            {activeTabIndex === 1 && (
              <>
                <label htmlFor="toggle-title">Title</label>
                <Toggle
                  id="toggle-title"
                  defaultChecked
                  className="scale-75"
                  onChange={toggleTitle}
                ></Toggle>
              </>
            )}
            <label htmlFor="cheese-status">Embed preview</label>
            <Toggle id="cheese-status" className=" scale-75" onChange={togglePreview} />
          </div>
        </div>
        <div className="w-screen-lg relative max-w-screen-lg rounded-md border border-white/20 bg-white/5">
          <TabPanel>
            <div className="max-h-96 overflow-y-auto  p-10">{movieStrings.join('')}</div>
          </TabPanel>
          <TabPanel>
            <div className="max-h-96 overflow-y-auto  p-10">{seriesString}</div>
          </TabPanel>

          <div>
            <button
              onClick={() =>
                handleItemCopy(
                  'Embed Code',
                  activeTabIndex === 0 ? movieStrings.join('') : seriesString
                )
              }
              className="absolute right-0 top-0 mr-4 mt-4 text-xl text-white/50  hover:text-white"
            >
              <FiCopy></FiCopy>
            </button>
          </div>
        </div>
      </Tabs>
      {isPreviewEnabled ? (
        <div className="w-screen-lg max-h-96 max-w-screen-lg overflow-auto rounded-md">
          {activeTabIndex === 0 ? (
            movieStrings.map((html, index) => (
              <div
                className="whitespace-pre-wrap bg-white/80 pb-5 text-black"
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))
          ) : (
            <div
              className="whitespace-pre-wrap bg-white/80 text-black"
              dangerouslySetInnerHTML={{ __html: seriesString }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default EmbedCode;
