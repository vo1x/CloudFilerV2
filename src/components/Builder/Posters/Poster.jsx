import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Poster({ path }) {
  return (
    <div className="min-h-[264px] min-w-44 max-w-44 bg-white/5">
      {path && <img src={`https://image.tmdb.org/t/p/w220_and_h330_face/${path}`} alt="" />}
      {!path && <Skeleton height={264} width={176} baseColor="#ffffff1f" enableAnimation={false} />}
    </div>
  );
}

export default Poster;
