import { ToastContainer } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';

function Indexer() {
  return (
    <>
      <div className="grid lg:place-items-center">
        <Header></Header>
        <SearchBar></SearchBar>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default Indexer;
