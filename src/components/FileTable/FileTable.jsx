import { memo } from 'react';

import Row from './Row';

const FileTable = memo(({ extractResults }) => {
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
