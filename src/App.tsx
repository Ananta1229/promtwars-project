import { useState, useCallback, useMemo } from 'react';
import { LayoutDashboard, ScanLine, Globe, BookOpenCheck, Lock } from 'lucide-react';
import { analyze } from '@/lib/engine/analyzer';
import type { ScanResult } from '@/lib/types';
import { BrandMark } from '@/components/ui';
import { Dashboard } from '@/components/Dashboard';
import { Scanner } from '@/components/Scanner';
import { UrlInspectorPage } from '@/components/UrlInspectorPage';
import { AwarenessCenter, PrivacyCenter } from '@/components/Centers';

type Tab = 'home' | 'scan' | 'url' | 'awareness' | 'privacy';

interface HistoryEntry {
  result: ScanResult;
  preview: string;
}

const TABS: { id: Tab; label: string; icon: typeof ScanLine }[] = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scan', label: 'Scanner', icon: ScanLine },
  { id: 'url', label: 'URL Inspector', icon: Globe },
  { id: 'awareness', label: 'Awareness', icon: BookOpenCheck },
  { id: 'privacy', label: 'Privacy', icon: Lock },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleScan = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResult(null);
      setError('Paste a message first, or load one of the samples.');
      return;
    }
    setError(null);
    try {
      const res = analyze(text);
      setResult(res);
      setHistory((h) => [{ result: res, preview: trimmed.slice(0, 70) }, ...h].slice(0, 20));
    } catch {
      setResult(null);
      setError('Something went wrong while analyzing. Try shortening the message and scanning again.');
    }
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const go = useCallback((t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const body = useMemo(() => {
    switch (tab) {
      case 'home':
        return <Dashboard history={history} onGo={go} />;
      case 'scan':
        return (
          <Scanner
            onScan={handleScan}
            onClear={handleClear}
            result={result}
            input={input}
            setInput={setInput}
            error={error}
          />
        );
      case 'url':
        return <UrlInspectorPage />;
      case 'awareness':
        return <AwarenessCenter />;
      case 'privacy':
        return <PrivacyCenter />;
    }
  }, [tab, history, go, handleScan, handleClear, result, input, error]);

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-navy-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => go('home')} className="flex items-center gap-2.5 text-left">
            <BrandMark />
            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                Scam<span className="text-gradient">Shield</span>
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Verify before you trust</p>
            </div>
          </button>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 sm:inline-flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            On-device analysis active
          </span>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="sticky top-[57px] z-10 border-b border-white/[0.06] bg-navy-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => go(t.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-sm transition ${
                tab === t.id
                  ? 'border-blue-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {body}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs leading-relaxed text-slate-500">
            ScamShield is a privacy-first awareness prototype. All analysis runs locally in your browser; no message content
            is transmitted or stored. Findings are heuristic explanations, not verified threat intelligence or a guarantee
            about any message or link. When in doubt, verify senders through official channels.
          </p>
        </div>
      </footer>
    </div>
  );
}
