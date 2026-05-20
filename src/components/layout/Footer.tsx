import Link from "next/link";
import {
  Leaf,
} from "lucide-react";
import { footerColumns } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-white/10 bg-[#05080b]">
      <div className="mx-auto w-full max-w-[1540px] px-4 py-6 md:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-lime-300" />
              <div>
                <p className="text-xl font-black tracking-[0.22em] text-white">ELEVATE</p>
                <p className="text-[10px] tracking-[0.2em] text-slate-400">CANNABIS CO.</p>
              </div>
            </div>
            <p className="mt-4 max-w-[220px] text-xs leading-5 tracking-[0.1em] text-slate-300">
              PREMIUM CANNABIS. UNMATCHED VIBES.
            </p>
          </div>

          <FooterColumn title="SHOP" items={footerColumns.shop} />
        </div>

        <p className="mt-4 text-xs text-slate-400">18+ | For adults 21+ only. Keep out of reach of children. Follow all local laws.</p>

        <p className="mt-3 text-xs text-slate-500">© 2024 Elevate Cannabis Co. All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-black tracking-[0.16em] text-white">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="text-xs text-slate-300 transition hover:text-lime-300">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
