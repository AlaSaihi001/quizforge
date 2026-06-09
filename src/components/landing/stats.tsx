const stats = [
  { value: "10", label: "Free generations/day", suffix: "" },
  { value: "3", label: "Generation modes", suffix: "" },
  { value: "3", label: "Languages supported", suffix: "" },
  { value: "< 30", label: "Seconds per quiz", suffix: "s" },
];

export function LandingStats() {
  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-violet-600 mb-1">
                {stat.value}
                {stat.suffix}
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
