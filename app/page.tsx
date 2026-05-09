"use client";

import { useMemo, useState } from "react";
import ChainGuard from "@/components/ChainGuard";
import WalletConnect from "@/components/WalletConnect";
import ClaimForm from "@/components/ClaimForm";
import VerdictDisplay from "@/components/VerdictDisplay";
import RecentVerdicts from "@/components/RecentVerdicts";
import StatsBar from "@/components/StatsBar";
import { useWallet } from "@/hooks/useWallet";
import { useSubmitClaim, type VerdictResult } from "@/hooks/useSubmitClaim";
import { useVerdicts } from "@/hooks/useVerdicts";

const statusTextMap = {
  encoding: "Encoding LLM request...",
  awaiting_signature: "Confirm in your wallet...",
  submitted: "Verdict pending on Ritual...",
  confirmed: "",
  error: "",
  idle: ""
};

export default function Page() {
  const { isConnected, isRightChain, address } = useWallet();
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState<(VerdictResult & { submitter: string }) | null>(null);
  const { submitClaim, status, txHash, error } = useSubmitClaim();
  const { recent, global, mine } = useVerdicts();

  const processing = status === "encoding" || status === "awaiting_signature" || status === "submitted";
  const disabled = !isConnected || !isRightChain || !claim.trim() || processing;
  const statusText = status === "submitted" && txHash ? `Verdict pending on Ritual... (TX: ${txHash.slice(0,10)}...)` : statusTextMap[status];
  const subtitle = useMemo(() => status === "submitted" ? "The Ritual LLM is evaluating your claim inside a TEE... Powered by Ritual's on-chain LLM - settling in one block." : "", [status]);

  return <ChainGuard><main className="min-h-screen px-4 py-8"><div className="max-w-[680px] mx-auto"><header><div className="flex items-start justify-between gap-4"><div><h1 className="font-display text-5xl font-extrabold">RITUAL LIE DETECTOR</h1><p className="text-muted mt-2">Ask it anything. The blockchain knows.</p><p className="text-sm mt-2 text-ritual">No bribery. No politics. Just the immutable truth - or exposure.</p></div><WalletConnect/></div><StatsBar totalTruths={(global.data?.[0].result as bigint) || 0n} totalLies={(global.data?.[1].result as bigint) || 0n} totalVerdicts={(global.data?.[2].result as bigint) || 0n} myTruths={mine.data?.[0]} myLies={mine.data?.[1]} /></header><section className="mt-6"><ClaimForm claim={claim} setClaim={setClaim} onSubmit={async()=>{const out = await submitClaim(claim); setResult({ ...out, submitter: address || "0x0000000000000000000000000000000000000000" }); setClaim("");}} disabled={disabled} processing={processing} statusText={statusText} />{subtitle && <div className="mt-3 text-sm text-amber pulse">{subtitle}</div>}{error && <div className="mt-3 text-sm text-lie">{error}</div>}</section><VerdictDisplay result={result} /><RecentVerdicts verdicts={(recent.data || []) as never[]} /></div></main></ChainGuard>;
}
