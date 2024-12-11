import { useState } from 'react';

const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;

const useGDrive = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  function extractGDriveId(input) {
    function isGDriveId(id) {
      return /^(tp:|sa:|mtp:)?(?:[a-zA-Z0-9-_]{33}|[a-zA-Z0-9_-]{19})$|^gdl$|^(tp:|mtp:)?root$/.test(
        id
      );
    }

    function isGDriveLink(url) {
      return url.includes('drive.google.com') || url.includes('drive.usercontent.google.com');
    }

    if (isGDriveId(input)) {
      return input;
    }

    if (isGDriveLink(input)) {
      const regex =
        /https:\/\/drive\.google\.com\/(?:drive(.*?)\/folders\/|file(.*?)?\/d\/)([-\w]+)/;
      const match = input.match(regex);

      if (match) {
        return match[3];
      }

      try {
        const url = new URL(input);
        const params = new URLSearchParams(url.search);
        const id = params.get('id');

        if (id) return id;
      } catch (error) {
        throw new Error('Invalid Google Drive URL or unable to extract ID');
      }
    }

    throw new Error('Invalid Google Drive ID or link');
  }

  const fetchGDriveDetails = async (url) => {
    setIsError(false);
    setIsFetching(true); 
  
    try {
      const resourceID = extractGDriveId(url);
      const isFolder = url.includes('/folders/');
  
      const baseUrl = `https://www.googleapis.com/drive/v3/files/${resourceID}`;
      const fieldsParam = isFolder
        ? '?fields=id,name&supportsAllDrives=true'
        : '?supportsAllDrives=true&includeItemsFromAllDrives=true&fields=id,name,size,webContentLink,mimeType';
  
      const resourceResponse = await fetch(`${baseUrl}${fieldsParam}&key=${apiKey}`);
      if (!resourceResponse.ok) {
        throw new Error(resourceResponse.status === 404 ? 'Invalid URL' : 'Failed to fetch data');
      }
  
      const resourceData = await resourceResponse.json();
  
      const files = [];
      if (isFolder) {
        const contentsResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${resourceID}'+in+parents&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=1000&orderBy=name&fields=files(id,name,size,webContentLink,mimeType)&key=${apiKey}`
        );
        const contentsData = await contentsResponse.json();
  
        contentsData.files.forEach((item) => {
          
          files.push({
            ...item,
            mimeType: item.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : item.mimeType
          });
        });
  
        setIsFetching(false);
        setIsFetched(true); 
  
        return {
          folderName: resourceData.name,
          folderID: resourceData.id,
          files
        };
      } else {
        setIsFetching(false);
        setIsFetched(true); 
        return {
          files: [{
            ...resourceData,
            mimeType: resourceData.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : resourceData.mimeType
          }]
        };
      }
    } catch (error) {
      console.error('Error retrieving details:', error);
      setIsError(true);
      setIsFetching(false);
      setIsFetched(false);
      return null;
    }
  };
  

  return {
    fetchGDriveDetails,
    extractGDriveId,
    isFetched,
    isFetching,
    isError
  };
};

export default useGDrive;
