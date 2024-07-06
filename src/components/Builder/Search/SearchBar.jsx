import { useEffect, useState } from 'react';
import Input from '../Input';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import Results from './Results';

function SearchBar({ setFormData }) {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebounce(searchValue, 1000);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    const url = `/search?query=${query}`;
    const { data } = await axios.get(url);
    setSearchResults(data);
  };

  useEffect(() => {
    if (debouncedValue !== '') {
      handleSearch(searchValue);
    }
  }, [debouncedValue]);

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
        <Results
          setFormData={setFormData}
          searchResults={searchResults}
          searchValue={searchValue}
        ></Results>
      ) : null}
    </div>
  );
}

export default SearchBar;
