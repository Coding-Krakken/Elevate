import Link from "next/link";
import { Beaker, CircleCheck, Globe, Leaf, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { footerColumns } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="mt-4 border-t border-white/10 bg-[#05080b]">
      <div className="mx-auto w-full max-w-[1540px] px-4 py-6 md:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr_0.9fr]">
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
          <FooterColumn title="COMPANY" items={footerColumns.company} />
          <FooterColumn title="SUPPORT" items={footerColumns.support} />

          <div>
            <h4 className="mb-3 text-xs font-black tracking-[0.16em] text-white">STAY ELEVATED</h4>
            <p className="mb-3 text-xs text-slate-300">
              Get exclusive deals, new product alerts, and more.
            </p>
            <form className="flex overflow-hidden rounded-lg border border-white/15 bg-white/5">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button className="bg-lime-300 px-3 text-sm font-black text-black" type="button">
                {"->"}
              </button>
            </form>
            <div className="mt-4 flex items-center gap-2 text-slate-300">
              <MessageCircle className="h-4 w-4" />
              <Globe className="h-4 w-4" />
              <Send className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 text-xs text-slate-200">
              <Beaker className="h-4 w-4 text-lime-300" />
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.1em]">LAB TESTED</span>
                <span className="text-[11px] text-slate-400">For Purity & Potency</span>
              </span>
            </p>
            <p className="inline-flex items-center gap-2 text-xs text-slate-200">
              <ShieldCheck className="h-4 w-4 text-lime-300" />
              <span>
                <span className="block text-[11px] font-semibold tracking-[0.1em]">CA LICENSED</span>
                <span className="text-[11px] text-slate-400">100% Compliant</span>
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <p>LICENSE #: C10-0000000-LIC</p>
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-1.5 text-[11px]">
              <CircleCheck className="h-3.5 w-3.5 text-lime-300" /> 100% Compliant
            </p>
          </div>
          <p>18+ | For adults 21+ only. Keep out of reach of children. Follow all local laws.</p>
        </div>

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
