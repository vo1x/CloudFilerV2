import { ToastContainer } from 'react-toastify';
import FormBuilder from './pages/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Indexer from './pages/Indexer';
import Home from './pages/Home';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Indexer />}></Route>
          {/* <Route path="/indexer" element={<Indexer />}></Route> */}
          <Route path="/builder" element={<FormBuilder></FormBuilder>}></Route>
        </Routes>
      </Router>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
