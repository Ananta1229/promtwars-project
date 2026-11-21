import { AlertTriangle, LinkIcon, ShieldCheck, Lightbulb } from 'lucide-react';
import type { ScanResult, Indicator } from '@/lib/types';
import { SEVERITY_STYLES, LEVEL_STYLES } from '@/lib/ui';
import { LevelIcon, LocalBadge } from '@/components/ui';
import { HighlightedText } from '@/components/HighlightedText';

export function EvidenceReport({ result, originalText }: { result: ScanResult; originalText: string }) {
  const levelStyle = LEVEL_STYLES[result.level];
  const hasUrls = result.urls.length > 0;

  return (
    <div className="animate-fade-up space-y-4">
      {/* Verdict card */}
      <div className={`rounded-2xl border p-5 sm:p-6 ${levelStyle.ring}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <LevelIcon level={result.level} className="h-12 w-12" />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Assessment</p>
              <h3 className={`text-2xl font-bold ${levelStyle.text}`}>{result.level}</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                Heuristic score {result.score}/100 · {result.indicators.length} indicator{result.indicators.length === 1 ? '' : 's'}
                {hasUrls ? ` · ${result.urls.length} URL${result.urls.length === 1 ? '' : 's'} inspected` : ''}
              </p>
            </div>
          </div>
          <LocalBadge />
        </div>

        {/* Score bar */}
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${levelStyle.bar} transition-all duration-700`}
              style={{ width: `${Math.max(4, result.score)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-slate-500">
            <span>0 · calm</span><span>50 · caution</span><span>100 · danger</span>
          </div>
        </div>

        <ul className="mt-4 space-y-1.5">
          {result.rationale.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
              {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex gap-2 rounded-lg bg-navy-900/70 p-3 text-xs leading-relaxed text-slate-400">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
          {result.safeStatement}
        </p>
      </div>

      {/* Highlighted message */}
      {originalText.trim().length > 0 && (
        <div className="rounded-2xl glass p-5">
          <h4 className="mb-3 text-sm font-semibold text-white">Message with suspicious phrases highlighted</h4>
          <HighlightedText text={originalText} highlights={result.highlights} />
          <div className="mt-3 flex flex-wrap gap-3">
            {(['critical', 'high', 'medium', 'low'] as const).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className={`h-2 w-2 rounded-full ${SEVERITY_STYLES[s].dot}`} />
                {SEVERITY_STYLES[s].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Indicators */}
      {result.indicators.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Detected indicators</h4>
          {result.indicators.map((ind) => <IndicatorCard key={ind.id} ind={ind} />)}
        </div>
      ) : (
        <div className="rounded-2xl glass p-5 text-sm text-slate-300">
          <p className="flex items-center gap-2 font-medium text-white">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> No known scam patterns matched
          </p>
          <p className="mt-2 text-slate-400">
            The engine found no suspicious wording it recognises. That is not a guarantee the message is genuine — when in
            doubt, verify the sender through an official channel.
          </p>
        </div>
      )}

      {/* URL findings */}
      {hasUrls && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">URL inspection (structural — links were never opened)</h4>
          {result.urls.map((u, i) => (
            <div key={i} className="rounded-2xl glass p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <LinkIcon className="h-3.5 w-3.5" />
                <span className="break-all font-mono text-slate-300">{u.url}</span>
              </div>
              {u.findings.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {u.findings.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_STYLES[f.severity].dot}`} />
                      {f.point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-300">No structural red flags found in this address.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IndicatorCard({ ind }: { ind: Indicator }) {
  const s = SEVERITY_STYLES[ind.severity];
  return (
    <div className="group rounded-2xl glass p-5 glass-hover">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="flex items-center gap-2 font-semibold text-white">
          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
          {ind.name}
        </h5>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.chip}`}>{s.label}</span>
      </div>

      {ind.evidence.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ind.evidence.map((e, i) => (
            <span key={i} className="rounded-md bg-navy-900/80 border border-white/10 px-2 py-0.5 text-xs font-mono text-slate-300">
              “{e}”
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{ind.explanation}</p>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-300" />
        <p className="text-xs leading-relaxed text-blue-100">{ind.action}</p>
      </div>
    </div>
  );
}
