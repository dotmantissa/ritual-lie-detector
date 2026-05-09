"use client";

export default function StatsBar({ totalTruths, totalLies, totalVerdicts, myTruths, myLies }: { totalTruths: bigint; totalLies: bigint; totalVerdicts: bigint; myTruths?: bigint; myLies?: bigint }) {
  if (totalVerdicts === 0n) return <div className="mt-3 text-sm text-muted">No verdicts yet - be the first.</div>;
  const rate = Number(totalLies * 1000n / (totalVerdicts || 1n)) / 10;
  return <div className="mt-3"><div className="text-sm text-muted">{Number(totalVerdicts).toLocaleString()} Verdicts Issued | {Number(totalTruths).toLocaleString()} Truths | {Number(totalLies).toLocaleString()} Lies | {rate.toFixed(1)}% Liar Rate</div><div className="text-xs mt-2 border border-line rounded-full px-3 py-1 inline-block">Your record: {Number(myTruths||0n)} truths, {Number(myLies||0n)} lies</div></div>;
}
