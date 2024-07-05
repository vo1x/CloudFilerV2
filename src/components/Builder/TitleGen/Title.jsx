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
    <div className="col-span-2 flex max-w-96 flex-col items-start gap-4 pr-4 lg:w-full lg:max-w-5xl lg:flex-row lg:items-center">
      <span className="text-md max-w-96 rounded-md border border-neutral-600 bg-neutral-900 p-2 font-bold lg:w-full lg:max-w-full lg:text-lg">
        {`Download ${formData.title} (${formData.year}) ${
          formData.contentType === 'series'
            ? formData.seasonCount > 1
              ? `(Season 1 - ${formData.seasonCount}) `
              : '(Season 1) '
            : ''
        }${formData.contentType === 'series' && formData.ongoing ? `[S${formData.seasonCount.toString().padStart(2, 0)}E${formData.latestEpisode.toString().padStart(2, 0)} Added]` : ''} ${
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
            }${formData.contentType === 'series' && formData.ongoing ? `[S${formData.seasonCount.toString().padStart(2, 0)}E${formData.latestEpisode.toString().padStart(2, 0)} Added]` : ''}${
              formData.audioType === 'Dual' || formData.audioType === 'Multi'
                ? `${formData.audioType} Audio {${formData.audioLanguages}} `
                : `{${formData.audioLanguages} Audio} `
            }${Object.keys(titleKeys)
              .filter((key) => titleKeys[key])
              .map((key) => `${key} `)
              .join('|| ')}${formData.printType} Esubs`
          )
        }
        className={`flex w-20 items-center justify-center ${isCopied ? 'bg-green-600' : 'bg-blue-600'} text-md gap-1  rounded-md p-1 font-semibold transition-all duration-200 lg:text-lg ${!isCopied && 'hover:bg-blue-700'}`}
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

export default Title;
