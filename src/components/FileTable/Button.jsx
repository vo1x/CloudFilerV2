const Button = ({ children, className, onClick }) => {
  return (
    <div onClick={onClick}>
      <button
        style={{
          width: '5rem',
          borderRadius: '0.375rem ',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          border: '1px solid',
          padding: '0.5rem',
          fontWeight: '600',
          textAlign: 'center',
          transition: 'all',
          transitionDuration: '200ms'
        }}
        className={className}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
