import { useState } from 'react';
import Result from './Result';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiLoader } from 'react-icons/fi';

function SearchBar() {
  const [extractResults, setExtractResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;

  const [inputValue, setInputValue] = useState('');
  const [prevFolderID, setPrevFolderID] = useState(null);
  const handleExtractButton = (folderURL) => {
    if (folderURL === '') {
      return toast.error('Folder URL is required', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    if (
      !folderURL.startsWith('https://drive.google.com/') &&
      !folderURL.startsWith('https://drive.usercontent.google.com/')
    ) {
      return toast.error('Invalid URL format', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    //https://drive.google.com/file/d/1s72LKrT1-SAtx5tVdXvHxcjR7KO8F_an/view?usp=drive_link
    const isFileUrl =
      /(?:\/(?:drive\/)?(?:u\/\d+\/)?(?:file\/d\/|uc\?id=)|https:\/\/drive\.usercontent\.google\.com\/download\?id=)[a-zA-Z0-9_-]+\/?/.test(
        folderURL
      );

    const isFolderUrl = /(?:\/(?:drive\/)?(?:u\/\d+\/)?folders\/[a-zA-Z0-9_-]+\/?)/.test(folderURL);

    var fID = '';
    var type = '';
    if (isFileUrl) {
      // const fileRegex = /(?:\/(?:drive\/)?(?:u\/\d+\/)?(?:file\/d\/|uc\?id=))([a-zA-Z0-9_-]+)/;
      const fileRegex =
        /(?:\/(?:drive\/)?(?:u\/\d+\/)?(?:file\/d\/|uc\?id=)|https:\/\/drive\.usercontent\.google\.com\/download\?id=)([a-zA-Z0-9_-]+)/;

      fID = folderURL.match(fileRegex)[1];
      type = 'file';
    } else if (isFolderUrl) {
      const regexFolder = /\/(?:drive\/)?(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/;
      fID = folderURL.match(regexFolder)[1];
      type = 'folder';
    }

    if (fID === prevFolderID) {
      return toast.warning('Folder already extracted!', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    const fetchInfo = async (folderID) => {
      setLoading(true);
      try {
        var url = '';
        if (type === 'file') {
          url = `https://www.googleapis.com/drive/v3/files/${folderID}?supportsAllDrives=true&includeItemsFromAllDrives=true&fields=id,name,size,webContentLink,mimeType&key=${apiKey}`;
        } else if (type === 'folder') {
          url = `https://www.googleapis.com/drive/v3/files?q='${folderID}'+in+parents&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=1000&orderBy=name&fields=files(id,name,size,webContentLink,mimeType)&key=${apiKey}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Invalid URL');
          else throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        if (type === 'file') {
          setExtractResults([data]);
        } else if (type === 'folder') {
          setExtractResults(data.files);
        }
      } catch (error) {
        toast.error(`${error}`, { theme: 'colored', autoClose: 2000 });
        setPrevFolderID('');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo(fID).then(() => setPrevFolderID(fID));
  };

  return (
    <>
      <div>
        <div className="flex place-content-center gap-3 ">
          <input
            type="text"
            className=" ml-2 w-3/5 rounded-md border border-white/20 bg-white/5 p-2 outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            placeholder="Folder URL"
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                let folderURL = inputValue;
                if (folderURL.endsWith('/')) {
                  folderURL = folderURL.slice(0, -1);
                }
                handleExtractButton(folderURL);
              }
            }}
          />
          <button
            onClick={() => {
              let folderURL = inputValue;
              if (folderURL.endsWith('/')) {
                folderURL = folderURL.slice(0, -1);
              }
              handleExtractButton(folderURL);
            }}
            className="flex items-center gap-1 rounded-md bg-blue-600 p-2 py-1 font-bold transition-all duration-300 hover:bg-blue-700"
          >
            {loading ? <FiLoader className=" animate-spin"></FiLoader> : null}
            <span>Extract</span>
          </button>
          {extractResults.length > 0 ? (
            <button
              onClick={() => {
                setExtractResults([]);
                setInputValue('');
                setPrevFolderID(undefined);
                setLoading(false);
              }}
              className="rounded-md border border-red-500 p-2 py-1 font-bold text-red-500 outline-none transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <span>Clear</span>
            </button>
          ) : null}
        </div>
        {extractResults.length > 0 && <Result data={extractResults} />}
      </div>
    </>
  );
}

export default SearchBar;
