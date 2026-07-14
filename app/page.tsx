export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
      <div className="text-center flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Subtle brand color backglow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-full pointer-events-none" />
          <img
            src="/reds-tag.svg"
            alt="REDS Logo"
            className="h-32 w-auto object-contain relative z-10"
          />
        </div>
        <p className="text-2xl font-light text-slate-300 tracking-wide">
          Experience Operating System
        </p>
      </div>
    </div>
  );
}
