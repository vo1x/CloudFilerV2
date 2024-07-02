function Input({ label, value, name, onChange, type, placeholder, ...rest }) {
  return (
    <div className=" flex flex-col items-start justify-center gap-2">
      <label htmlFor="" className="text-lg font-semibold">
        {label}
      </label>
      <input
        {...rest}
        value={value}
        name={name}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className={`rounded-md border ${type === 'text' ? 'w-80' : 'w-20'} border-white/20 bg-white/5 p-2 text-sm outline-none transition-all duration-300 placeholder:text-white/50 focus:border-white/70`}
      />
    </div>
  );
}

export default Input;
