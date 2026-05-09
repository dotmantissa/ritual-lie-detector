"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { LIE_DETECTOR_ABI, LIE_DETECTOR_ADDRESS } from "@/lib/contracts";
import { useAccount } from "wagmi";

export function useVerdicts() {
  const { address } = useAccount();
  const recent = useReadContract({ address: LIE_DETECTOR_ADDRESS, abi: LIE_DETECTOR_ABI, functionName: "getRecentVerdicts", args: [10n], query: { refetchInterval: 30000 } });
  const global = useReadContracts({
    contracts: [
      { address: LIE_DETECTOR_ADDRESS, abi: LIE_DETECTOR_ABI, functionName: "totalTruths" },
      { address: LIE_DETECTOR_ADDRESS, abi: LIE_DETECTOR_ABI, functionName: "totalLies" },
      { address: LIE_DETECTOR_ADDRESS, abi: LIE_DETECTOR_ABI, functionName: "getTotalVerdicts" }
    ],
    query: { refetchInterval: 30000 }
  });
  const mine = useReadContract({ address: LIE_DETECTOR_ADDRESS, abi: LIE_DETECTOR_ABI, functionName: "getPlayerStats", args: address ? [address] : undefined, query: { enabled: !!address, refetchInterval: 30000 } });
  return { recent, global, mine };
}
