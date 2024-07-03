import { useEffect, useState } from 'react';
import Input from '../Input';
import axios from 'axios';
import ResultCard from './ResultCard';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-toastify';
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
    const url = `http://localhost:5000/search?query=${query}`;
    const { data } = await axios.get(url);
    setSearchResults(data);
  };

  useEffect(() => {
    handleSearch(searchValue);
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
        <Results setFormData={setFormData} searchResults={searchResults}>
         
        </Results>
      ) : null}
    </div>
  );
}

export default SearchBar;
