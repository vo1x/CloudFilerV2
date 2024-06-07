import { useEffect, useState } from 'react';

export default function AudioInputField({ defaultValue, setAudioLang }) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setAudioLang(inputValue);
  }, [inputValue]);
  
  return (
    <input
      type="text"
      className=" ml-2 w-1/2 rounded-md border border-white/20 bg-white/5 p-2 outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
      placeholder={defaultValue}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
}
