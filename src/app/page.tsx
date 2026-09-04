import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-sans)] flex flex-col gap-12 items-center text-center">
      <header className="flex flex-col gap-4 items-center">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
          did you ping it
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          Small networking tasks, solved instantly. Free, fast, and privacy-first.
        </p>
      </header>

      <main className="flex flex-col gap-8 w-full max-w-3xl items-center">
        {/* Search Bar Placeholder */}
        <div className="w-full relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-neon-cyan)] rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <input
            type="text"
            placeholder="What networking problem are you solving?"
            className="relative w-full glass-panel rounded-xl px-6 py-4 text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-neon-green)]"
          />
        </div>

        {/* Categories Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
          {["Subnetting", "IP Addressing", "DNS", "Ports & Protocols", "Network Testing", "Calculators"].map((cat) => (
            <Link 
              href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`} 
              key={cat}
              className="glass-panel p-4 rounded-lg hover:border-[var(--color-neon-cyan)] transition-colors group cursor-pointer"
            >
              <h3 className="font-semibold text-gray-300 group-hover:text-[var(--color-neon-cyan)]">{cat}</h3>
            </Link>
          ))}
        </div>
      </main>

      <footer className="mt-auto text-sm text-gray-500">
        <p>No account required. 100% client-side processing where practical.</p>
      </footer>
    </div>
  );
}
