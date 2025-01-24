import { Toaster } from 'sonner';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Indexer from './pages/Indexer';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Indexer />}></Route>
        </Routes>
      </Router>
      <Toaster
        richColors
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '16px'
          }
        }}
        closeButton
      ></Toaster>
    </>
  );
}

export default App;
