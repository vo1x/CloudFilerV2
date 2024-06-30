import { useState } from 'react';
import Tag from './Tag';
const TitleGen = ({ formData }) => {
  const [titleKeys, setTitleKeys] = useState({
    '2160p': false,
    '4k': false,
    '1080p': false,
    '1080p 10bit': false,
    x264: false,
    HEVC: false,
    REMUX: false,
    'HDR DoVi': false
  });

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    setTitleKeys((prevStates) => ({
      ...prevStates,
      [value]: checked
    }));

    if (value === '2160p') {
      setTitleKeys((prevStates) => ({
        ...prevStates,
        '4k': checked
      }));
    }
  };

  const [isCopied, setIsCopied] = useState(false);
  const handleItemCopy = (item) => {
    setIsCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  return (
    <div className="ml-4 grid grid-cols-3">
      <div className=" relative mr-2 mt-2 flex w-max max-w-5xl flex-col gap-2 overflow-hidden whitespace-normal break-all rounded-md border border-neutral-600 bg-neutral-900 p-2">
        <div className="flex items-center gap-2">
          <div className="flex max-w-96 select-none justify-between gap-4 rounded-md  p-2">
            <div className="flex flex-col gap-4">
              <span className="font-semibold">Quality</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'2160p'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'1080p'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag
                  tagName={'1080p 10bit'}
                  titleKeys={titleKeys}
                  handleCheckbox={handleCheckbox}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold">Codecs</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'x264'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'HEVC'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold">Others</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'REMUX'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'HDR DoVi'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex items-center gap-4 pr-4">
        <span className="max-w-x ml-2 rounded-md border border-neutral-600 bg-neutral-900 p-2 text-lg font-bold">
          {`Download ${formData.title} (${formData.year}) ${
            formData.contentType === 'series'
              ? formData.seasonCount > 1
                ? `(Season 1 - ${formData.seasonCount}) `
                : '(Season 1) '
              : ''
          }${
            formData.audioType === 'Dual' || formData.audioType === 'Multi'
              ? `${formData.audioType} Audio {${formData.audioLanguages}} `
              : `{${formData.audioLanguages} Audio} `
          }${Object.keys(titleKeys)
            .filter((key) => titleKeys[key])
            .map((key) => `${key} `)
            .join('|| ')}${formData.printType} Esubs`}
        </span>
        <button
          onClick={() =>
            handleItemCopy(
              `Download ${formData.title} (${formData.year}) ${
                formData.contentType === 'series'
                  ? formData.seasonCount > 1
                    ? `(Season 1 - ${formData.seasonCount}) `
                    : '(Season 1) '
                  : ''
              }${
                formData.audioType === 'Dual' || formData.audioType === 'Multi'
                  ? `${formData.audioType} Audio {${formData.audioLanguages}} `
                  : `{${formData.audioLanguages} Audio} `
              }${Object.keys(titleKeys)
                .filter((key) => titleKeys[key])
                .map((key) => `${key} `)
                .join('|| ')}${formData.printType} Esubs`
            )
          }
          className={`flex w-20 items-center justify-center ${isCopied ? 'bg-green-600' : 'bg-blue-600'} gap-1 rounded-md  p-1 text-lg font-semibold transition-all duration-200 ${!isCopied && 'hover:bg-blue-700'}`}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

export default TitleGen;
