import { memo } from 'react';

import Row from './Row';
import useContentStrings from '../../hooks/useContentStrings';

const FileTable = memo(({ extractResults }) => {
  console.log(extractResults);
  const { movieStrings, episodeStrings } = useContentStrings(
    extractResults.filter((item) => item.mimeType !== 'folder')
  );
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
          {extractResults.map((item, i) =>
            item.mimeType !== 'folder' ? (
              <Row
                rowData={item}
                key={i}
                movieString={movieStrings[i]}
                seriesString={episodeStrings[i]}
              />
            ) : (
              <Row rowData={item} key={i} />
            )
          )}
        </tbody>
      </table>
    </div>
  );
});

export default FileTable;
