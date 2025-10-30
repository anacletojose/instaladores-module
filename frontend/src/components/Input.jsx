export default function Input({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div className="flex flex-col text-left">
      <label className="text-gray-700 mb-1 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}