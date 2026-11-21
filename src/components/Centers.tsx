import { Eye, ShieldCheck, BookOpenText, Landmark, Package, Trophy, KeyRound, Smartphone, LinkIcon, PhoneCall } from 'lucide-react';

const LESSONS = [
  {
    icon: KeyRound,
    title: 'OTPs are the master key',
    body: 'Your OTP unlocks your money in seconds. No bank, wallet or delivery company will ever ask for it — not by call, SMS or chat. Anyone who does is a thief, no matter how much they already know about you.',
  },
  {
    icon: Landmark,
    title: 'Banks never rush you',
    body: '"Account suspended in 24 hours" is theatre. Real banks do not close accounts by SMS link. Hang up, open the official app yourself, and check. The 2 minutes it costs beats losing your savings.',
  },
  {
    icon: Package,
    title: 'Parcel scams ride on real orders',
    body: 'Scammers guess you are waiting for a delivery. A small "customs fee" or "address correction charge" paid by UPI goes straight to a personal account. Couriers collect fees in their own app, at the door with a receipt.',
  },
  {
    icon: Trophy,
    title: 'Prizes you never entered are bait',
    body: 'Lottery wins, KBC draws, free recharge — all require a small "processing fee". Real winnings never ask winners to pay first. Delete the message; the only prize on offer is losing your money.',
  },
  {
    icon: Smartphone,
    title: 'Never install apps from messages',
    body: 'Screen-sharing or "verification" apps sent by chat give a scammer live control of your phone — they can read your OTPs as they arrive. Install only from official app stores.',
  },
  {
    icon: LinkIcon,
    title: 'Read the URL, not the logo',
    body: 'Scam sites copy real logos perfectly. Hover or long-press a link and read the domain: hdfc-kyc.xyz is not HDFC Bank. The part just before the first single slash is the only name that matters.',
  },
  {
    icon: PhoneCall,
    title: 'Verify through a channel you choose',
    body: 'The golden rule: never use contact details given inside a suspicious message. Find the official number on your card, bill or the organisation’s own website, and call that.',
  },
];

export function AwarenessCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Security Awareness Center</h2>
        <p className="mt-1 text-sm text-slate-400">
          Seven habits that stop most scams cold. Share these with family — especially anyone new to smartphones.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LESSONS.map((l) => (
          <div key={l.title} className="rounded-2xl glass p-5 glass-hover">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-400/20">
              <l.icon className="h-5 w-5 text-blue-300" />
            </div>
            <h3 className="mt-3 font-semibold text-white">{l.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{l.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="flex items-start gap-3">
          <BookOpenText className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
          <div className="text-sm leading-relaxed text-slate-300">
            <p className="font-medium text-white">The one-sentence rule</p>
            <p className="mt-1 text-slate-400">
              If a message creates urgency, mentions money, or asks for a code — stop, close the message, and verify through an
              official channel you found yourself. Scams need you to hurry; safety needs you to pause.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500">
        <Eye className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>Educational content only. ScamShield is a heuristic awareness tool, not threat-intelligence software.</p>
      </div>
    </div>
  );
}

export function PrivacyCenter() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'What is processed on your device',
      body: 'Everything. Message text normalization, pattern matching, risk scoring and URL structure checks all run inside your browser tab. No message you paste is ever sent anywhere during ordinary scanning.',
    },
    {
      icon: Eye,
      title: 'What we collect',
      body: 'Nothing. There are no accounts, no analytics, no cookies for tracking, and no ads. The app cannot identify you and does not try.',
    },
    {
      icon: Smartphone,
      title: 'What stays only on this device',
      body: 'Your message text never leaves the page. It is not written to localStorage, sessionStorage, databases or logs. When you close or refresh the tab, the message text is gone.',
    },
    {
      icon: LinkIcon,
      title: 'How URLs are handled',
      body: 'URLs are inspected as text only — parsed for structure like HTTP vs HTTPS, IP hosts, lookalike domains and encoding tricks. ScamShield never opens, fetches, previews or resolves any address you paste.',
    },
    {
      icon: PhoneCall,
      title: 'Optional external AI analysis',
      body: 'If enabled in future versions, any AI-powered explanation would require your explicit consent first, with a clear notice of what would be transmitted. Consent is never assumed and never bundled. Local-only analysis remains fully available without it.',
    },
    {
      icon: ShieldCheck,
      title: 'Scan history',
      body: 'This session keeps only minimal metadata of recent scans (time, score, indicator names) so you can compare results. Raw message text is never stored. Closing the tab clears everything.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">Privacy Center</h2>
        <p className="mt-1 text-sm text-slate-400">Plain-language answers about what happens to what you paste.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2.5">
              <it.icon className="h-5 w-5 text-emerald-300" />
              <h3 className="font-semibold text-white">{it.title}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{it.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm leading-relaxed text-slate-300">
        <p className="font-medium text-white">The design principle</p>
        <p className="mt-1 text-slate-400">
          Privacy is not a setting you must find — it is the default architecture. Sensitive content is processed in memory
          only, and nothing about you is recorded anywhere.
        </p>
      </div>
    </div>
  );
}
