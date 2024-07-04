function Poster({ path }) {
  return (
    <div className="min-h-[264px] min-w-44 max-w-44">
      <img src={`https://image.tmdb.org/t/p/w220_and_h330_face/${path}`} alt="" />
    </div>
  );
}

export default Poster;
