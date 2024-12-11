import useFileSize from '../../hooks/useFileSize';
import { MdMovie, MdFolder } from 'react-icons/md';
import useContentStrings from '../../hooks/useContentStrings';
import useMovieStrings from '../../hooks/useMovieString';
import Button from './Button';
import useClipboard from '../../hooks/useClipboard';
import Row from './Row';

import { SearchIcon, Link2 } from 'lucide-react';
import { memo } from 'react';

const FileTable = memo(({ extractResults }) => {
  console.log(extractResults);
  const { getReadableFS } = useFileSize();

  const handleFindButtonClick = (fileName) => {
    const regExp = /^(.*?)\s[Ss]\d{2}(?:[Ee]\d{2})?/;

    const match = fileName.match(regExp);
    console.log(fileName);
    if (match[1]) {
      return window.open(`https://uhdmovies.icu/search/${match[1]}`, '_blank');
    }
  };

  const [copied, handleItemCopy] = useClipboard();

  return (
    <div className="h-full overflow-auto pr-6">
      <table className="w-full table-auto">
        <thead className="sticky top-0 z-10 bg-[#131314]">
          <tr className=" text-neutral-300">
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">File size</th>
            <th className="px-4 py-3 text-left">HTML</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {extractResults.map((item, i) => (
            <Row rowData={item} key={i}></Row>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default FileTable;
