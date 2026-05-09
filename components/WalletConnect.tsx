"use client";
import { useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";

const short = (a?: string) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";

export default function WalletConnect() {
  const [open, setOpen] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: bal } = useBalance({ address });
  if (!isConnected) return <button className="border border-white px-4 h-10 rounded-lg" onClick={()=>connect({ connector: connectors[0] })}>Connect Wallet</button>;
  return <div className="relative"><button onClick={()=>setOpen(!open)} className="h-10 rounded-full border border-line px-4 text-sm flex items-center gap-3"><span className="w-2 h-2 bg-truth rounded-full" /><span className="font-mono">{short(address)}</span><span>{Number(formatEther(bal?.value||0n)).toFixed(3)} RITUAL</span></button>{open && <div className="absolute right-0 mt-2 bg-card border border-line rounded-lg p-3 text-sm min-w-64"><div className="font-mono break-all">{address}</div><a className="text-ritual block mt-2" target="_blank" href={`https://explorer.ritualfoundation.org/address/${address}`}>View on Explorer</a><button className="text-lie mt-2" onClick={()=>disconnect()}>Disconnect</button></div>}</div>;
}
