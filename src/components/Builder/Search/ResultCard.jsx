import { X } from 'lucide-react';

function ResultCard({
  title,
  description,
  type,
  releaseDate,
  thumbnail,
  isSelected,
  handleItemUnselect,
  ...rest
}) {
  return (
    <div
      {...rest}
      className={`flex ${isSelected ? 'bg-white/10' : ''} relative max-w-96 gap-2 p-2 lg:hover:cursor-pointer lg:hover:bg-white/10`}
    >
      <div className="min-w-12 max-w-12 text-sm">
        <img src={`https://image.tmdb.org/t/p/w94_and_h141_face/${thumbnail}`} alt="Prev" />
      </div>
      <div className="flex max-w-96 flex-col truncate ">
        <span className="truncate font-semibold capitalize">{title}</span>
        <span className="truncate text-sm text-neutral-300">{description}</span>
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <span className="capitalize">{type}</span>
          <span>•</span>
          <span>{releaseDate}</span>
        </div>
      </div>
     
    </div>
  );
}

export default ResultCard;
