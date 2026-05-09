"use client";
import { motion } from "framer-motion";
import VerdictCard from "./VerdictCard";

type Result = { verdictId: bigint; isTrue: boolean; claim: string; response: string; txHash: string; blockNumber: bigint; submitter: string };

export default function VerdictDisplay({ result }: { result: Result | null }) {
  if (!result) return null;
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`mt-6 border-2 rounded-2xl p-5 ${result.isTrue ? "border-truth bg-green-500/5" : "border-lie bg-red-500/5"}`}><motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="text-2xl font-bold">{result.isTrue ? "TRUTH CONFIRMED" : "LIAR DETECTED"}</motion.div><p className="text-muted text-sm mt-1">{result.isTrue ? "Ritual's LLM Precompile has spoken" : "Ritual's LLM Precompile sees through you"}</p><div className="mt-3 whitespace-pre-wrap">{result.response}</div><a className="text-ritual mt-3 inline-block" target="_blank" href={`https://explorer.ritualfoundation.org/tx/${result.txHash}`}>View transaction</a><VerdictCard verdictId={result.verdictId} isTrue={result.isTrue} claim={result.claim} response={result.response} submitter={result.submitter} txHash={result.txHash} /></motion.div>;
}
