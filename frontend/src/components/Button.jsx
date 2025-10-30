export default function Button({ text, color = 'blue', onClick }) {
  const base = `w-full py-2 rounded-lg text-white font-semibold transition duration-300`;
  const colors = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    red: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button className={`${base} ${colors[color]}`} onClick={onClick}>
      {text}
    </button>
  );
}