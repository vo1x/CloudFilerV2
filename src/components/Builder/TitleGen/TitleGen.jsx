import Tag from './Tag';
const TitleGen = ({ titleKeys, setTitleKeys }) => {
  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    setTitleKeys((prevStates) => ({
      ...prevStates,
      [value]: checked
    }));

    if (value === '2160p') {
      setTitleKeys((prevStates) => ({
        ...prevStates,
        '4k': checked
      }));
    }
  };

  return (
    <div className="grid grid-cols-3">
      <div className="relative flex w-max max-w-5xl flex-col gap-2 overflow-hidden whitespace-normal break-all rounded-md border border-neutral-600 bg-neutral-900 p-2">
        <div className="flex items-center gap-2">
          <div className="flex max-w-96 select-none justify-between gap-4 rounded-md  p-2">
            <div className="flex flex-col gap-4">
              <span className="font-semibold">Quality</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'2160p'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'1080p'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag
                  tagName={'1080p 10bit'}
                  titleKeys={titleKeys}
                  handleCheckbox={handleCheckbox}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold">Codecs</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'x264'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'HEVC'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-semibold">Others</span>
              <div className="flex flex-col gap-2">
                <Tag tagName={'REMUX'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
                <Tag tagName={'HDR DoVi'} titleKeys={titleKeys} handleCheckbox={handleCheckbox} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleGen;
