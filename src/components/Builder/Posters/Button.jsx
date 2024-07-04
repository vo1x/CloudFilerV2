function Button({ btnText, onClick }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer rounded-md border bg-white/90 p-1 text-black hover:bg-white"
    >
      <div>{btnText}</div>
    </button>
  );
}

export default Button;
