import { Link } from 'react-router-dom';
function Home() {
  return (
    <>
      {' '}
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-5xl font-bold">Cloufiler</h1>
          <div className="flex gap-3">
            <Link to={`/indexer`}>
              <button className="rounded-md bg-neutral-50 p-2 text-2xl text-black">Indexer</button>
            </Link>

            <Link to={`/builder`}>
              <button className="rounded-md border border-neutral-50 p-2 text-2xl text-neutral-50">
                Post Builder
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
