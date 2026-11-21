import { useMemo } from 'react';
import type { ScanResult, Severity } from '@/lib/types';
import { HL_CLASS, SEVERITY_STYLES } from '@/lib/ui';

export function HighlightedText({ text, highlights }: { text: string; highlights: ScanResult['highlights'] }) {
  const segments = useMemo(() => {
    const out: { text: string; severity: Severity | null }[] = [];
    let cursor = 0;
    for (const h of highlights) {
      if (h.start > cursor) out.push({ text: text.slice(cursor, h.start), severity: null });
      out.push({ text: text.slice(h.start, h.end), severity: h.severity });
      cursor = h.end;
    }
    if (cursor < text.length) out.push({ text: text.slice(cursor), severity: null });
    return out;
  }, [text, highlights]);

  return (
    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300 font-mono">
      {segments.map((seg, i) =>
        seg.severity ? (
          <mark key={i} className={`${HL_CLASS[seg.severity]} bg-opacity-100`} title={`${SEVERITY_STYLES[seg.severity].label} signal`}>
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}
