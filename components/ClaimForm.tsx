"use client";
import { useMemo } from "react";

type Props = { claim: string; setClaim: (v: string) => void; onSubmit: () => void; disabled: boolean; statusText?: string; processing: boolean };

export default function ClaimForm({ claim, setClaim, onSubmit, disabled, statusText, processing }: Props) {
  const color = useMemo(() => claim.length >= 480 ? "text-lie" : claim.length >= 400 ? "text-amber" : "text-muted", [claim.length]);
  return <div className="bg-card border border-line rounded-2xl p-5 relative"><label className="font-semibold">State your claim as fact.</label><textarea value={claim} onChange={(e)=>setClaim(e.target.value.slice(0,500))} placeholder="e.g. The Great Wall of China is visible from space." className="mt-3 w-full bg-surface rounded-lg p-4 min-h-20 text-lg resize-y"/><div className={`text-right text-xs mt-1 transition-colors ${color}`}>{claim.length} / 500</div><p className="text-xs text-muted mt-2">0.001 RITUAL per verdict - powered by Ritual LLM precompile</p><button disabled={disabled} onClick={onSubmit} className="mt-4 w-full h-12 rounded-lg font-semibold bg-truth disabled:bg-zinc-700 disabled:text-zinc-300">{processing ? statusText : "SUBMIT TO THE DETECTOR"}</button>{processing && <div className="absolute inset-0 bg-black/25 rounded-2xl" />}</div>;
}
