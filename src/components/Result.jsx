import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [isExpanded, setIsExpanded] = useState(true);

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
            <span className="text-sm text-white/50">Files are sorted by name</span>
          </div>
          <ul
            className={`gap grid max-h-96 grid-flow-row gap-3 overflow-auto p-3 ${isExpanded ? '' : 'hidden'} `}
          >
            {props.data.map((data) => (
              <li key={data.id} className="rounded-md border border-white/20 bg-white/5 p-4">
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
              </li>
            ))}
          </ul>
        </div>
        <EmbedCode data={props.data}></EmbedCode>
      </div>
      <ToastContainer />
    </>
  );
}

export default Result;

// [ { "webContentLink": "https://drive.google.com/uc?id=1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP&export=download",
// "size": "7453418553", "id": "1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP",
// "name": "Decoys (2004) 1080p AMZN WEB-DL [Hindi DD 2.0 + English DDP 5.1] x264-ABM[VoLx].mkv" } ]
