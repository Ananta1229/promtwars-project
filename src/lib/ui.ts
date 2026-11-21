import type { Severity, RiskLevel } from '@/lib/types';

export const SEVERITY_STYLES: Record<Severity, { label: string; chip: string; dot: string; bar: string }> = {
  critical: { label: 'Critical', chip: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400', bar: 'bg-rose-500' },
  high: { label: 'High', chip: 'bg-orange-500/15 text-orange-300 border-orange-500/30', dot: 'bg-orange-400', bar: 'bg-orange-500' },
  medium: { label: 'Medium', chip: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400', bar: 'bg-amber-400' },
  low: { label: 'Low', chip: 'bg-sky-500/15 text-sky-300 border-sky-500/30', dot: 'bg-sky-400', bar: 'bg-sky-400' },
  info: { label: 'Info', chip: 'bg-slate-500/15 text-slate-300 border-slate-500/30', dot: 'bg-slate-400', bar: 'bg-slate-400' },
};

export const HL_CLASS: Record<Severity, string> = {
  critical: 'bg-rose-500/25 text-rose-200 rounded px-0.5',
  high: 'bg-orange-500/25 text-orange-200 rounded px-0.5',
  medium: 'bg-amber-500/20 text-amber-200 rounded px-0.5',
  low: 'bg-sky-500/20 text-sky-200 rounded px-0.5',
  info: 'bg-slate-500/20 text-slate-200 rounded px-0.5',
};

export const LEVEL_STYLES: Record<RiskLevel, { ring: string; text: string; bar: string; emoji: string }> = {
  'High Risk': { ring: 'border-rose-500/40 bg-rose-500/10', text: 'text-rose-300', bar: 'from-rose-500 to-orange-500', emoji: '🛑' },
  'Medium Risk': { ring: 'border-amber-500/40 bg-amber-500/10', text: 'text-amber-300', bar: 'from-amber-500 to-yellow-400', emoji: '⚠️' },
  'Low Risk': { ring: 'border-emerald-500/40 bg-emerald-500/10', text: 'text-emerald-300', bar: 'from-emerald-500 to-teal-400', emoji: '✅' },
  'Inconclusive': { ring: 'border-slate-500/40 bg-slate-500/10', text: 'text-slate-300', bar: 'from-slate-500 to-slate-400', emoji: '❓' },
};

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
