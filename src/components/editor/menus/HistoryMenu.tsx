"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { generateDeviceFingerprint } from "@/lib/fingerprint";

type SnapshotItem = {
  name: string;
  size: number;
  modifiedAt: string;
};

type SnapshotPreview = {
  snapshot: string;
  stats: {
    changedFields: number;
    hasMore: boolean;
    productsNow: number;
    productsAfterRestore: number;
    offersNow: number;
    offersAfterRestore: number;
    testimonialsNow: number;
    testimonialsAfterRestore: number;
    categoriesNow: number;
    categoriesAfterRestore: number;
  };
  changes: Array<{
    path: string;
    before: string;
    after: string;
  }>;
  groupedChanges: Record<string, number>;
};

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function HistoryMenu() {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [preview, setPreview] = useState<SnapshotPreview | null>(null);
  const [selectedScope, setSelectedScope] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string>("");

  const loadSnapshots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const fingerprint = await generateDeviceFingerprint();
      const response = await fetch("/api/content/history", {
        headers: {
          "x-device-fingerprint": fingerprint,
        },
      });
      if (!response.ok) {
        setError("Could not load history.");
        return;
      }
      const data = (await response.json()) as { snapshots?: SnapshotItem[] };
      setSnapshots(Array.isArray(data.snapshots) ? data.snapshots : []);
    } catch {
      setError("Could not load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshots();
  }, [loadSnapshots]);

  const restoreSnapshot = useCallback(
    async (snapshot: string) => {
      const confirmed = window.confirm(
        "Restore this snapshot? Your current content will be replaced. A pre-restore backup will be created automatically.",
      );
      if (!confirmed) {
        return;
      }

      setRestoring(snapshot);
      setError("");
      try {
        const fingerprint = await generateDeviceFingerprint();
        const response = await fetch("/api/content/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-device-fingerprint": fingerprint,
          },
          body: JSON.stringify({ snapshot }),
        });

        if (!response.ok) {
          setError("Restore failed.");
          return;
        }

        window.sessionStorage.setItem("editor-restore-success", "Snapshot restored successfully");
        window.location.reload();
      } catch {
        setError("Restore failed.");
      } finally {
        setRestoring(null);
      }
    },
    [],
  );

  const previewSnapshot = useCallback(async (snapshot: string) => {
    setPreviewing(snapshot);
    setError("");
    try {
      const fingerprint = await generateDeviceFingerprint();
      const response = await fetch("/api/content/history/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-fingerprint": fingerprint,
        },
        body: JSON.stringify({ snapshot }),
      });

      if (!response.ok) {
        setError("Preview failed.");
        return;
      }

      const data = (await response.json()) as SnapshotPreview;
      setPreview(data);
      setSelectedScope("all");
      setSearch("");
    } catch {
      setError("Preview failed.");
    } finally {
      setPreviewing(null);
    }
  }, []);

  const scopedChanges = useMemo(() => {
    if (!preview) {
      return [];
    }

    let list = preview.changes;
    if (selectedScope !== "all") {
      list = list.filter((change) => {
        const section = (change.path.startsWith("[") ? "root" : change.path).split(/[.[\]]/)[0] || "root";
        return section === selectedScope;
      });
    }

    const q = search.trim().toLowerCase();
    if (!q) {
      return list;
    }

    return list.filter((change) => {
      return (
        change.path.toLowerCase().includes(q) ||
        change.before.toLowerCase().includes(q) ||
        change.after.toLowerCase().includes(q)
      );
    });
  }, [preview, search, selectedScope]);

  const scopeEntries = useMemo(() => {
    if (!preview) {
      return [];
    }
    return Object.entries(preview.groupedChanges)
      .sort((a, b) => b[1] - a[1])
      .map(([scope, count]) => ({ scope, count }));
  }, [preview]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-300">Recent saved snapshots</p>
        <button
          onClick={loadSnapshots}
          className="rounded-lg border border-white/15 px-2.5 py-1 text-[10px] text-slate-300 hover:border-blue-400 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      {loading ? (
        <p className="text-xs text-slate-500">Loading history...</p>
      ) : snapshots.length === 0 ? (
        <p className="text-xs text-slate-500">No snapshots yet.</p>
      ) : (
        <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1">
          {snapshots.map((snapshot) => (
            <div key={snapshot.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
              <p className="truncate text-xs font-semibold text-white">{snapshot.name}</p>
              <p className="mt-1 text-[10px] text-slate-400">
                {new Date(snapshot.modifiedAt).toLocaleString()} · {formatBytes(snapshot.size)}
              </p>
              <button
                onClick={() => restoreSnapshot(snapshot.name)}
                disabled={Boolean(restoring)}
                className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-amber-400/40 px-2.5 py-1.5 text-[10px] font-semibold text-amber-300 hover:bg-amber-400/10 disabled:opacity-40"
              >
                <RotateCcw className="h-3 w-3" />
                {restoring === snapshot.name ? "Restoring..." : "Restore"}
              </button>
              <button
                onClick={() => previewSnapshot(snapshot.name)}
                disabled={Boolean(previewing)}
                className="ml-2 mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-sky-400/40 px-2.5 py-1.5 text-[10px] font-semibold text-sky-300 hover:bg-sky-400/10 disabled:opacity-40"
              >
                <Eye className="h-3 w-3" />
                {previewing === snapshot.name ? "Loading..." : "Preview Diff"}
              </button>
            </div>
          ))}
        </div>
      )}

      {preview ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-white">Diff Preview: {preview.snapshot}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => restoreSnapshot(preview.snapshot)}
                disabled={Boolean(restoring)}
                className="inline-flex min-h-[28px] items-center gap-1 rounded border border-amber-400/40 px-2 py-0.5 text-[10px] font-semibold text-amber-300 hover:bg-amber-400/10 disabled:opacity-40"
              >
                <RotateCcw className="h-3 w-3" />
                Restore This
              </button>
              <button
                onClick={() => setPreview(null)}
                className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300 md:grid-cols-3">
            <p>Changed: {preview.stats.changedFields}{preview.stats.hasMore ? "+" : ""}</p>
            <p>Products: {preview.stats.productsNow}{" -> "}{preview.stats.productsAfterRestore}</p>
            <p>Offers: {preview.stats.offersNow}{" -> "}{preview.stats.offersAfterRestore}</p>
            <p>Testimonials: {preview.stats.testimonialsNow}{" -> "}{preview.stats.testimonialsAfterRestore}</p>
            <p>Categories: {preview.stats.categoriesNow}{" -> "}{preview.stats.categoriesAfterRestore}</p>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedScope("all")}
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  selectedScope === "all"
                    ? "border-blue-400 text-blue-300 bg-blue-500/10"
                    : "border-white/15 text-slate-300"
                }`}
              >
                all ({preview.changes.length})
              </button>
              {scopeEntries.map((entry) => (
                <button
                  key={entry.scope}
                  onClick={() => setSelectedScope(entry.scope)}
                  className={`rounded-full border px-2 py-0.5 text-[10px] ${
                    selectedScope === entry.scope
                      ? "border-blue-400 text-blue-300 bg-blue-500/10"
                      : "border-white/15 text-slate-300"
                  }`}
                >
                  {entry.scope} ({entry.count})
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search path or values"
              className="w-full min-h-[34px] rounded border border-white/15 bg-black/20 px-2 py-1 text-[10px] text-white placeholder:text-slate-500"
            />
          </div>

          <div className="mt-2 max-h-[38vh] space-y-1 overflow-y-auto rounded border border-white/5 bg-black/20 p-2">
            {scopedChanges.length === 0 ? (
              <p className="text-[10px] text-slate-500">No differences detected.</p>
            ) : (
              scopedChanges.map((change) => (
                <div key={`${change.path}-${change.before}-${change.after}`} className="rounded border border-white/5 p-2 text-[10px]">
                  <p className="font-semibold text-slate-200">{change.path}</p>
                  <div className="mt-1 grid gap-1 md:grid-cols-2">
                    <div className="rounded border border-white/10 bg-white/[0.02] p-1.5">
                      <p className="mb-0.5 text-[9px] uppercase tracking-wide text-slate-400">Now</p>
                      <p className="break-all text-slate-300">{change.before}</p>
                    </div>
                    <div className="rounded border border-lime-300/20 bg-lime-400/[0.06] p-1.5">
                      <p className="mb-0.5 text-[9px] uppercase tracking-wide text-lime-300">Snapshot</p>
                      <p className="break-all text-lime-200">{change.after}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
