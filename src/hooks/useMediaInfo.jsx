import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useMediaInfo(mediaType, mediaID) {
  const fetchInfo = async () => {
    try {
      const { data } = await axios.get(`/media/${mediaType}/${mediaID}`);
      // console.log(data);
      return data;
    } catch (error) {
      console.error('Error occurred: ', error);
      return { error };
    }
  };

  const { data: mediaInfo, isError } = useQuery({
    queryKey: [`${mediaID}-data`],
    queryFn: fetchInfo,
    staleTime: Infinity,
    enabled: !!mediaID && !!mediaType && !!mediaID !== ''
  });

  return [mediaInfo, isError];
}
