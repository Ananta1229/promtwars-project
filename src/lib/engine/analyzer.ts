import type { Indicator, ScanResult, Severity } from '@/lib/types';
import { PATTERNS, HIGHLIGHT_REGEXPS } from '@/lib/engine/patterns';
import { scoreFromSeverities, decideLevel, SAFE_STATEMENT } from '@/lib/engine/scoring';
import { extractUrls, inspectUrl } from '@/lib/urlinspector/inspector';

export function normalizeText(raw: string): string {
  return raw
    .replace(/\u00A0/g, ' ')
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, '')
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\uFF10-\uFF19]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFF10 + 0x30))
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

const STRONG: Severity[] = ['critical', 'high'];

function uniqueMatches(matches: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const m of matches) {
    const key = m.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(m.trim());
    }
    if (out.length >= 4) break;
  }
  return out;
}

export function analyze(rawInput: string): ScanResult {
  const text = rawInput.slice(0, 20000); // hard cap for safety
  const normalized = normalizeText(text);

  const indicators: Indicator[] = [];
  for (const def of PATTERNS) {
    const matches: string[] = [];
    let hits = 0;
    for (const re of def.patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      let guard = 0;
      while ((m = re.exec(normalized)) !== null && guard < 50) {
        guard++;
        hits++;
        if (matches.length < 8) matches.push(m[0]);
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
    if (hits > 0) {
      indicators.push({
        id: def.id,
        name: def.name,
        evidence: uniqueMatches(matches),
        explanation: def.explanation,
        severity: def.severity,
        action: def.action,
      });
    }
  }

  // URL inspection (structural, never fetched)
  const urlStrings = extractUrls(normalized);
  const urls = urlStrings.slice(0, 5).map((u) => inspectUrl(u));

  // The bare "Embedded Link" info indicator adds little on top of real URL findings.
  const scoreSeverities: Severity[] = indicators
    .filter((ind) => !(ind.id === 'link-injection' && urls.length > 0))
    .map((ind) => ind.severity);
  for (const u of urls) {
    for (const f of u.findings) scoreSeverities.push(f.severity);
  }
  const score = scoreFromSeverities(scoreSeverities);

  const strongCount = indicators.filter((ind) => STRONG.includes(ind.severity)).length +
    urls.filter((u) => u.findings.some((f) => STRONG.includes(f.severity))).length;
  const hasCritical = indicators.some((ind) => ind.severity === 'critical');
  const totalIndicators = indicators.length + urls.reduce((n, u) => n + u.findings.length, 0);

  const { level, rationale } = decideLevel(score, strongCount, totalIndicators, urls.length, hasCritical);

  // Visual highlight ranges over the original (non-normalized) input
  const highlights = collectHighlights(text);

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    scannedAt: new Date().toISOString(),
    textLength: text.length,
    indicators,
    urls,
    score,
    level,
    rationale,
    highlights,
    safeStatement: SAFE_STATEMENT,
  };
}

function collectHighlights(text: string): { start: number; end: number; severity: Severity }[] {
  const out: { start: number; end: number; severity: Severity }[] = [];
  const taken: [number, number][] = [];
  for (const { re, severity } of HIGHLIGHT_REGEXPS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(text)) !== null && guard < 200) {
      guard++;
      const start = m.index;
      const end = m.index + m[0].length;
      if (end > start && !taken.some(([s, e]) => start < e && end > s)) {
        taken.push([start, end]);
        out.push({ start, end, severity });
      }
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return out.sort((a, b) => a.start - b.start);
}
