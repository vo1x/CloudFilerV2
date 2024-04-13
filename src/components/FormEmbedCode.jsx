import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import useFileSize from '../hooks/useFileSize';

function EmbedCode(props) {
  const { getReadableFS } = useFileSize();

  const [isCopied, setIsCopied] = useState(false);
  const handleCodeCopy = (item) => {
    try {
      navigator.clipboard.writeText(item).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    } catch (error) {
      const notify = () => {
        toast.error(`Error:${error}`, {
          theme: 'colored',
          autoClose: 2000,
          position: 'bottom-right'
        });
      };

      notify();
    }
  };

  const [seriesPreviewStrings, setSeriesPreviewString] = useState([]);
  const [moviesPreviewStrings, setMoviesPreviewStrings] = useState([]);

  useEffect(() => {
    const updateSeriesString = () => {
      setSeriesPreviewString([]);
      props.formData.fields.map((field, i) => {
        const filteredEpisodesList = field.value.filter(
          (episode) => episode.name.endsWith('.mkv') || episode.name.endsWith('.mp4')
        );
        var totalSz = filteredEpisodesList.reduce((acc, epi) => {
          acc += parseInt(epi.size);
          return acc;
        }, 0);

        const episodesList = filteredEpisodesList.map(
          (episode, index) =>
            `[maxbutton id="2" url="${episode.webContentLink}" text="Episode ${index + 1}" ]`
        );

        const seriesString =
          `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>` +
          `\n<p style="text-align: center;"><span style="color: #000000;"><strong>${filteredEpisodesList[0].name.slice(0, -4).replace(/(S\d+)\s*E\d+/, '$1')}\n[<span style="color: #ff0000;">${getReadableFS(totalSz / filteredEpisodesList.length)}/<span style="color: #0000ff;">E</span></span>]</strong></span></p>\n` +
          `<p style="text-align: center;"> ${episodesList.join(' ')} </p>` +
          `\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>`;

        setSeriesPreviewString((prevSeriesPreviewStrings) => [
          ...prevSeriesPreviewStrings,
          seriesString
        ]);
      });
    };

    const updateMoviesString = () => {
      setMoviesPreviewStrings([]);
      props.formData.fields.map((field) => {
        const sortedMovieList = field.value.slice().sort((m1, m2) => m2.size - m1.size);
        const movieString = sortedMovieList
          .filter((movie) => movie.name.endsWith('.mkv') || movie.name.endsWith('.mp4'))
          .map(
            (movie, index) =>
              `${index === 0 ? '\n<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>\n' : '<p style="text-align: center;">[mks_separator style="solid" height="2"]</p>\n'}` +
              `<p style="text-align: center;"><strong><span style="color: #000000;">${movie.name.slice(0, -4)}</span>` +
              `\n<span style="color: #000000;">[</span><span style="color: #ff0000;">${getReadableFS(movie.size)}</span><span style="color: #000000;">]</span></strong></p>` +
              `\n<p style="text-align: center;">[maxbutton id="1" url="${movie.webContentLink}"]</p>` +
              `${index === sortedMovieList.length - 1 ? '<p style="text-align: center;">[mks_separator style="solid" height="5"]</p>' : ''}`
          );
        setMoviesPreviewStrings((prevMoviesPreviewStrings) => [
          ...prevMoviesPreviewStrings,
          movieString.join('')
        ]);
      });
    };

    if (props.formData.contentType === 'movie') {
      updateMoviesString();
    } else if (props.formData.contentType === 'series') {
      updateSeriesString();
    }
  }, [props.formData.fields, props.formData.contentType]);

  const finalString = `Download<span style="color: #000000;"><strong> ${props.formData.title} (${props.formData.year})${props.formData.contentType === 'series' ? `(Season 1${props.formData.seasonCount > 1 ? `- ${props.formData.seasonCount}` : ''})` : ''}</strong></span> ${props.formData.printType}. Download <span style="color: #000000;"><strong>${props.formData.title.split('.')[0]} (${props.formData.year})${props.formData.contentType === 'series' ? `(Season 1${props.formData.seasonCount > 1 ? `- ${props.formData.seasonCount}` : ''})` : ''}</strong></span> in <strong><span style="color: #ff0000;"><a style="color: #ff0000;" href="https://uhdmovies.eu/1080p-uhd/">${props.formData.quality} UHD</a></span> x264</strong><span style="color: #ff0000;"><strong> </strong></span><span style="color: #333333;">Dual Audio with <strong>ORG</strong> Audios.<strong> UHD Movies</strong> is one of the best websites to download High-quality content directly through Google Drive. <a href="https://uhdmovies.eu/movies/"><strong>UHDMOVIES</strong></a> is powered by <strong><a href="https://moviesmod.org/"><span style="color: #008080;">MoviesMod</span></a></strong>. Here you can grab 4k &amp; 1080p UHD contents easily and save them in your google drive. </span>
  <h2 style="text-align: center;"><span style="color: #000000;"><strong>Download ${props.formData.title.split('.')[0]} (${props.formData.year}) ${props.formData.contentType === 'series' ? `(Season 1${props.formData.seasonCount > 1 ? `- ${props.formData.seasonCount}` : ''})` : ''}</strong></span>
  <span style="color: #000000;"><strong>${props.formData.quality} ${props.formData.printType} </strong></span>
  <span style="color: #000000;"><strong>[${props.formData.audioType} Audio]</strong></span></h2>
  <p style="text-align: center;"><img src="${props.formData.posterURL}" /></p>
  <p style="text-align: center;">[mks_separator style="solid" height="5"]<b></b><b> </b></p>
  <iframe width="560" height=${props.formData.trailerURL && props.formData.trailerURL.startsWith('https://youtube.com' || 'youtube.com') ? '315' : '0'} src="${props.formData.trailerURL}" frameborder="0" allowfullscreen></iframe>
  ${props.formData.contentType === 'series' ? (seriesPreviewStrings.length > 0 ? seriesPreviewStrings.join(['\n']) : '') : moviesPreviewStrings.length > 0 ? moviesPreviewStrings.join(['\n']) : ''}
Here you can download <a href="https://uhdmovies.eu/1080p-uhd/"><strong>1080p x264 UHD</strong></a>, <a href="https://uhdmovies.eu/1080p-60fps/"><strong>1080p 60FPS</strong></a>, <a href="https://uhdmovies.eu/1080p-10bit/"><strong>1080p x265 10Bit</strong></a>, <a href="https://uhdmovies.eu/4k-hdr/"><strong>4k HDR</strong></a>, <strong><a href="https://uhdmovies.eu/2160p-movies/">4k 2160p</a> SDR &amp; <a href="https://uhdmovies.eu/3d-movies/">3D Movies</a></strong> through <strong>Google Drive Links</strong>. High-quality movies with the best quality options and maximum bitrates. We also focus on providing the best quality audio available. <strong>4k HEVC Dolby Atmos</strong> is one of the best High-quality formats with low file sizes. We provide a fast &amp; safe direct google drive link to download the best quality stuff from the <strong>best Encoders</strong>. You can easily clone our files into your<strong> G-Drive</strong> and make your own collection of high-quality movies. <strong>Google Drive Direct</strong>/<strong>Login to download</strong>/<strong>Make Clone</strong> option are the best way to download or make a copy in your google drive.

<strong><span style="color: #ff0000;">Note:</span></strong> We Do not host any files on our server. All files shared here are collected from the internet from various Encoders and hosted on third-party sites. We do not accept responsibility for content hosted on third-party websites. We just index those links which are already available on the internet.`;

  return (
    <div className="relative flex flex-col content-center gap-3  ">
      <div className=" max-h-svh min-h-svh w-full overflow-y-auto  ">
        <div
          className="mb-56 whitespace-pre-wrap bg-white/80 p-5 text-black"
          dangerouslySetInnerHTML={{
            __html: finalString
          }}
          style={{ overflow: 'hidden', wordWrap: 'break-word' }} // Add CSS styles here
        />
      </div>
      <button
        onClick={() => handleCodeCopy(finalString)}
        className={`absolute right-0 top-0 mx-5 my-1 w-40 cursor-pointer rounded-md ${isCopied ? 'bg-[#07bc0c] font-semibold' : 'bg-neutral-900'}  p-2 text-sm drop-shadow`}
      >
        {isCopied ? 'Copied!' : 'Copy Embed Code'}
      </button>
    </div>
  );
}

export default EmbedCode;
