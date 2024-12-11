import { useState } from 'react';
import EmbedCode from '../components/EmbedCode';

import SearchBar from '../components/SearchBar';

import FileTable from '../components/FileTable/FileTable';

function Indexer() {
  const [extractResults, setExtractResults] = useState([]);

  return (
    <>
      <div className="flex h-screen w-screen flex-col gap-4 overflow-hidden  bg-[#1B1B1B] p-4">
        <SearchBar extractResults={extractResults} setExtractResults={setExtractResults} />
        <div className="flex h-full w-full gap-4 overflow-auto">
          <div className="flex h-full w-full flex-col gap-4 rounded-2xl bg-[#131314] p-6 pr-0 ">
            <div className="max-w-96 truncate pl-4 text-3xl">{extractResults?.folderName}</div>
            {extractResults?.files?.length > 0 && (
              <FileTable extractResults={extractResults.files} />
            )}
          </div>

          {extractResults?.files?.filter((item) => item.mimeType !== 'folder')?.length > 0 && (
            <EmbedCode data={extractResults.files} />
          )}
        </div>
      </div>
    </>
  );
}

export default Indexer;
