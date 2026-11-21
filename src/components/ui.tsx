import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion, Lock, ScanText } from 'lucide-react';
import type { RiskLevel } from '@/lib/types';
import { SEVERITY_STYLES } from '@/lib/ui';

export function SeverityChip({ severity, label }: { severity: RiskLevel | keyof typeof SEVERITY_STYLES; label?: string }) {
  const styles = SEVERITY_STYLES[severity as keyof typeof SEVERITY_STYLES];
  const text = label ?? (typeof severity === 'string' ? severityLabel(severity) : '');
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles?.chip ?? ''}`}>
      {text}
    </span>
  );
}

function severityLabel(s: string): string {
  return { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', info: 'Info' }[s] ?? s;
}

export function LevelIcon({ level, className }: { level: RiskLevel; className?: string }) {
  const cls = className ?? 'h-8 w-8';
  if (level === 'High Risk') return <ShieldAlert className={`${cls} text-rose-400`} />;
  if (level === 'Medium Risk') return <ShieldAlert className={`${cls} text-amber-400`} />;
  if (level === 'Low Risk') return <ShieldCheck className={`${cls} text-emerald-400`} />;
  return <ShieldQuestion className={`${cls} text-slate-400`} />;
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/20 ${className ?? 'h-9 w-9'}`}>
      <Shield className="h-5 w-5 text-blue-300" />
      <Lock className="absolute -bottom-1 -right-1 h-3 w-3 text-violet-300 bg-navy-900 rounded-full p-[1px]" />
    </div>
  );
}

export function LocalBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-xs font-medium text-emerald-300">
      <ScanText className="h-3.5 w-3.5" />
      Analyzed on this device
    </span>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}
