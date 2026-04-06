export default function DatabaseUplinkError() {
  return (
    <section className="py-16 relative z-10">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <p className="text-zinc-500 font-mono">
          Establishing secure uplink to AXiM Database... If this persists, verify CORS headers on the origin server.
        </p>
      </div>
    </section>
  );
}
