import { ToastContainer } from 'react-toastify';
import SearchBar from '../components/Indexer/SearchBar';
import Header from '../components/Header';

function Indexer() {
  return (
    <>
      <div className="grid place-items-center">
        <Header></Header>
        <SearchBar></SearchBar>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default Indexer;
