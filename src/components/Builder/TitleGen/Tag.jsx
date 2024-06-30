function Tag({ tagName, titleKeys, handleCheckbox }) {
  return (
    <div>
      <input
        type="checkbox"
        id={`${tagName}box`}
        value={ tagName}
        checked={titleKeys[tagName]}
        onChange={(e) => handleCheckbox(e)}
        className="hidden"
      />
      <label
        htmlFor={`${tagName}box`}
        className={`block w-24 rounded-md text-center ${titleKeys[tagName] ? 'bg-green-600/50' : 'bg-neutral-700'} p-1`}
      >
        {tagName}
      </label>
    </div>
  );
}

export default Tag;
