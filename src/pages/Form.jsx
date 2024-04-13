import EmbedCode from '../components/FormEmbedCode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiChevronDown, FiChevronUp, FiCopy, FiTrash2 } from 'react-icons/fi';
import { useCallback, useState } from 'react';
import { useEffect } from 'react';
import Field from '../components/FormField';
import Header from '../components/FormHeader';
function FormBuilder(props) {
  const [fieldsData, setFieldsData] = useState([]);
  const [fields, setFields] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [prevFolderID, setPrevFolderID] = useState([]);

  const removeField = (indexToRemove) => {
    setInputValue('');
    setPrevFolderID((prevFolderID) => prevFolderID.filter((_, index) => index !== indexToRemove));
    setFields((prevFields) => prevFields.filter((_, index) => index !== indexToRemove));
    setFieldsData((prevFieldsData) => prevFieldsData.filter((_, index) => index !== indexToRemove));
  };
  const [formData, setFormData] = useState({
    title: 'Movie',
    year: '2024',
    seasonCount: 1,
    quality: '1080p',
    printType: 'Web-DL',
    audioType: 'Single',
    posterURL: '',
    trailerURL: '',
    fields: fieldsData,
    contentType: 'movie'
  });
  const [embedString, setEmbedString] = useState([]);
  const addField = (data, i) => {
    setInputValue('');

    setFieldsData((prevFieldsData) => [...prevFieldsData, { title: data[0].name, value: data }]);
    setFields([...fields, { fieldData: data }]);
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      fields: fieldsData
    }));
  }, [fieldsData]);

  const [selectedTab, setSelectedTab] = useState('');
  const handleContentSelect = (e) => {
    setSelectedTab(e.target.value.toLowerCase());
    setFormData((prevFormData) => ({ ...prevFormData, contentType: e.target.value.toLowerCase() }));
  };

  const [fieldURL, setFieldURL] = useState('');

  const [extractResults, setExtractResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GDRIVE_API_KEY;

  const handleExtractButton = (folderURL) => {
    if (folderURL === '') {
      return toast.error('Folder URL is required', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    if (!folderURL.startsWith('https://drive.google.com/')) {
      return toast.error('Invalid URL format', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    //https://drive.google.com/file/d/1s72LKrT1-SAtx5tVdXvHxcjR7KO8F_an/view?usp=drive_link
    // const isFileUrl = /(?:\/(?:drive\/)?(?:u\/\d+\/)?file\/d\/[a-zA-Z0-9_-]+\/?)/.test(folderURL);
    const isFileUrl = /(?:\/(?:drive\/)?(?:u\/\d+\/)?(?:file\/d\/|uc\?id=)[a-zA-Z0-9_-]+\/?)/.test(
      folderURL
    );
    const isFolderUrl = /(?:\/(?:drive\/)?(?:u\/\d+\/)?folders\/[a-zA-Z0-9_-]+\/?)/.test(folderURL);

    var fID = '';
    var type = '';
    if (isFileUrl) {
      // const fileRegex = /\/(?:drive\/)?(?:u\/\d+\/)?file\/d\/([a-zA-Z0-9_-]+)/;
      const fileRegex = /(?:\/(?:drive\/)?(?:u\/\d+\/)?(?:file\/d\/|uc\?id=))([a-zA-Z0-9_-]+)/;

      fID = folderURL.match(fileRegex)[1];
      type = 'file';
    } else if (isFolderUrl) {
      const regexFolder = /\/(?:drive\/)?(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/;
      fID = folderURL.match(regexFolder)[1];
      type = 'folder';
    }

    if (prevFolderID.includes(fID)) {
      return toast.warning('Folder already extracted!', {
        theme: 'colored',
        autoClose: 2000,
        position: 'top-right'
      });
    }

    const fetchInfo = async (folderID) => {
      setLoading(true);
      try {
        var url = '';
        if (type === 'file') {
          url = `https://www.googleapis.com/drive/v3/files/${folderID}?supportsAllDrives=true&includeItemsFromAllDrives=true&fields=id,name,size,webContentLink,mimeType&key=${apiKey}`;
        } else if (type === 'folder') {
          url = `https://www.googleapis.com/drive/v3/files?q='${folderID}'+in+parents&supportsAllDrives=true&includeItemsFromAllDrives=true&pageSize=1000&orderBy=name&fields=files(id,name,size,webContentLink,mimeType)&key=${apiKey}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Invalid URL');
          else throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        if (type === 'file') {
          setExtractResults([data]);
          addField([data]);
        } else if (type === 'folder') {
          setExtractResults(data.files);
          addField(data.files);
        }
      } catch (error) {
        toast.error(`${error}`, { theme: 'colored', autoClose: 2000 });
        setPrevFolderID('');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo(fID).then(() => setPrevFolderID((prevFolderID) => [...prevFolderID, fID]));
  };

  const [isCopied, setIsCopied] = useState(false);
  const handleItemCopy = (item) => {
    setIsCopied(false);
    navigator.clipboard.writeText(item).then(() => {
      // const notify = () => {
      //   toast.success(`Field embed code copied!`, {
      //     theme: 'colored',
      //     autoClose: 2000,
      //     position: 'bottom-right'
      //   });
      // };
      // notify();
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const getReadableFS = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleIsExpanded = useCallback(() => {
    setIsExpanded((isExpanded) => !isExpanded);
  }, []);

  const [titleKeys, setTitleKeys] = useState({
    '2160p': false,
    '4k': false,
    '1080p 10bit': false,
    '1080p': false,
    x264: false,
    HEVC: false,
    'HDR DoVi': false,
    REMUX: false
  });

  const handleCheckbox = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setTitleKeys((prevStates) => ({ ...prevStates, [value]: isChecked }));
  };

  const handleSetAllTrue = (e) => {
    const toBeUpdated = { ...titleKeys };
    if (e.target.checked) Object.keys(toBeUpdated).forEach((key) => (toBeUpdated[key] = true));
    else Object.keys(toBeUpdated).forEach((key) => (toBeUpdated[key] = false));
    setTitleKeys(toBeUpdated);
  };

  return (
    <>
      <div className="grid max-h-svh place-items-center overflow-hidden">
        <div className="w-100vw grid grid-cols-3">
          <div className="flex max-h-svh flex-col gap-2 overflow-auto overflow-x-hidden p-5">
            <Header></Header>
            <div className="flex items-center gap-2">
              <label htmlFor="" className="text-sm">
                Content Type
              </label>
              <select
                className="rounded-md bg-neutral-700 p-1 text-sm outline-none"
                name=""
                id=""
                onChange={(e) => handleContentSelect(e)}
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                type="text"
                className="ml-2 w-3/5 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
              />
            </div>
            <div>
              <label htmlFor="">Year</label>
              <input
                value={formData.year}
                type="number"
                min={1}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="ml-2 w-max rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
              />
            </div>
            {selectedTab === 'series' && (
              <div>
                <label
                  htmlFor=""
                  className={`${selectedTab === 'movie' ? 'text-neutral-500' : 'text-neutral-50'}`}
                >
                  Season Count
                </label>
                <input
                  value={formData.seasonCount}
                  onChange={(e) => setFormData({ ...formData, seasonCount: e.target.value })}
                  type="number"
                  min={1}
                  className={`ml-2 w-max rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70 `}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="">Quality</label>
              <select
                name=""
                id=""
                className="rounded-md bg-neutral-700 p-1 text-sm outline-none"
                value={formData.quality}
                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              >
                <option value="1080p">1080p</option>
                <option value="2160p">2160p</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="">Print Type</label>
              <select
                name=""
                id=""
                className="rounded-md bg-neutral-700 p-1 text-sm outline-none"
                value={formData.printType}
                onChange={(e) => setFormData({ ...formData, printType: e.target.value })}
              >
                <option value="Web-DL">Web-DL</option>
                <option value="Bluray">Bluray</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="">Audio Type</label>
              <select
                name=""
                id=""
                className="rounded-md bg-neutral-700 p-1 text-sm outline-none"
                value={formData.audioType}
                onChange={(e) => setFormData({ ...formData, audioType: e.target.value })}
              >
                <option value="Single">Single</option>
                <option value="Dual">Dual</option>
                <option value="Multi">Multi</option>
              </select>
            </div>

            <div>
              <label htmlFor="">Poster URL</label>
              <input
                type="url"
                name=""
                id=""
                className="ml-2 w-3/5 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
                onChange={(e) => setFormData({ ...formData, posterURL: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="">Trailer URL</label>
              <input
                type="url"
                name=""
                id=""
                className="ml-2 w-3/5 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
                onChange={(e) => setFormData({ ...formData, trailerURL: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-3 rounded-md border border-neutral-700 bg-neutral-900 p-3">
              Fields: {fields.length}
              {/* Render existing fields */}
              {fields.map((field, i) => (
                <div className="relative">
                  <Field
                    key={i}
                    fieldIndex={i + 1}
                    data={field.fieldData}
                    setEmbedString={setEmbedString}
                    contentType={formData.contentType}
                  ></Field>
                  <button
                    onClick={() => removeField(i)}
                    className="absolute right-0 top-0 m-3 text-lg text-neutral-400 transition-all duration-200 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              {/* Button to add a new field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="File or Folder URL"
                  className="ml-2 w-3/5 rounded-md border border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
                <button
                  onClick={() => handleExtractButton(inputValue)}
                  className="flex items-center gap-1 rounded-md bg-blue-600 p-2 py-1 text-sm font-semibold transition-all duration-300 hover:bg-blue-700"
                >
                  Add Field
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-3">
            <div className="relative mr-2 mt-2 flex max-w-5xl flex-col gap-2 overflow-hidden whitespace-normal break-all rounded-md border border-neutral-600 bg-neutral-900 p-2">
              <span className="text-lg font-bold">
                {`${formData.title} (${formData.year}) ${formData.contentType === 'series' ? (formData.seasonCount > 1 ? '(Season 1 - ' + formData.seasonCount + ')' : '(Season 1)') : ''} ${formData.audioType !== 'Single' ? formData.audioType + ' Audio' : ''} ${formData.audioType !== 'Single' ? '{Hindi-English}' : '{English Audio}'} ${Object.keys(
                  titleKeys
                )
                  .filter((key) => titleKeys[key])
                  .join(' || ')} ${formData.printType} Esubs`}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex w-max select-none gap-2 rounded-md bg-neutral-800 p-2">
                  <div>Tags:</div>

                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="allbox"
                      value=""
                      checked={
                        Object.values(titleKeys).some((value) => value === false) ? false : true
                      }
                      onChange={(e) => handleSetAllTrue(e)}
                    />
                    <label htmlFor="allbox">Select/Deselect All</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="2160pbox"
                      value="2160p"
                      checked={titleKeys['2160p']}
                      onChange={(e) => handleCheckbox(e)}
                      className="hidden"
                    />
                    <label
                      htmlFor="2160pbox"
                      className={`rounded-md  ${titleKeys['2160p'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      2160p
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="4kbox"
                      value="4k"
                      className="hidden"
                      checked={titleKeys['4k']}
                      onChange={(e) => handleCheckbox(e)}
                    />

                    <label
                      htmlFor="4kbox"
                      className={`rounded-md  ${titleKeys['4k'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      4k
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      checked={titleKeys['1080p 10bit']}
                      id="1080p10bitbox"
                      value="1080p 10bit"
                      className="hidden"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="1080p10bitbox"
                      className={`rounded-md  ${titleKeys['1080p 10bit'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      1080p 10bit
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="1080pbox"
                      className="hidden"
                      checked={titleKeys['1080p']}
                      value="1080p"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="1080pbox"
                      className={`rounded-md  ${titleKeys['1080p'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      1080p
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      checked={titleKeys['x264']}
                      id="x264box"
                      className="hidden"
                      value="x264"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="x264box"
                      className={`rounded-md  ${titleKeys['x264'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      x264
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      checked={titleKeys['HEVC']}
                      id="hevcbox"
                      className="hidden"
                      value="HEVC"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="hevcbox"
                      className={`rounded-md  ${titleKeys['HEVC'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      HEVC
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      checked={titleKeys['HDR DoVi']}
                      id="hdrdovibox"
                      className="hidden"
                      value="HDR DoVi"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="hdrdovibox"
                      className={`rounded-md  ${titleKeys['HDR DoVi'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      HDR DoVi
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="remuxbox"
                      checked={titleKeys['REMUX']}
                      value="REMUX"
                      className="hidden"
                      onChange={(e) => handleCheckbox(e)}
                    />
                    <label
                      htmlFor="remuxbox"
                      className={`rounded-md  ${titleKeys['REMUX'] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
                    >
                      REMUX
                    </label>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleItemCopy(
                      `${formData.title} (${formData.year}) ${formData.contentType === 'series' ? (formData.seasonCount > 1 ? '(Season 1 - ' + formData.seasonCount + ')' : '(Season 1)') : ''} ${formData.audioType !== 'Single' ? formData.audioType + ' Audio' : ''} ${formData.audioType !== 'Single' ? '{Hindi-English}' : '{English Audio}'} ${Object.keys(
                        titleKeys
                      )
                        .filter((key) => titleKeys[key])
                        .join(' || ')} ${formData.printType} Esubs`
                    )
                  }
                  className={`flex items-center ${isCopied ? 'bg-green-600' : 'bg-blue-600'} gap-1 rounded-md  p-1 text-sm font-bold transition-all duration-200 ${!isCopied && 'hover:bg-blue-700'}`}
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <EmbedCode formData={formData} fieldsCount={fields.length}></EmbedCode>
          </div>
        </div>
      </div>
    </>
  );
}

export default FormBuilder;
