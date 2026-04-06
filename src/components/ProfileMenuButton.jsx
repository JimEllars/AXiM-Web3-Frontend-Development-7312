import SafeIcon from '../common/SafeIcon';

export default function ProfileMenuButton({ icon, label, danger, onClick, ...props }) {
  const baseClasses = "w-full flex items-center gap-3 p-3 text-[0.65rem] font-mono uppercase transition-all";
  const colors = danger
    ? "text-red-500 hover:bg-red-500/5"
    : "text-zinc-400 hover:text-white hover:bg-white/5";

  return (
    <button className={`${baseClasses} ${colors}`} onClick={onClick} {...props}>
      <SafeIcon icon={icon} /> {label}
    </button>
  );
}