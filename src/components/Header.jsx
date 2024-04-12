import { Link } from 'react-router-dom';
function Header() {
  return (
    <div className="flex max-w-96 items-center w-full justify-between p-3">
      <div className='font-bold text-2xl'>Cloudfiler</div>
      <div className="flex gap-3 items-center">
        <Link to={`/indexer`}>
          <button className="">Indexer</button>
        </Link>

        <Link to={`/builder`}>
          <button className="">Post Builder</button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
