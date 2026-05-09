"use client";

import { useAccount, useBalance, useChainId } from "wagmi";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const isRightChain = !isConnected || chainId === 1979;
  return { address, isConnected, chainId, isRightChain, balance };
}
