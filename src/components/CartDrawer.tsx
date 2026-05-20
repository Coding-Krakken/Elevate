"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

export function CartDrawer() {
  const { cartItems, isCartOpen, closeCart, removeFromCart, subtotal } = useSiteStore();

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [closeCart, isCartOpen]);

  return (
    <div
      className={`fixed inset-0 z-[80] transition ${
        isCartOpen ? "pointer-events-auto bg-black/65" : "pointer-events-none bg-black/0"
      }`}
      aria-hidden={!isCartOpen}
      onClick={closeCart}
    >
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md border-l border-white/10 bg-[#0a1015] p-5 transition duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Cart drawer"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold tracking-[0.12em] text-white">YOUR CART</h3>
          <button
            className="rounded-lg border border-white/20 p-2 text-slate-300 hover:text-white"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 overflow-y-auto pb-44">
          {cartItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
              Your cart is empty. Add products from the homepage to continue.
            </div>
          ) : (
            cartItems.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.size}</p>
                  <p className="mt-1 text-sm font-bold text-lime-300">${item.price}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-xs text-slate-300">x{item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-md border border-white/20 p-1.5 text-slate-300 hover:text-white"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a1015] p-5">
          <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
            <span>Subtotal</span>
            <span className="text-lg font-black text-white">${subtotal.toFixed(2)}</span>
          </div>
          <button
            disabled
            className="w-full rounded-xl bg-lime-300/70 px-4 py-3 text-sm font-black tracking-[0.11em] text-black disabled:cursor-not-allowed"
          >
            CHECKOUT DISABLED
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Demo mode only. No checkout, payment, or regulated-product shipping enabled.
          </p>
        </div>
      </aside>
    </div>
  );
}
