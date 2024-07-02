import { useEffect, useState } from 'react';
import Input from '../Input';
import axios from 'axios';
import ResultCard from './ResultCard';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';

function SearchBar({ setFormData }) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebounce(searchValue, 1000);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const url = `http://localhost:5000/search?query=${query}`;
    const { data } = await axios.get(url);
    setSearchResults(data);
  };

  useEffect(() => {
    handleSearch(searchValue);
  }, [debouncedValue]);

  const [isItemSelected, setIsItemSelected] = useState(false);
  const [selectedItemID, setSelectedItemID] = useState('');
  const handleResultSelect = async (mediaType, mediaID) => {
    if (mediaID === selectedItemID) {
      toast.error('Already selected');
      return;
    }
    const url = `http://localhost:5000/media/${mediaType}/${mediaID}`;
    const { data } = await axios.get(url);

    setFormData((prev) => ({
      ...prev,
      title: data.title,
      year: data?.release_date.split('-')[0],
      posterURL: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
      trailerURL: `https://youtube.com/embed/${data?.videos[0]?.key}` || '',
      contentType: mediaType === 'tv' ? 'series' : 'movie'
    }));
    setIsItemSelected(true);
    setSelectedItemID(data.id);
  };

  return (
    <div>
      <Input
        label={'Search'}
        value={searchValue}
        name={'searchbar'}
        onChange={handleInputChange}
        placeholder={'Search for a movie or show'}
        type={'text'}
      ></Input>
      {searchResults && searchResults.length > 0 ? (
        <div className="mt-4 flex max-h-96 max-w-96 flex-col overflow-y-auto rounded-md border border-white/20 bg-white/5">
          {searchResults.map((result, i) => (
            <ResultCard
              key={i}
              title={result.title || result.name}
              description={result.overview}
              type={result.media_type}
              releaseDate={result.first_air_date || result.release_date}
              thumbnail={result.backdrop_path}
              onClick={() => handleResultSelect(result.media_type, result.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
