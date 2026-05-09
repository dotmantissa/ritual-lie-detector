"use client";
import { useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

export default function ChainGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [manual, setManual] = useState(false);
  if (!isConnected || chainId === 1979) return <>{children}</>;
  return <><div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-6"><div className="max-w-xl w-full bg-card border border-line rounded-2xl p-6 text-center"><h2 className="text-3xl font-display">Wrong network</h2><p className="text-muted mt-2">Ritual Lie Detector requires Ritual Testnet (Chain ID 1979)</p><button className="mt-6 w-full h-12 rounded-lg bg-ritual" onClick={async()=>{try{await switchChainAsync({ chainId: 1979 });}catch{setManual(true);}}}>Switch Network</button>{manual && <p className="text-sm text-muted mt-3">Add Ritual Testnet manually: RPC https://rpc.ritualfoundation.org | Chain ID 1979 | Symbol RITUAL</p>}</div></div></>;
}
