import type { Severity } from '@/lib/types';

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 28,
  high: 18,
  medium: 10,
  low: 5,
  info: 2,
};

export function scoreFromSeverities(severities: Severity[]): number {
  let raw = 0;
  const counts: Record<string, number> = {};
  for (const s of severities) {
    raw += SEVERITY_WEIGHT[s] * (s === 'critical' || s === 'high' ? Math.pow(0.75, counts[s] ?? 0) : 1);
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return Math.min(100, Math.round(raw));
}

export interface LevelDecision {
  level: 'High Risk' | 'Medium Risk' | 'Low Risk' | 'Inconclusive';
  rationale: string[];
}

export function decideLevel(score: number, strongCount: number, totalIndicators: number, urlCount: number, hasCritical: boolean): LevelDecision {
  const rationale: string[] = [];
  if (hasCritical) {
    rationale.push(
      'The message asks for credentials (OTP, PIN, password or card details). No legitimate organisation ever does this, so this is treated as a serious threat regardless of anything else.'
    );
    return { level: 'High Risk', rationale };
  }
  if (strongCount === 0 && totalIndicators <= 1) {
    rationale.push(
      'Only weak or isolated signals were found. Isolated keywords are not proof of fraud, so this scan is reported as Inconclusive rather than safe.'
    );
    return { level: 'Inconclusive', rationale };
  }
  if (score >= 60 || strongCount >= 2) {
    rationale.push(`Heuristic score ${score}/100 with ${strongCount} strong indicator${strongCount > 1 ? 's' : ''} of manipulation, credential theft, or impersonation.`);
    return { level: 'High Risk', rationale };
  }
  if (score >= 30) {
    rationale.push(`Heuristic score ${score}/100 with ${totalIndicators} indicator${totalIndicators === 1 ? '' : 's'} detected. Some signals alone can be legitimate, so treat with caution.`);
    return { level: 'Medium Risk', rationale };
  }
  rationale.push(`Heuristic score ${score}/100. Only mild signals were found, but mild signals are not a guarantee of safety.`);
  if (urlCount > 0) rationale.push('A URL with structural concerns was detected. Review the URL inspection section before trusting any link.');
  return { level: 'Low Risk', rationale };
}

export const SAFE_STATEMENT =
  'This is a heuristic assessment based on textual patterns only. No message can be declared safe automatically — always verify the sender through an official channel before acting.';
