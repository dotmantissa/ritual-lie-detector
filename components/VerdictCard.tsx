"use client";
import html2canvas from "html2canvas";

type Props = { verdictId: bigint; isTrue: boolean; claim: string; response: string; submitter: string; txHash: string };
const short = (a: string) => `${a.slice(0,6)}...${a.slice(-4)}`;

export default function VerdictCard({ verdictId, isTrue, claim, response, submitter, txHash }: Props) {
  async function exportPng() {
    const el = document.getElementById("verdict-card"); if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#0c0c0f" });
    const link = document.createElement("a"); link.download = `ritual-verdict-${verdictId}.png`; link.href = canvas.toDataURL("image/png"); link.click();
  }
  function shareX() {
    const trimmed = `${claim.slice(0,60)}${claim.length>60?"...":""}`;
    const tweetText = isTrue ? `I just proved a fact on the blockchain. Ritual's on-chain LLM confirmed: "${trimmed}" - TRUTH CONFIRMED ✓\n\nVerdict #${verdictId} on Ritual Testnet.` : `I just got roasted by an on-chain LLM. Ritual's lie detector caught me: "${trimmed}" - LIAR DETECTED ✗\n\nVerdict #${verdictId} on Ritual Testnet.`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`,"_blank");
  }
  return <div className="mt-5"><div id="verdict-card" className="w-[600px] h-[380px] max-w-full mx-auto rounded-2xl border-2 p-5 bg-bg" style={{borderColor:isTrue?"#22c55e":"#ef4444", boxShadow:`inset 0 2px 0 ${isTrue?"#22c55e":"#ef4444"}`}}><div className="flex justify-between text-sm uppercase"><span className="text-ritual">Ritual Lie Detector</span><span>◈</span></div><hr className="my-3 border-white/10"/><h3 className={`text-center text-3xl font-bold ${isTrue?"text-truth":"text-lie"}`}>{isTrue?"TRUTH CONFIRMED":"LIAR DETECTED"}</h3><p className="text-center italic mt-3">"{claim.slice(0,140)}{claim.length>140?"...":""}"</p><p className="text-sm text-muted mt-4 text-justify">{response.slice(0,180)}{response.length>180?"...":""}</p><hr className="my-4 border-white/10"/><div className="text-xs flex justify-between"><span className="font-mono">{short(submitter)}</span><span>Powered by Ritual Testnet</span><span>ritualfoundation.org</span></div></div><div className="flex gap-2 mt-3"><button onClick={exportPng} className="px-4 py-2 bg-ritual rounded">Download PNG</button><button onClick={shareX} className="px-4 py-2 border border-line rounded">Share to X</button><a target="_blank" className="px-4 py-2 border border-line rounded" href={`https://explorer.ritualfoundation.org/tx/${txHash}`}>View on Explorer</a></div></div>;
}
