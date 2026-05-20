import { Award, FlaskConical, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: Award, title: "PREMIUM", subtitle: "QUALITY" },
  { icon: FlaskConical, title: "LAB", subtitle: "TESTED" },
  { icon: Sparkles, title: "EXPERTLY", subtitle: "CURATED" },
  { icon: ShieldCheck, title: "100%", subtitle: "SATISFACTION" },
];

export function TrustStrip() {
  return (
    <section className="mt-1.5 rounded-xl border border-white/10 bg-[#090f14] px-3 py-2.5">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title} className="flex items-center gap-2.5 px-1 py-0.5">
            <item.icon className="h-3.5 w-3.5 text-lime-300" />
            <div className="text-[10px] font-semibold tracking-[0.12em] text-slate-200">
              <p>{item.title}</p>
              <p>{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
