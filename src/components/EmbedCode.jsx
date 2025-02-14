import { Copy } from 'lucide-react';
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
  const { movieStrings, episodeStrings, totalSz } = useContentStrings(props.data, customValue);

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
    `${episodeStrings.join(' ')}` +
    (isTitle
      ? `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>\n`
      : '');

  return (
    <div className="flex h-max max-w-96 flex-col content-center gap-3 rounded-2xl bg-[#131314] p-5">
      <span className=" text-center text-xl font-bold lg:text-3xl">Embed Code</span>
      <Tabs>
        <div className="mb-4 flex flex-col items-start justify-center gap-4 lg:justify-between lg:gap-4">
          <TabList className="flex w-max self-center rounded-md border border-white/20 bg-white/5 text-sm ">
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
            <div className="flex flex-col">
              <span>Start numbering from: </span>
              <input
                type="number"
                min={1}
                value={customValue || 1}
                onChange={(e) => {
                  if (parseInt(e.target.value) < 1 || !e.target.value) {
                    setCustomValue(1);
                  } else setCustomValue(parseInt(e.target.value));
                }}
                className="w-30 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
              />
            </div>
          )}

          {activeTabIndex === 1 && (
            <div className="flex items-center">
              <label htmlFor="toggle-title">Title</label>
              <Toggle
                id="toggle-title"
                defaultChecked={isTitle}
                className="scale-75"
                onChange={toggleTitle}
              ></Toggle>
            </div>
          )}
        </div>
        <div className="w-screen-lg relative max-w-screen-lg rounded-md border border-white/20 bg-white/5">
          <TabPanel>
            <div className="max-h-96 overflow-y-auto p-8">{movieStrings.join('')}</div>
          </TabPanel>
          <TabPanel>
            <div className="max-h-96 overflow-y-auto p-4">{seriesString}</div>
          </TabPanel>
        </div>
      </Tabs>
      <div className="my-1 w-full border border-neutral-800"></div>
      <div>
        <button
          onClick={() =>
            handleItemCopy(
              'Embed Code',
              activeTabIndex === 0 ? movieStrings.join('') : seriesString,
              true
            )
          }
          className=" text-white/50  hover:text-white"
        >
          <Copy></Copy>
        </button>
      </div>
    </div>
  );
}

export default EmbedCode;
