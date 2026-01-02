const Input = ({ label, error, type = 'text', ...props }) => (
  <div className="w-full mb-4">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <input 
        type={type}
      className={`w-full px-4 py-3 rounded-lg border bg-slate-50 transition-focus outline-none focus:ring-2 
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
      {...props}
    />
    {error && <span className="text-xs text-red-600 mt-1">{error}</span>}
  </div>
);
export default Input;