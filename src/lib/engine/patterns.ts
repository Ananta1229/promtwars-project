import type { Severity } from '@/lib/types';

export interface PatternDef {
  id: string;
  name: string;
  severity: Severity;
  explanation: string;
  action: string;
  // Ordered alternation; each group should be a standalone phrase matcher.
  patterns: RegExp[];
  // Optional: exclude when message is very short and lacks any other signal
  minHits?: number;
}

const i = (src: string) => new RegExp(src, 'gi');
// Template tag used inside pattern definitions; returns raw pattern source.
const r = String.raw;

export const PATTERNS: PatternDef[] = [
  {
    id: 'urgency-suspension',
    name: 'Urgency & Account Suspension Threat',
    severity: 'high',
    explanation:
      'Scammers manufacture panic with deadlines and account closures so you act before thinking. Legitimate institutions do not close accounts within hours by SMS.',
    action: 'Do not tap links or call numbers in the message. Contact your bank using the number on your card or official website.',
    patterns: [
      i(r`\b(?:account|wallet|card|sim)\s+(?:will\s+be|has\s+been|is)\s+(?:suspend(?:ed|s)?|block(?:ed)?|deactivated|closed|frozen)\b`),
      i(r`\b(?:suspend|block|deactivate|close)\s+your\s+(?:account|card|wallet|sim)\b`),
      i(r`\bwithin\s+\d+\s*(?:hours?|hrs?|days?)\b`),
      i(r`\bimmediate(?:ly)?\s+action\s+(?:is\s+)?(?:required|needed)\b`),
      i(r`\bavoid\s+(?:permanent\s+)?(?:suspension|deactivation)\b`),
      i(r`\byour\s+(?:account|kyc)\s+(?:will\s+)?(?:expire|expires|expired|lapse[sd]?)\b`),
      i(r`\blast\s+(?:warning|notice|chance)\b`),
      i(r`\bfinal\s+reminder\b`),
    ],
  },
  {
    id: 'deadline-pressure',
    name: 'Artificial Deadline Pressure',
    severity: 'low',
    explanation:
      'A very short countdown (hours or minutes) is designed to stop you thinking or verifying. Genuine institutions give days and never punish you for double-checking.',
    action: 'Treat any ticking clock as a red flag. Pause and verify through an official channel — real deadlines come with days, not minutes.',
    patterns: [
      i(r`\b(?:within|in)\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)\b`),
      i(r`\b\d+\s*(?:hours?|hrs?|minutes?|mins?)\s+(?:left|remaining|only)\b`),
    ],
  },
  {
    id: 'otp-credential',
    name: 'OTP / Password / Credential Request',
    severity: 'critical',
    explanation:
      'Your OTP, PIN, password or CVV is the final key to your money. No bank, wallet or delivery company ever asks for these — anyone who does is stealing from you.',
    action: 'Never share OTPs, PINs, passwords or card details with anyone, including callers claiming to be staff. Report the attempt to your provider.',
    patterns: [
      i(r`\b(?:otp|o\.t\.p|one\s*time\s*(?:password|code)?|verification\s*code|security\s*code|pin|cvv|cvc|card\s*number|password|passcode)\b[^.?!]{0,60}?\b(?:share|send|confirm|verify|enter|tell|provide|give|reply|forward|read\s*out)\b`),
      i(r`\b(?:share|send|confirm|tell\s*me|provide|give|reply\s*with|forward)\b[^.?!]{0,40}?\b(?:otp|o\.t\.p|one\s*time\s*(?:password|code)?|verification\s*code|security\s*code|pin|cvv|cvc|password|passcode|card\s*(?:number|details))\b`),
      i(r`\b(?:otp|verification\s*code|security\s*code)\s*(?:is|:)\s*\d{4,8}\b`),
      i(r`\bnever\s+share\s+(?:this|the)\s+(?:otp|code)\b`),
    ],
  },
  {
    id: 'fake-kyc',
    name: 'Fake KYC / Verification Pressure',
    severity: 'high',
    explanation:
      'Fake "KYC expiry" messages are a top scam in India. Real KYC re-verification happens inside official apps or branches — never through links in messages.',
    action: 'Open your bank or wallet’s official app yourself to check KYC status. Ignore links and numbers inside the message.',
    patterns: [
      i(r`\bk\.?y\.?c\b(?![^.?!]*\b(?:completed|done|submitted)\b)[^.?!]{0,80}\b(?:expire[sd]?|invalid|incomplete|pending|update|renew|verify|re-?verify|suspend)\b`),
      i(r`\b(?:update|complete|renew|verify|re-?verify)\b[^.?!]{0,30}\bk\.?y\.?c\b`),
      i(r`\bkyc\s+verification\s+(?:required|needed|pending)\b`),
      i(r`\b(?:e-?kyc|re-?kyc)\b`),
      i(r`\b(?:aadhaar|pan\s*card|identity)\s+(?:verification|update)\s+(?:required|pending|needed|expire)\b`),
    ],
  },
  {
    id: 'financial-reward',
    name: 'Financial Reward / Lottery Hook',
    severity: 'high',
    explanation:
      'Prizes you never entered for are bait. The "small processing fee" is the scam — you pay, and the prize never arrives.',
    action: 'Do not pay any fee to receive a prize. Genuine lottery winnings in India are claimed officially, never via SMS links.',
    patterns: [
      i(r`\b(?:you(?:\s*have)?\s*(?:been\s*)?(?:won|selected|chosen)|winner|winning|prize|lottery|lucky\s*(?:draw|winner)|jackpot|cash\s*prize|kbc|mega\s*(?:draw|prize))\b`),
      i(r`\b(?:claim|collect)\s+(?:your\s+)?(?:prize|reward|cash|money|amount)\b`),
      i(r`\b(?:processing|registration|delivery|claim)\s+fee\b`),
      i(r`\b(?:free|gift)\s+(?:recharge|data|gift\s*card|coupon|voucher|iphone|smartphone)\b`),
      i(r`\b(?:(?:rs|inr|₹)\.?\s*[\d,]{4,}(?:\s*(?:lakh|crore|lakhs|crores))?)\s*(?:prize|won|reward|credited|cash)\b`),
      i(r`\b[\d,]{4,}\s*(?:lakh|crore)s?\s*(?:rupees|rs|inr)?\s*(?:prize|cash|reward|won)\b`),
    ],
  },
  {
    id: 'payment-demand',
    name: 'Payment / UPI Demand',
    severity: 'medium',
    explanation:
      'Requests to move money through UPI, gift cards or wire transfers — especially to unknown individuals — are classic fraud rails because payments are instant and hard to reverse.',
    action: 'Never pay to "release" a delivery, refund or prize. Verify any payment demand directly with the company’s official support.',
    patterns: [
      i(r`\b(?:send|transfer|pay)\s+(?:the\s+)?(?:money|amount|payment|rs\.?\s*[\d,]+|inr\s*[\d,]+|₹\s*[\d,]+)\b`),
      i(r`\b(?:upi|gpay|google\s*pay|phonepe|paytm|amazon\s*pay)\s*(?:id|to|pay|transfer)?\s*[:\-]?\s*[\w.\-]+@[\w]+\b`),
      i(r`\bgift\s*card\s*(?:code|number)\b`),
      i(r`\bwire\s+transfer\b`),
      i(r`\bpay\s+(?:\d+\s*)?(?:rs|inr|₹)\.??\s*[\d,]*\d\s*(?:only|now|immediately)?\b`),
      i(r`\b(?:advance|security)\s+(?:fee|deposit|payment)\b`),
    ],
  },
  {
    id: 'delivery-fee',
    name: 'Suspicious Delivery / Parcel Payment',
    severity: 'medium',
    explanation:
      'Real courier companies collect delivery fees in the app or on delivery with proper receipts — not via small UPI transfers to personal accounts before arrival.',
    action: 'If you have no matching order, ignore it. If you do, check the courier’s official app instead of paying through message links.',
    patterns: [
      i(r`\b(?:parcel|package|shipment|consignment|courier)\b[^.?!]{0,80}\b(?:fee|charge|payment|pay|customs|gst|tax|duty)\b`),
      i(r`\b(?:parcel|package|shipment|delivery)\s+(?:is\s+)?(?:stuck|on\s*hold|pending|awaiting|held)\b[^.?!]{0,40}\b(?:payment|fee|address|charge)\b`),
      i(r`\byour\s+(?:parcel|package|order|shipment)\s+could\s+not\s+be\s+deliver(?:ed|y)\b`),
      i(r`\b(?:delivery|address)\s+fee\s+(?:of\s+)?(?:rs|inr|₹)?\.?\s*[\d,]+\b`),
    ],
  },
  {
    id: 'bank-gov-impersonation',
    name: 'Bank / Government Impersonation Signals',
    severity: 'medium',
    explanation:
      'The message name-drops a bank, wallet, income-tax department, or RBI. Impersonation is trivially easy, so the sender name alone proves nothing — but combined with links or urgency it is a strong warning.',
    action: 'Independently verify by calling the official number printed on your card or the organisation’s website — never a number from the message.',
    patterns: [
      i(r`\b(?:sbi|hdfc|icici|axis|kotak|yes\s*bank|punjab\s*national|pnb|bank\s+of\s+baroda|baroda|canara|union\s+bank|idfc|indusind|bandhan)\b`),
      i(r`\b(?:paytm|phonepe|google\s*pay|gpay|amazon\s*pay|bhim|mobikwik|freecharge)\b(?=[^.?!]{0,60}\b(?:kyc|account|suspend|block|verify|expire|limit)\b)`),
      i(r`\b(?:income\s*tax|it\s*department|cbdts?|gst\s*(?:department|council)|r\.?b\.?i|reserve\s*bank|refund)\b(?=[^.?!]{0,80}\b(?:refund|verify|update|pending|due|eligible|kyc)\b)?`),
      i(r`\bdear\s+customer\b`),
      i(r`\b(?:dear|hi)\s+(?:customer|user|sir|madam)\b`),
    ],
  },
  {
    id: 'app-install',
    name: 'Request to Install Unknown Application',
    severity: 'high',
    explanation:
      'Sideloading apps from links outside official stores (especially "screen sharing", "verification" or "customer support" APKs) hands scammers remote control of your device.',
    action: 'Never install apps sent by message. Download only from official app stores, and refuse screen-sharing requests from callers.',
    patterns: [
      i(r`\b(?:download|install)\s+(?:this|the|our)\s+app\b`),
      i(r`\b(?:apk|\.apk)\b`),
      i(r`\b(?:anydesk|teamviewer|rustdesk|quick\s*support|screen\s*shar\w*)\b`),
      i(r`\b(?:support|verification|security)\s+app\b`),
      i(r`\bplay\s*store\s*(?:link|update)\b(?=[^.?!]{0,30}\b(?:message|sent|below|attach)\b)`),
    ],
  },
  {
    id: 'job-offer',
    name: 'Too-Good-to-Be-True Job / Earning Offer',
    severity: 'medium',
    explanation:
      'Fake part-time jobs and "earn daily from home" offers are among India’s most reported scams. They reel you in with small payouts, then demand deposits.',
    action: 'Never pay a deposit or registration fee for a job. Verify the employer through official channels before sharing any personal details.',
    patterns: [
      i(r`\b(?:part\s*time|work\s*from\s*home|earn\s*(?:daily|money|per\s*day)|daily\s*(?:payout|income|earnings)\s*(?:of)?)\b`),
      i(r`\b(?:salary|earning)\s*(?:of\s*)?(?:rs|inr|₹)?\.?\s*[\d,]+\s*(?:per|\/)\s*(?:day|hour|week)\b`),
      i(r`\b(?:no\s+investment|guaranteed\s+(?:income|earning))\b`),
      i(r`\b(?:whatsapp|telegram)\s*(?:group|channel)?\s*(?:job|work|earning)\b`),
      i(r`\b(?:join|click)\s+(?:our\s+)?(?:whatsapp|telegram)\s+(?:group|channel|link)\b`),
    ],
  },
  {
    id: 'callback-pressure',
    name: 'Call-Back / Contact Pressure',
    severity: 'low',
    explanation:
      'Pushing you to call a number or message a private chat isolates you from official support channels and scripted verification.',
    action: 'If you choose to verify, do it through the official website or app — not the contact details in the message.',
    patterns: [
      i(r`\b(?:call|contact|whatsapp|message|text)\s+(?:us|me|on|at|now)?\s*(?:on|at)?\s*(?:this\s+)?(?:number|no\.?)\s*[:\s]*[+\d]`),
      i(r`\btoll\s*free\b`),
      i(r`\b(?:customer\s*care)\s*(?:executive|agent|team)\b`),
      i(r`\b(?:reply|respond)\s+(?:with\s+)?(?:yes|hi|hello|ok|interested)\b`),
    ],
  },
  {
    id: 'personal-info',
    name: 'Personal Information Solicitation',
    severity: 'high',
    explanation:
      'Asking for card numbers, Aadhaar, PAN, date of birth or bank details in a message is a direct identity-theft attempt.',
    action: 'Never send identity documents or financial details in chat. Share documents only through official, verified portals.',
    patterns: [
      i(r`\b(?:aadhaar|aadhar|pan\s*(?:card)?|passport|date\s*of\s*birth|dob|account\s*number|card\s*(?:number|details)|net\s*banking\s*(?:login|password)?|internet\s*banking)\b`),
      i(r`\b(?:send|share|provide|give|upload)\b[^.?!]{0,50}\b(?:aadhaar|aadhar|pan\s*card|documents?|id\s*proof|bank\s*details?|card\s*details?)\b`),
    ],
  },
  {
    id: 'link-injection',
    name: 'Embedded Link',
    severity: 'info',
    explanation:
      'The message contains a web link. Links alone are not proof of fraud — but scammers rely on them, and the URL inspector below shows whether its structure is suspicious.',
    action: 'Inspect the URL in the URL Inspector tab before ever tapping it.',
    patterns: [/\bhttps?:\/\/\S+|\bwww\.\S+|\b[\w-]+\.(?:com|net|org|in|io|co|xyz|top|info|biz|ru|tk|ml|ga|cf|gq|link|live|online|site|shop|club)\b(\/\S*)?/gi],
  },
];

