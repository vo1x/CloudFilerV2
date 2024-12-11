import { useState } from 'react';

import { SearchIcon, XIcon, Loader2 } from 'lucide-react';

import { toast } from 'react-toastify';

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
      return toast.error('Folder URL is required', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    const currentFolderID = extractGDriveId(folderURL);
    if (currentFolderID === prevFolderID) {
      return toast.info('This folder has already been processed', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    try {
      const data = await fetchGDriveDetails(folderURL);

      if (isError) {
        return toast.error('Error retrieving folder details', {
          theme: 'colored',
          autoClose: 2000,
          position: 'top-right'
        });
      }

      if (data) {
        setPrevFolderID(data.folderID);
        setExtractResults(data);
        console.log('Retrieved data:', data);
        return toast.success('Folder details retrieved successfully', {
          theme: 'colored',
          autoClose: 2000,
          position: 'top-right'
        });
      }
    } catch (error) {
      console.error('Error in handleExtractButton:', error);
      return toast.error('An unexpected error occurred', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="flex w-80 items-center gap-2 rounded-full bg-[#282A2C] p-3 px-4  text-sm lg:w-[500px] lg:text-base">
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
          {extractResults?.length > 0 ? (
            <button
              onClick={() => {
                setExtractResults([]);
                setInputValue('');
                setPrevFolderID(undefined);
              }}
            >
              <XIcon className="text-red-400" size={26} />
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
