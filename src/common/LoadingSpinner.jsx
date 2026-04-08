export default function LoadingSpinner({
  sizeClass = "w-10 h-10",
  colorClass = "border-axim-teal/20 border-t-axim-teal",
  pyClass = "py-24",
  message = null,
  messageClass = "text-zinc-500 font-mono text-sm animate-pulse"
}) {
  return (
    <div className={`${pyClass} flex flex-col justify-center items-center`}>
      <div className={`${sizeClass} border-4 ${colorClass} rounded-full animate-spin ${message ? 'mb-4' : ''}`}></div>
      {message && <p className={messageClass}>{message}</p>}
    </div>
  );
}
