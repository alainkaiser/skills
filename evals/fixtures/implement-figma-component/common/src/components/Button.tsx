type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export function Button({ children, disabled = false }: ButtonProps) {
  return (
    <button
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
