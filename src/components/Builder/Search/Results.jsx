import { toast } from 'react-toastify';
import ResultCard from './ResultCard';
import axios from 'axios';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useMediaInfo from '../../../hooks/useMediaInfo';

function Results({ setFormData, searchResults }) {
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');

  const handleResultSelect = async (mediaType, mediaID) => {
    if (mediaID === selectedItemID) {
      //   if (isItemSelected) toast.error('Already selected');
      return;
    }
    // const url = `http://localhost:5000/media/${mediaType}/${mediaID}`;
    // const { data } = await axios.get(url);

    // setFormData((prev) => ({
    //   ...prev,
    //   title: data.title,
    //   year: data?.release_date.split('-')[0],
    //   posterURL: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
    //   trailerURL: data?.videos[0]?.key ? `https://youtube.com/embed/${data.videos[0].key}` : '',
    //   contentType: mediaType === 'tv' ? 'series' : 'movie',
    //   seasonCount: mediaType === 'tv' ? data?.number_of_seasons : null
    // }));
    setIsItemSelected(true);
    setSelectedItemID(mediaID);
    setSelectedItemType(mediaType);
  };

  const [mediaInfo] = useMediaInfo(selectedItemType, selectedItemID);

  useEffect(() => {
    if (mediaInfo) {
      setFormData((prev) => ({
        ...prev,
        title: mediaInfo.title,
        year: mediaInfo?.release_date.split('-')[0],
        posterURL: `https://image.tmdb.org/t/p/original/${mediaInfo.poster_path}`,
        trailerURL: mediaInfo?.videos[0]?.key
          ? `https://youtube.com/embed/${mediaInfo.videos[0].key}`
          : '',
        contentType: selectedItemType === 'tv' ? 'series' : 'movie',
        seasonCount: selectedItemType === 'tv' ? mediaInfo?.number_of_seasons : null
      }));
    }
  }, [mediaInfo]);

  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const unFilteredResults = searchResults;
    if (isItemSelected)
      setFilteredResults(unFilteredResults.filter((result) => result.id === selectedItemID));
    else setFilteredResults(searchResults);
  }, [searchResults, selectedItemID, isItemSelected]);

  const handleItemUnselect = () => {
    setIsItemSelected(false);
    setSelectedItemID('');
  };

  return (
    <div className="relative mt-4 flex max-h-96 max-w-80 flex-col overflow-y-auto rounded-md border border-white/20 bg-white/5">
      <div>
        {filteredResults.map((result, i) => (
          <ResultCard
            key={i}
            title={result.title || result.name}
            description={result.overview}
            type={result.media_type}
            releaseDate={result.first_air_date || result.release_date}
            thumbnail={result.backdrop_path}
            onClick={() => handleResultSelect(result.media_type, result.id)}
            isSelected={result.id === selectedItemID}
            handleItemUnselect={handleItemUnselect}
          />
        ))}
      </div>
      {isItemSelected && (
        <div className="absolute right-0" onClick={() => handleItemUnselect()}>
          <X></X>
        </div>
      )}
    </div>
  );
}

export default Results;
