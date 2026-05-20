'use client';

import { Leaf, Lock } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-[#02030a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="group flex items-center gap-2">
            <Leaf className="h-12 w-12 text-lime-300" />
            <div className="text-left">
              <p className="text-2xl font-black leading-none tracking-[0.22em] text-white">
                ELEVATE
              </p>
              <p className="text-xs tracking-[0.2em] text-slate-400">
                CANNABIS CO.
              </p>
            </div>
          </div>
        </div>

        {/* Lock Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-white/5 p-6 border border-white/10">
            <Lock className="h-12 w-12 text-lime-300" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Private Access Only
        </h1>
        <p className="text-slate-300 mb-2">
          This site is invite-only and requires device registration.
        </p>
        <p className="text-slate-400 text-sm">
          If you believe you should have access, please contact the site administrator for an invitation link.
        </p>

        {/* Info Box */}
        <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10 text-left">
          <h2 className="text-sm font-semibold text-lime-300 mb-2">
            How it works:
          </h2>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• You need a unique invitation link to access this site</li>
            <li>• Each link is single-use and expires in 2 hours</li>
            <li>• Once registered, your device will have permanent access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
