import { useState, useRef } from 'react';
import { ScanLine, Eraser, Copy, Check, ChevronDown, FileText, ArrowRight } from 'lucide-react';
import type { ScanResult, SampleMessage } from '@/lib/types';
import { SAMPLE_MESSAGES } from '@/lib/samples';
import { SectionTitle } from '@/components/ui';
import { EvidenceReport } from '@/components/EvidenceReport';

interface ScannerProps {
  onScan: (text: string) => void;
  onClear: () => void;
  result: ScanResult | null;
  input: string;
  setInput: (t: string) => void;
  error: string | null;
}

export function Scanner({ onScan, onClear, result, input, setInput, error }: ScannerProps) {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const MAX = 20000;

  const handleAnalyze = () => {
    onScan(input);
  };

  const handleClear = () => {
    setInput('');
    onClear();
    setDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const loadSample = (s: SampleMessage) => {
    setInput(s.text);
    setDropdownOpen(false);
    onClear();
  };

  const overLimit = input.length > MAX;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Message Scanner"
        sub="Paste any SMS, WhatsApp message, email text or link. Analysis runs entirely in your browser — nothing is uploaded."
      />

      <div className="rounded-2xl glass p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
            >
              <FileText className="h-3.5 w-3.5" /> Samples
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {input.length > 0 && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
              >
                <Eraser className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
          <span className={`text-xs tabular-nums ${overLimit ? 'text-rose-400' : 'text-slate-500'}`}>
            {input.length.toLocaleString()} / {MAX.toLocaleString()}
          </span>
        </div>

        {dropdownOpen && (
          <div className="mb-3 animate-fade-up overflow-hidden rounded-xl border border-white/10 bg-navy-850">
            {SAMPLE_MESSAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => loadSample(s)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/5"
              >
                <span className="truncate">{s.label}</span>
                <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                  {s.channel}
                </span>
              </button>
            ))}
          </div>
        )}

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Paste a suspicious message here…\n\nExample: "Dear Customer, your bank account will be suspended within 24 hours…"'}
          rows={8}
          maxLength={MAX + 100}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-white/10 bg-navy-900/60 p-4 font-mono text-sm leading-relaxed text-slate-200 placeholder:text-slate-600 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={input.trim().length === 0 || overLimit}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <ScanLine className="h-4 w-4" />
            Analyze Message
          </button>
          {input.length > 0 && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/5"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>

        {overLimit && (
          <p className="mt-2 text-xs text-rose-400">Message exceeds the {MAX.toLocaleString()} character limit. Trim it before analyzing.</p>
        )}
        {error && (
          <p className="mt-2 text-xs text-rose-400">{error}</p>
        )}
      </div>

      {result && (
        <div>
          <EvidenceReport result={result} originalText={input} />
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <ScanLine className="h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">Load a sample or paste a message, then press Analyze.</p>
          <p className="flex items-center gap-1 text-xs text-slate-600">
            Results appear here <ArrowRight className="h-3 w-3" /> with highlighted evidence and a full report.
          </p>
        </div>
      )}
    </div>
  );
}
