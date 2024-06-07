function useFileInformation() {
  const extractFileInformation = (name) => {
    const pattern = /^(.+?)\.S\d+E\d+\.(.+?)\.(1080p|2160p)\.(CR\.)?(WEB-DL|BluRay)\.(DUAL|MULTi)\.(AAC2\.0)\.(H\.264|H\.265|HEVC)-.+\.mkv$/;

    const match = name.match(pattern);


    const extractSeason = (fileName) => {
      const seasonReg = /S(\d{2})E\d{2}/;
      const match = seasonReg.exec(fileName);
      const seasonNum = match ? parseInt(match[1], 10) : null;
      return seasonNum;
    };

    const extractEpisode = (fileName) => {
      const episodeReg = /S\d{2}E(\d{2})/;
      const match = episodeReg.exec(fileName);
      const epNum = match ? parseInt(match[1], 10) : null;
      return epNum;
    };

    if (match) {
      const fileInfo = {
        name: match[1].split('.').join(' '),
        quality: match[3],
        season:extractSeason(name),
        latestEP: extractEpisode(name),
        print_type: match[5],
        audio_type: match[6],
        audio_codec: match[7],
        video_codec: match[8],
      };
      return fileInfo;
    }
  };

  return { extractFileInformation };
}

export default useFileInformation;