import type { UrlFinding, Severity } from '@/lib/types';

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
  'cutt.ly', 'rb.gy', 'tiny.cc', 'rebrand.ly', 'shorturl.at', 'urlz.fr',
  'bl.ink', 's.id', 'lnkd.in', 'shorte.st', 'adf.ly',
]);

const TRUSTED_BRANDS: Record<string, string> = {
  'sbi': 'State Bank of India',
  'onlinesbi': 'State Bank of India',
  'hdfcbank': 'HDFC Bank',
  'hdfc': 'HDFC Bank',
  'icici': 'ICICI Bank',
  'axis': 'Axis Bank',
  'axisbank': 'Axis Bank',
  'icicibank': 'ICICI Bank',
  'kotak': 'Kotak Mahindra Bank',
  'paytm': 'Paytm',
  'phonepe': 'PhonePe',
  'amazon': 'Amazon',
  'flipkart': 'Flipkart',
  'iran': 'IRCTC',
  'irctc': 'IRCTC',
  'aadhaar': 'UIDAI',
  'uidai': 'UIDAI',
  'incometax': 'Income Tax Department',
  'gst': 'GST Portal',
  'rbi': 'Reserve Bank of India',
  'google': 'Google',
  'microsoft': 'Microsoft',
  'apple': 'Apple',
  'whatsapp': 'WhatsApp',
  'facebook': 'Facebook',
  'instagram': 'Instagram',
  'amazonpay': 'Amazon Pay',
  'fedex': 'FedEx',
  'dhl': 'DHL',
  'bluedart': 'Bluedart',
  'delhivery': 'Delhivery',
  'indiapost': 'India Post',
};

