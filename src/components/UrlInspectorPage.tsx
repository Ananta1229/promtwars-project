import { useState } from 'react';
import { Globe, ShieldCheck, ShieldAlert, Lock, Unlock, Ban } from 'lucide-react';
import type { UrlFinding } from '@/lib/types';
import { inspectUrl } from '@/lib/urlinspector/inspector';
import { SEVERITY_STYLES } from '@/lib/ui';
import { SectionTitle } from '@/components/ui';

export function UrlInspectorPage() {
  const [input, setInput] = useState('');
  const [finding, setFinding] = useState<UrlFinding | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = () => {
    const value = input.trim();
    if (!value) {
      setFinding(null);
      setError('Paste a web address to inspect.');
      return;
    }
    if (/\s/.test(value)) {
      setFinding(null);
      setError('Enter a single address with no spaces.');
      return;
    }
    setError(null);
    setFinding(inspectUrl(value));
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="URL Inspector"
        sub="Static structure checks only. ScamShield never opens, visits or previews the addresses you paste."
      />

      <div className="rounded-2xl glass p-4 sm:p-6">
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-200 leading-relaxed">
          <Ban className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            These are structural warning signs, not verified threat intelligence. A clean structure does not prove a site is
            safe — it only means this tool found nothing suspicious about its shape.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInspect()}
            placeholder="e.g. http://sbi-kycupdate.xyz/login"
            spellCheck={false}
            className="flex-1 rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={handleInspect}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98]"
          >
            <Globe className="h-4 w-4" /> Inspect
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      </div>

      {finding && <FindingCard finding={finding} />}
    </div>
  );
}

function FindingCard({ finding }: { finding: UrlFinding }) {
  const bad = finding.findings.length > 0;
  return (
    <div className="animate-fade-up rounded-2xl glass p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all font-mono text-sm text-slate-200">{finding.url}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 ${finding.isHttps ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
              {finding.isHttps ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              {finding.isHttps ? 'HTTPS' : 'HTTP only'}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-slate-300">
              Host: {finding.host}
            </span>
          </div>
        </div>
        {bad ? (
          <ShieldAlert className="h-8 w-8 shrink-0 text-amber-400" />
        ) : (
          <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-400" />
        )}
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 via-amber-500 to-rose-500 transition-all duration-700"
            style={{ width: `${Math.max(4, finding.score)}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Structural concern score: {finding.score}/100</p>
      </div>

      {finding.findings.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {finding.findings.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_STYLES[f.severity].dot}`} />
              {f.point}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-emerald-300">No structural red flags found. Still verify the sender before trusting the link.</p>
      )}
    </div>
  );
}
