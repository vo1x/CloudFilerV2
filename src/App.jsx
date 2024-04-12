import { ToastContainer } from 'react-toastify';
import SearchBar from './components/SearchBar';
import Header from './components/Header';
import FormBuilder from './components/Form';
function App() {
  return (
    <>
      <div className="grid h-[100vh] place-items-center overflow-hidden">
        <FormBuilder></FormBuilder>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
