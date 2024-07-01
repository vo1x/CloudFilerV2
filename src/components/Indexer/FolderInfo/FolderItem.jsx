import useFileSize from '../../../hooks/useFileSize';
import useClipboard from '../../../hooks/useClipboard';

function FolderItem({ item, movieStrings, episodeStrings, index }) {
  console.log(item);
  const { getReadableFS } = useFileSize();
  const [copied, handleItemCopy] = useClipboard();

  const createURL = (name) => {
    const seriesPattern = /^(.+?)(\s|\(|\.)/;
    const moviePattern = /^(.*?)(?:\.(19|20)\d{2})/;

    let match = name.match(seriesPattern);
    if (match) {
      return `https://uhdmovies.tel/search/${match[1].split('.').join('+').toLowerCase()}`;
    }

    match = name.replace(/\./g, '').match(moviePattern);
    if (match) {
      return `https://uhdmovies.tel/search/${match[1].split('.').join('+').toLowerCase()}`;
    }
  };

  return (
    <div className="max-w-96 overflow-hidden rounded-md border border-white/20 bg-white/5 p-4 lg:max-w-full lg:overflow-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div>
          <div className="truncate">
            <span
              className="text-ellipsis text-sm font-bold hover:cursor-pointer hover:text-blue-200 lg:text-base"
              onClick={(e) => handleItemCopy('File Name', e.target.innerText)}
            >
              {item.name}
            </span>
          </div>
          <div>
            <span
              className="text-md  hover:cursor-pointer hover:text-blue-200 lg:text-base"
              onClick={(e) => handleItemCopy('File Size', e.target.innerText)}
            >
              {getReadableFS(item.size)}
            </span>
          </div>
          <div className="truncate">
            <span
              className="text-ellipsis text-sm hover:cursor-pointer hover:text-blue-200 lg:text-base"
              onClick={(e) => handleItemCopy('File URL', e.target.innerText)}
            >
              {item.webContentLink}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="mx-4 hidden h-28 border border-neutral-700 lg:block"></span>

          <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
            <button
              onClick={(e) => handleItemCopy(e.target.innerText, movieStrings[index])}
              className="w-24 rounded-md border border-neutral-600 bg-neutral-600 p-1 text-sm outline-none lg:w-36 lg:text-base"
            >
              Movie Code
            </button>
            <button
              onClick={(e) => handleItemCopy(e.target.innerText, episodeStrings[index])}
              className="w-24 rounded-md border border-neutral-600 bg-neutral-600 p-1 text-sm outline-none lg:w-36 lg:text-base"
            >
              Series Code
            </button>
            <a
              href={`${createURL(item.name)}`}
              target="_blank"
              className="w-24 rounded-md border border-neutral-600 bg-neutral-600 p-1 text-center text-sm outline-none lg:w-36 lg:text-base"
            >
              Site Search
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FolderItem;