const SUSPICIOUS_CHARS = /[{}|\\^`"<>\s[\]]|@.*(?:\.|\/)/;
const ENCODED = /%(?:[0-9a-fA-F]{2}){2,}|\b(?:xn--)/;

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 2) return Math.abs(m - n);
  const dp = new Array(n + 1).fill(0).map((_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[n];
}

/** Structural-only inspection. This function never fetches, opens or resolves the URL. */
export function inspectUrl(input: string): UrlFinding {
  const trimmed = input.trim().replace(/[).,'";]+$/, '');
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;

  let host = '';
  let protocol = '';
  try {
    const u = new URL(withScheme);
    host = u.hostname.toLowerCase();
    protocol = u.protocol.replace(':', '');
  } catch {
    return {
      url: trimmed,
      host: trimmed,
      protocol: 'unknown',
      isHttps: false,
      isIpHost: false,
      usesShortener: false,
      suspiciousChars: true,
      encodedPatterns: false,
      manySubdomains: false,
      embeddedDomain: false,
      brandLookalike: null,
      riskyPort: false,
      findings: [{ point: 'This text is not a valid web address, which itself is a warning sign.', severity: 'medium' }],
      score: 20,
    };
  }

  const findings: { point: string; severity: Severity }[] = [];
  let score = 0;

  const isHttps = protocol === 'https';
  if (!isHttps) {
    findings.push({ point: 'No encryption (HTTP, not HTTPS). Any information entered can be intercepted.', severity: 'medium' });
    score += 20;
  }

  const isIpHost = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host) || host.startsWith('[');
  if (isIpHost) {
    findings.push({ point: 'The address uses a raw IP number instead of a domain name — common in fraud links.', severity: 'high' });
    score += 30;
  }

  const usesShortener = SHORTENERS.has(host);
  if (usesShortener) {
    findings.push({ point: 'Shortened link: the true destination is hidden until you click. Expand it first.', severity: 'medium' });
    score += 20;
  }

  const suspiciousChars = SUSPICIOUS_CHARS.test(input);
  if (suspiciousChars) {
    findings.push({ point: 'Contains unusual characters (spaces, symbols or an embedded "@").', severity: 'medium' });
    score += 15;
  }

  const encodedPatterns = ENCODED.test(input);
  if (encodedPatterns) {
    findings.push({ point: 'Contains encoded (percent % or xn--) text, often used to disguise the real destination.', severity: 'medium' });
    score += 15;
  }

  const labels = host.split('.');
  const manySubdomains = labels.length >= 5;
  if (manySubdomains) {
    findings.push({ point: 'Unusually deep subdomain chain — a classic trick to bury the real domain.', severity: 'medium' });
    score += 15;
  }

  // Lookalike detection on the registrant domain (the two labels before the path).
  // "onlinesbi.sbi" is genuine; "sbi-kycupdate.xyz" or "hdfcsecure-verify.top" are not.
  const registrantLabels = labels.slice(-2); // e.g. ["sbi-kycupdate", "xyz"]
  const brandName = registrantLabels[0];
  const tld = registrantLabels[1];
  const KNOWN_GOOD_TLDS = new Set(['sbi', 'com', 'in', 'co.in', 'org', 'net', 'io']);
  const compact = brandName.replace(/[-_.]/g, '');
  let brandLookalike: string | null = null;

  const exactGenuine = Object.entries(TRUSTED_BRANDS).some(
    ([token]) =>
      // genuine: brand token appears as its own label with a trusted TLD, e.g. onlinesbi.sbi
      (brandName === token || brandName === 'online' + token || brandName === token + 'bank') && KNOWN_GOOD_TLDS.has(tld)
  );

  if (!exactGenuine) {
    for (const [token, brand] of Object.entries(TRUSTED_BRANDS)) {
      if (token.length < 3) continue;
      const d = levenshtein(compact, token);
      const containsBrand = compact.includes(token) && compact.length > token.length;
      if (d === 0 && !containsBrand) continue; // compact equals token but was flagged exactGenuine above
      if ((d > 0 && d <= 2) || containsBrand) {
        brandLookalike = brand;
        break;
      }
    }
  }

  const embeddedDomain = labels.length >= 3 && Object.keys(TRUSTED_BRANDS).some((t) => labels.slice(0, -2).some((l) => l.includes(t)));
  if (embeddedDomain && !brandLookalike) {
    findings.push({ point: 'A well-known brand name appears in a subdomain, but the real domain is different — a common impersonation trick.', severity: 'high' });
    score += 30;
  }

  if (brandLookalike) {
    findings.push({
      point: `Looks like an imitation of ${brandLookalike} ("${host}") — check the exact spelling carefully.`,
      severity: 'high',
    });
    score += 35;
  }

  const portMatch = /^https?:\/\/[^/]+:(\d+)/i.exec(trimmed);
  const port = portMatch ? Number(portMatch[1]) : null;
  const riskyPort = port !== null && ![80, 443, 8443].includes(port);
  if (riskyPort) {
    findings.push({ point: `Unusual port number (${port}) in the address.`, severity: 'low' });
    score += 10;
  }

  if (['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'work', 'click', 'link', 'live', 'rest'].includes(tld)) {
    findings.push({ point: `Uses a ".${tld}" ending, which is cheap to register and common in abuse.`, severity: 'medium' });
    score += 15;
  }

  return {
    url: trimmed,
    host,
    protocol,
    isHttps,
    isIpHost,
    usesShortener,
    suspiciousChars,
    encodedPatterns,
    manySubdomains,
    embeddedDomain,
    brandLookalike,
    riskyPort,
    findings,
    score: Math.min(100, score),
  };
}

export function extractUrls(text: string): string[] {
  const re = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;
  const bare = /(?:^|\s)(?:[\w-]+\.)+(?:com|net|org|in|io|co|xyz|top|info|biz|ru|tk|ml|ga|cf|gq|link|live|online|site|shop|club|app|me)(?:\/[^\s<>"']*)?/gi;
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = re.exec(text)) !== null && guard < 50) {
    guard++;
    found.add(m[0]);
  }
  guard = 0;
  while ((m = bare.exec(text)) !== null && guard < 50) {
    guard++;
    const candidate = m[0].trim();
    if (!candidate.toLowerCase().startsWith('www.') && !/https?:\/\//i.test(candidate)) {
      // Only add if not already covered by a scheme match
      const covered = [...found].some((f) => f.includes(candidate.replace(/^\s+/, '')));
      if (!covered) found.add(candidate);
    }
  }
  return [...found];
}