/** Match-only regexes for the visual highlight layer (words/phrases). */
export const HIGHLIGHT_REGEXPS: { severity: Severity; re: RegExp }[] = [
  { severity: 'critical', re: i(r`\b(?:otp|o\.t\.p|one\s*time\s*(?:password|code)?|verification\s*code|security\s*code|cvv|cvc|pin|password|passcode|card\s*number)\b`) },
  { severity: 'critical', re: i(r`\b(?:aadhaar|aadhar|pan\s*card|bank\s*details?|account\s*number)\b`) },
  { severity: 'high', re: i(r`\b(?:suspend\w*|block\w*|deactivat\w*|expire[sd]?|expiring|invalid|final\s+warning|last\s+warning|immediate\w*|urgent\w*)\b`) },
  { severity: 'high', re: i(r`\b(?:lottery|jackpot|lucky\s*draw|kbc|prize|winner|won|claim\b|processing\s*fee|cash\s*prize)\b`) },
  { severity: 'medium', re: i(r`\b(?:kyc|e-?kyc|re-?kyc|upi|gpay|google\s*pay|phonepe|paytm)\b`) },
  { severity: 'medium', re: i(r`\b(?:parcel|package|shipment|courier|customs|delivery\s*fee|gst\b)`) },
  { severity: 'medium', re: i(r`\b(?:download|install|apk|anydesk|teamviewer|screen\s*shar\w*)\b`) },
  { severity: 'low', re: i(r`\b\d{1,2}\s*(?:hours?|hrs?|minutes?|mins?|days?)\b`) },
  { severity: 'low', re: i(r`\b(?:rs|inr|₹)\.?\s*[\d,]+(?:\s*(?:lakh|crore)s?)?\b|[\d,]+\s*(?:lakh|crore)s?\b`) },
];
