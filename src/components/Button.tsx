interface ButtonProps {
  text: string;
  value?: any;
  setValue?: (value: any) => void;
  currentValue?: any;
}

function Button({ text, value, setValue, currentValue }: ButtonProps) {
  return (
    <button
      onClick={() => setValue?.(value)}
      className={`menu-button ${currentValue === value ? 'active' : ''}`}
    >
      {text}
    </button>
  );
}

export default Button;
