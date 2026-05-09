"use client";
import { useState } from "react";

type Verdict = { submitter: string; claim: string; isTrue: boolean; response: string; timestamp: bigint; blockNumber: bigint };
const short = (a: string) => `${a.slice(0,6)}...${a.slice(-4)}`;

export default function RecentVerdicts({ verdicts }: { verdicts: Verdict[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!verdicts.length) return <p className="text-muted mt-6">No verdicts yet. Be the first to test the detector.</p>;
  return <div className="mt-6 bg-card border border-line rounded-xl divide-y divide-white/10">{verdicts.map((v, i) => <button key={`${v.blockNumber}-${i}`} className="w-full text-left p-3" onClick={()=>setOpen(open===i?null:i)}><div className="flex justify-between items-center"><div className="truncate"><span className={v.isTrue?"text-truth":"text-lie"}>{v.isTrue?"✓":"✗"}</span> {v.claim.slice(0,80)}{v.claim.length>80?"...":""}</div><div className="text-xs font-mono text-muted">{short(v.submitter)}</div></div>{open===i && <p className="text-sm text-muted mt-2 whitespace-pre-wrap">{v.response}</p>}</button>)}</div>;
}
