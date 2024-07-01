import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';
import FolderItem from './FolderItem';
import useFileSize from '../../../hooks/useFileSize';
// import useFileInformation from '../hooks/useFileInformation'; Maybe will use in the future
export default function FolderInfo({ folderData, episodeStrings, nameSortedMovieStrings }) {
  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  // const {extractFileInformation} = useFileInformation();
  const { getReadableFS } = useFileSize();

  return (
    <div className="relative h-max max-w-96 rounded-md border border-white/20 bg-white/5 p-3 lg:max-w-screen-lg">
      <div className="flex items-center justify-between p-2">
        <span className="font-bold lg:text-xl">Folder Information</span>

        <button onClick={() => toggleIsExpanded} className="lg:text-2xl">
          {!isExpanded ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      </div>

      <div className="mb-2 flex items-center justify-between border-b border-b-white/20 p-2 lg:text-lg">
        <span>
          Found <span className="font-bold">{folderData.length}</span> Files
        </span>

        <input
          type="text"
          className="w-30 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
          placeholder="Enter a query"
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div
        className={`gap grid max-h-96 grid-flow-row gap-3 overflow-auto p-3 ${isExpanded ? '' : 'hidden'} `}
      >
        {inputValue === ''
          ? folderData.map((item, i) => (
              <FolderItem
                item={item}
                key={item.id}
                movieStrings={nameSortedMovieStrings}
                episodeStrings={episodeStrings}
                index={i}
              />
            ))
          : folderData
              .filter((element) => element.name.toLowerCase().includes(inputValue.toLowerCase()))
              .map((item, i) => (
                <FolderItem
                  item={item}
                  key={item.id}
                  movieStrings={nameSortedMovieStrings}
                  episodeStrings={episodeStrings}
                  index={i}
                />
              ))}
      </div>
    </div>
  );
}
