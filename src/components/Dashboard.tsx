import { ShieldCheck, Cpu, FileSearch, LinkIcon, Activity, Gauge } from 'lucide-react';
import type { ScanResult } from '@/lib/types';
import { LEVEL_STYLES, formatTime } from '@/lib/ui';
import { SectionTitle } from '@/components/ui';

interface HistoryEntry {
  result: ScanResult;
  preview: string;
}

export function Dashboard({ history, onGo }: { history: HistoryEntry[]; onGo: (tab: 'scan' | 'url' | 'awareness' | 'privacy') => void }) {
  const recent = history.slice(0, 5);
  const totalScans = history.length;
  const highFindings = history.filter((h) => h.result.level === 'High Risk').length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy-first · runs entirely in your browser
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Don't Trust. <span className="text-gradient">Verify.</span> Stay Protected.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            ScamShield dissects suspicious SMS, WhatsApp forwards, emails and links — showing you exactly which words and
            structures raise red flags, why they matter, and what to do next. Your messages never leave this device.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onGo('scan')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
            >
              <FileSearch className="h-4 w-4" /> Scan a message
            </button>
            <button
              onClick={() => onGo('url')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <LinkIcon className="h-4 w-4" /> Inspect a URL
            </button>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Cpu, title: 'On-device engine', body: '12 pattern families and URL structure analysis run locally — no servers, no uploads.' },
          { icon: FileSearch, title: 'Evidence, not vibes', body: 'Every indicator shows the exact phrase that triggered it and explains the trick being used.' },
          { icon: Gauge, title: 'Honest assessments', body: 'Weak evidence yields "Inconclusive" — never a false promise of "safe".' },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl glass p-5">
            <c.icon className="h-6 w-6 text-blue-300" />
            <h3 className="mt-3 font-semibold text-white">{c.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Session activity */}
      <div>
        <SectionTitle title="This session" sub="Minimal metadata only — message text is never stored. Refreshing clears everything." />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard icon={Activity} label="Messages scanned" value={String(totalScans)} />
          <StatCard icon={ShieldCheck} label="Flagged high risk" value={String(highFindings)} />
          <StatCard icon={Cpu} label="Data sent to servers" value="0 bytes" />
        </div>

        {recent.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl glass">
            <div className="border-b border-white/[0.06] px-5 py-3">
              <h3 className="text-sm font-semibold text-white">Recent scans</h3>
            </div>
            {recent.map((h) => {
              const ls = LEVEL_STYLES[h.result.level];
              return (
                <button
                  key={h.result.id}
                  onClick={() => onGo('scan')}
                  className="flex w-full items-center justify-between gap-3 border-b border-white/[0.04] px-5 py-3 text-left transition last:border-0 hover:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-300">{h.preview}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatTime(h.result.scannedAt)} · {h.result.indicators.length} indicator{h.result.indicators.length === 1 ? '' : 's'} · score {h.result.score}/100
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ls.ring} ${ls.text}`}>
                    {h.result.level}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl glass p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/20">
        <Icon className="h-5 w-5 text-blue-300" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}
