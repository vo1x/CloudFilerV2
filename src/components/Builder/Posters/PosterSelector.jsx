import Poster from './Poster';
import Button from './Button';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
  ChevronUp,
  DownloadIcon,
  Link,
  ClipboardCheck
} from 'lucide-react';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useClipboard from '../../../hooks/useClipboard';
function PosterSelector({ posters, setFormData }) {
  const [posterPathInView, setPosterPathInView] = useState(0);
  const [filteredPosters, setFilteredPosters] = useState(posters);
  const handleNextButton = () => {
    if (posterPathInView >= filteredPosters.slice(0, 5).length - 1) {
      setPosterPathInView(0);
    } else {
      setPosterPathInView((prev) => prev + 1);
    }
  };
  const [copied, handleItemCopy] = useClipboard();

  const handlePrevButton = () => {
    if (posterPathInView <= 0) {
      setPosterPathInView(filteredPosters.slice(0, 5).length - 1);
    } else {
      setPosterPathInView((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (posters) {
      const englishPosters = posters.filter((poster) => poster.iso_639_1 === 'en');

      console.log(englishPosters);

      if (englishPosters.length === 0) {
        setFilteredPosters(posters.slice(0, 5));
      } else {
        setFilteredPosters(englishPosters.slice(0, 5));
      }
    }
  }, [posters]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      posterURL: `https://image.tmdb.org/t/p/original${filteredPosters[posterPathInView]?.file_path}`
    }));
  }, [posterPathInView]);

  return (
    <div className="flex w-full max-w-80 flex-col items-center gap-4">
      <div className="flex max-w-max items-center justify-between gap-4">
        <div className="flex flex-col gap-4">
          <button className="rounded-md bg-blue-600 p-2 font-semibold">
            <DownloadIcon></DownloadIcon>
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ backgroundColor: '#2563eb' }}
            animate={copied ? { backgroundColor: '#16a34a' } : ''}
            onClick={() =>
              handleItemCopy(
                'Poster URL',
                `https://image.tmdb.org/t/p/original${filteredPosters[posterPathInView]?.file_path}`
              )
            }
            className={`rounded-md  p-2 font-semibold`}
          >
            {copied ? <ClipboardCheck /> : <Link />}
          </motion.button>
        </div>
        <div className="flex min-w-44 max-w-44 overflow-hidden">
          <Poster
            key={filteredPosters[posterPathInView]?.file_path}
            path={filteredPosters[posterPathInView]?.file_path}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button btnText={<ChevronLeft size={35} onClick={handlePrevButton} />} />
          <div className="text-lg font-semibold">
            {`${posters.length <= 0 ? 0 : posterPathInView + 1}/${posters.slice(0, 5).length}`}
          </div>
          <Button btnText={<ChevronRight size={35} onClick={handleNextButton} />} />
        </div>
      </div>
    </div>
  );
}

export default PosterSelector;
