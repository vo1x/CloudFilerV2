import { useState } from 'react';

import { SearchIcon, X, Loader2 } from 'lucide-react';

import { toast } from 'sonner';

import useGDrive from '../hooks/useGDrive';

function SearchBar({ extractResults, setExtractResults }) {
  const { fetchGDriveDetails, extractGDriveId, isFetched, isFetching, isError } = useGDrive();
  const [inputValue, setInputValue] = useState('');
  const [prevFolderID, setPrevFolderID] = useState(null);

  const handleExtractButton = async (folderURL) => {
    if (isFetching) {
      return;
    }

    if (folderURL === '') {
      return toast.error('Folder URL is required');
    }

    try {
      try {
        const currentFolderID = extractGDriveId(folderURL);

        if (currentFolderID === prevFolderID) {
          return toast.warning('This folder has already been processed');
        }

        setPrevFolderID(currentFolderID);
      } catch (error) {
        console.error('Error extracting Google Drive ID:', error.message);
        return toast.error(`${error.message}`);
      }

      const data = await fetchGDriveDetails(folderURL);

      if (isError) {
        return toast.error('Error retrieving folder details');
      }

      if (data) {
        setExtractResults(data);
        console.log('Retrieved data:', data);
        return toast.success('Folder details retrieved successfully');
      }
    } catch (error) {
      console.error('Error in handleExtractButton:', error);
      return toast.error('An unexpected error occurred');
    }
  };

  const handleClearButton = () => {
    setInputValue('');
    setPrevFolderID(null);
    setExtractResults(null);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex w-80 items-center  gap-2 rounded-full bg-[#282A2C] p-3 px-4  text-sm lg:w-[500px] lg:text-base">
          <button onClick={() => handleExtractButton(inputValue)} className="outline-none ">
            {isFetching ? (
              <Loader2 size={28} className="animate-spin" />
            ) : (
              <SearchIcon className="text-neutral-400" size={28} />
            )}
          </button>

          <input
            type="text"
            className="h-full w-full bg-inherit py-1 outline-none placeholder:text-neutral-400"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder="Folder URL"
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExtractButton(inputValue);
              }
            }}
          />
          {!isFetching && isFetched && inputValue !== '' && (
            <div
              className="cursor-pointer text-neutral-400 transition-all duration-150 hover:text-red-500"
              onClick={handleClearButton}
            >
              <X size={28} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
