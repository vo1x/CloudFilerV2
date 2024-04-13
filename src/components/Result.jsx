import EmbedCode from './EmbedCode';
import FolderInfo from './FolderInfo';
import useContentStrings from '../hooks/useContentStrings';
function Result(props) {
  const [movieStrings, episodeStrings] = useContentStrings(props.data);
  return (
    <>
      <div className=" flex flex-col gap-5 p-5">
        <FolderInfo
          folderData={props.data}
          movieStrings={movieStrings}
          episodeStrings={episodeStrings}
        />
        {props.data.some((file) => file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) && (
          <EmbedCode data={props.data}></EmbedCode>
        )}
      </div>
    </>
  );
}

export default Result;

// [ { "webContentLink": "https://drive.google.com/uc?id=1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP&export=download",
// "size": "7453418553", "id": "1-m-wpaVqLh-io4Z9yxeLv6LCjqT8S2iP",
// "name": "Decoys (2004) 1080p AMZN WEB-DL [Hindi DD 2.0 + English DDP 5.1] x264-ABM[VoLx].mkv" } ]
