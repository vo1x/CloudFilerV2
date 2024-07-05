import Poster from './Poster';
import Button from './Button';
import { ChevronLeft, ChevronRight, DownloadIcon, Link, ClipboardCheck } from 'lucide-react';
import { RiLoader4Line } from '@remixicon/react';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useClipboard from '../../../hooks/useClipboard';
function PosterSelector({ posters, setFormData, contentTitle }) {
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

  const [isLoading, setLoading] = useState(false);

  const uploadImage = (filePath) => {
    setLoading(true);
    const fileName = `Download ${contentTitle.replace(/[^a-zA-Z0-9\s]/g, '')}`;
    const imageBaseUrl = 'https://image.tmdb.org/t/p/original';
    const data = new FormData();
    data.append('file', imageBaseUrl + filePath);
    data.append('upload_preset', 'uhdposters');
    data.append('cloud_name', 'dqvyyissy');

    fetch('https://api.cloudinary.com/v1_1/dqvyyissy/image/upload', {
      method: 'POST',
      body: data
    })
      .then((resp) => resp.json())
      .then((data) => {
        const fileID = data.secure_url.split('/').pop();
        let finalURL = '';
        finalURL = `https://res.cloudinary.com/dqvyyissy/image/upload/fl_attachment:${fileName}/v${Date.now()}/${fileID}`;
        window.location.href = finalURL;
        setLoading(false);
      })
      .catch((err) => console.log(err));
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
        {filteredPosters.length > 0 && (
          <div className="flex flex-col gap-4">
            <button
              className="rounded-md bg-blue-600 p-2 font-semibold"
              onClick={() => uploadImage(filteredPosters[posterPathInView]?.file_path)}
            >
              {isLoading ? <RiLoader4Line className="animate-spin" /> : <DownloadIcon />}
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
        )}
        <div className="flex min-w-44 max-w-44 overflow-hidden">
          <Poster
            key={filteredPosters[posterPathInView]?.file_path}
            path={filteredPosters[posterPathInView]?.file_path}
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button btnText={<ChevronLeft size={35} onClick={handlePrevButton} />} />
          <div className="text-lg font-semibold">
            {`${filteredPosters.length <= 0 ? 0 : posterPathInView + 1}/${filteredPosters.length}`}
          </div>
          <Button btnText={<ChevronRight size={35} onClick={handleNextButton} />} />
        </div>
      </div>
    </div>
  );
}

export default PosterSelector;
