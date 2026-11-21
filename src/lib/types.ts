export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Low Risk' | 'Inconclusive';

export interface Indicator {
  id: string;
  name: string;
  evidence: string[];
  explanation: string;
  severity: Severity;
  action: string;
}

export interface UrlFinding {
  url: string;
  host: string;
  protocol: string;
  isHttps: boolean;
  isIpHost: boolean;
  usesShortener: boolean;
  suspiciousChars: boolean;
  encodedPatterns: boolean;
  manySubdomains: boolean;
  embeddedDomain: boolean;
  brandLookalike: string | null;
  riskyPort: boolean;
  findings: { point: string; severity: Severity }[];
  score: number;
}

export interface ScanResult {
  id: string;
  scannedAt: string;
  textLength: number;
  indicators: Indicator[];
  urls: UrlFinding[];
  score: number;
  level: RiskLevel;
  rationale: string[];
  highlights: { start: number; end: number; severity: Severity }[];
  safeStatement: string;
}

export interface SampleMessage {
  id: string;
  label: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'URL';
  text: string;
}
