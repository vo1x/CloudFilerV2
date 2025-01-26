import useClipboard from '../../hooks/useClipboard';
import Button from './Button';
import useFileSize from '../../hooks/useFileSize';
import { MdMovie, MdFolder } from 'react-icons/md';

import { SearchIcon, Link2 } from 'lucide-react';
const Row = ({ rowData, movieString, seriesString }) => {
  const [copied, handleItemCopy] = useClipboard();
  const { getReadableFS } = useFileSize();

  const handleFindButtonClick = (fileName) => {
    const regExp = /^(.*?)\s[Ss]\d{2}(?:[Ee]\d{2})?/;

    const match = fileName.match(regExp);
    console.log(fileName);
    if (match[1]) {
      return window.open(`https://uhdmovies.icu/search/${match[1]}`, '_blank');
    }
  };

  return (
    <tr
      key={rowData.id}
      className={`border-t border-neutral-700 hover:bg-[#222222] ${rowData.mimeType === 'folder' ? 'cursor-pointer' : ''}`}
    >
      <td className="px-4 text-left font-semibold">
        <div className="flex items-center gap-3">
          {rowData.mimeType === 'folder' ? (
            <MdFolder size={24} color="#C4C7C5" />
          ) : (
            <MdMovie size={24} color="#F28B82" />
          )}

          <div
            onClick={(e) => handleItemCopy('File Name', e.target.innerHTML, true)}
            className=" cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          >
            {rowData.name}
          </div>
        </div>
      </td>
      <td
        className="cursor-pointer px-4 text-left text-neutral-400"
        onClick={(e) => handleItemCopy('File Size', e.target.innerHTML, true)}
      >
        {getReadableFS(rowData.size) ?? `--`}
      </td>
      <td className="px-4 py-3 text-left">
        <div className="flex justify-start space-x-2">
          <Button
            onClick={() => handleItemCopy('Movie Code', movieString, true)}
            className="border-yellow-500 text-yellow-500  hover:bg-yellow-500 hover:bg-opacity-25"
          >
            Movie
          </Button>
          <Button
            onClick={() => handleItemCopy('Series Code', seriesString, true)}
            className="border-teal-500 text-teal-500  hover:bg-teal-500 hover:bg-opacity-25"
          >
            Series
          </Button>
        </div>
      </td>
      <td className="flex items-center gap-2 px-4 py-3 pr-0 text-left">
        <Button
          onClick={() => handleFindButtonClick(rowData.name.replace(/\./g, ' '))}
          className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:bg-opacity-25"
        >
          <SearchIcon size={20} />
          <span>Find</span>
        </Button>
        <Button
          onClick={() => handleItemCopy('Download Link', rowData.webContentLink, true)}
          className={`flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:bg-opacity-25`}
        >
          <Link2 size={20} />
          <span>Link</span>
        </Button>
      </td>
    </tr>
  );
};

export default Row;
