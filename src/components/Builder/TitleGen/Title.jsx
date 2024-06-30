import React from 'react';
import { useState } from 'react';
function Title({ formData, titleKeys }) {
  const [isCopied, setIsCopied] = useState(false);
  const handleItemCopy = (item) => {
    setIsCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  return (
    <div className="col-span-2 flex items-center gap-4 pr-4">
      <span className="max-w-xl rounded-md border border-neutral-600 bg-neutral-900 p-2 text-lg font-bold">
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
  );
}

export default Title;
