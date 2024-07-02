import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import FormBuilder from './pages/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Indexer from './pages/Indexer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Indexer />}></Route>
            <Route path="/builder" element={<FormBuilder></FormBuilder>}></Route>
          </Routes>
        </Router>
        <ToastContainer></ToastContainer>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
