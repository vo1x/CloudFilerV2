import EmbedCode from './EmbedCode';
import FolderInfo from './Indexer/FolderInfo/FolderInfo';
import useContentStrings from '../hooks/useContentStrings';
import useMovieStrings from '../hooks/useMovieString';
function Result(props) {
  const [movieStrings, episodeStrings] = useContentStrings(props.data);
  const [nameSortedMovieStrings] = useMovieStrings(props.data);
  return (
    <>
      <div className=" flex flex-col gap-5 p-5 ">
        <FolderInfo
          folderData={props.data}
          episodeStrings={episodeStrings}
          nameSortedMovieStrings={nameSortedMovieStrings}
        />
        {props.data.some((file) => file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) && (
          <EmbedCode data={props.data}></EmbedCode>
        )}
      </div>
    </>
  );
}

export default Result;
