import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import useClipboard from '../hooks/useClipboard';
import { useState } from 'react';
import useFileSize from '../hooks/useFileSize';
export default function FolderInfo({ folderData, movieStrings, episodeStrings }) {
  const toggleIsExpanded = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  const [copied, handleItemCopy] = useClipboard();
  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const { getReadableFS } = useFileSize();

  return (
    <div className="relative h-max rounded-md border border-white/20 bg-white/5 p-3">
      <div className="flex items-center justify-between p-2">
        <span className="text-xl font-bold">Folder Information</span>

        <button onClick={() => toggleIsExpanded} className="text-2xl">
          {!isExpanded ? <FiChevronDown /> : <FiChevronUp />}
        </button>
      </div>

      <div className="mb-3  flex items-center justify-between border-b border-b-white/20 p-2 text-lg">
        <span>
          {' '}
          Found <span className="font-bold">{folderData.length}</span> Files
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
          ? folderData.map((data, i) => (
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
          : folderData
              .filter((element) => element.name.toLowerCase().includes(inputValue.toLowerCase()))
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
  );
}