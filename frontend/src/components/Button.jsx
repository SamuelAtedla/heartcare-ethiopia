export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all rounded-lg active:scale-95";
  
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-md",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "w-full py-4 text-lg" // Perfect for mobile primary actions
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};