import ResultCard from './ResultCard';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import useMediaInfo from '../../../hooks/useMediaInfo';

function Results({ setFormData, searchResults, searchValue }) {
  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('');

  const handleResultSelect = async (mediaType, mediaID) => {
    if (mediaID === selectedItemID) {
      return;
    }

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
        seasonCount: selectedItemType === 'tv' ? mediaInfo?.number_of_seasons : null,
        posters: mediaInfo.posters,
        ongoing: mediaInfo.in_production,
        latestEpisode: mediaInfo?.last_episode_to_air?.episode_number
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

  useEffect(() => {
    setIsItemSelected(false);
    setSelectedItemID('');
  }, [searchResults]);

  const handleItemUnselect = () => {
    setIsItemSelected(false);
    setSelectedItemID('');
  };

  return (
    <div>
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
    </div>
  );
}

export default Results;
