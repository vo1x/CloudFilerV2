import useFileSize from '../../../hooks/useFileSize';

import useClipboard from '../../../hooks/useClipboard';

function FolderItem({ item, movieStrings, episodeStrings, index }) {
  console.log(item);
  const { getReadableFS } = useFileSize();
  const [copied, handleItemCopy] = useClipboard();

  const createURL = (name) => {
    const seriesPattern = /^(.+?)\.S\d{2}\.\d{4}/i;

    const moviePattern = /^(.*?)(?:\.(19|20)\d{2})/;

    let match = name.replace(/\./g, '').match(seriesPattern);
    if (match) {
      return `https://uhdmovies.tel/search/${match[1].split('.').join('+').toLowerCase()}`;
    }

    match = name.replace(/\./g, '').match(moviePattern);
    if (match) {
      return `https://uhdmovies.tel/search/${match[1].split('.').join('+').toLowerCase()}`;
    }
  };

  return (
    <div className="rounded-md border border-white/20 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div>
            <span
              className="font-bold hover:cursor-pointer hover:text-blue-200"
              onClick={(e) => handleItemCopy('File Name', e.target.innerText)}
            >
              {item.name}
            </span>
          </div>
          <div>
            <span
              className="hover:cursor-pointer hover:text-blue-200"
              onClick={(e) => handleItemCopy('File Size', e.target.innerText)}
            >
              {getReadableFS(item.size)}
            </span>
          </div>
          <div>
            <span
              className="hover:cursor-pointer hover:text-blue-200"
              onClick={(e) => handleItemCopy('File URL', e.target.innerText)}
            >
              {item.webContentLink}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="mx-4 h-28 border border-neutral-700"></span>

          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => handleItemCopy(e.target.innerText, movieStrings[index])}
              className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
            >
              Movie Code
            </button>
            <button
              onClick={(e) => handleItemCopy(e.target.innerText, episodeStrings[index])}
              className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 outline-none"
            >
              Series Code
            </button>
            <a
              href={`${createURL(item.name)}`}
              target="_blank"
              className="w-36 rounded-md border border-neutral-600 bg-neutral-600 p-1 text-center outline-none"
            >
              Search on Site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderItem;
