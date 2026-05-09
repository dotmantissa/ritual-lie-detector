"use client";

import { useState } from "react";
import { decodeEventLog, parseEther } from "viem";
import { useConfig, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { LIE_DETECTOR_ABI, LIE_DETECTOR_ADDRESS } from "@/lib/contracts";
import { encodeLlmInput } from "@/lib/encodeLlmInput";
import { SYSTEM_PROMPT } from "@/lib/constants";

export type SubmitStatus = "idle" | "encoding" | "awaiting_signature" | "submitted" | "confirmed" | "error";
export type VerdictResult = { verdictId: bigint; isTrue: boolean; claim: string; response: string; txHash: string; blockNumber: bigint };

export function useSubmitClaim() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  async function submitClaim(claim: string): Promise<VerdictResult> {
    try {
      setError(null);
      setStatus("encoding");
      const llmInput = encodeLlmInput(claim, SYSTEM_PROMPT);
      setStatus("awaiting_signature");
      const hash = await writeContractAsync({
        address: LIE_DETECTOR_ADDRESS,
        abi: LIE_DETECTOR_ABI,
        functionName: "submitClaim",
        args: [claim, llmInput],
        value: parseEther("0.001"),
        gas: 2_500_000n
      });
      setTxHash(hash);
      setStatus("submitted");
      const receipt = await waitForTransactionReceipt(config, { hash, confirmations: 1 });
      const verdictLog = receipt.logs.find((log) => {
        try {
          const decoded = decodeEventLog({ abi: LIE_DETECTOR_ABI, eventName: "VerdictIssued", data: log.data, topics: log.topics });
          return decoded.eventName === "VerdictIssued";
        } catch { return false; }
      });
      if (!verdictLog) throw new Error("VerdictIssued event not found in receipt");
      const decoded = decodeEventLog({ abi: LIE_DETECTOR_ABI, eventName: "VerdictIssued", data: verdictLog.data, topics: verdictLog.topics });
      setStatus("confirmed");
      return { verdictId: decoded.args.verdictId, isTrue: decoded.args.isTrue, claim: decoded.args.claim, response: decoded.args.response, txHash: hash, blockNumber: receipt.blockNumber };
    } catch (e) {
      const message = `${e}`;
      if (message.includes("Insufficient fee")) setError("You need at least 0.001 RITUAL to submit");
      else if (message.includes("Empty claim")) setError("Write something first");
      else if (message.includes("Claim too long")) setError("Keep it under 500 characters");
      else if (message.includes("LLM error:")) setError(message.slice(message.indexOf("LLM error:")));
      else setError(message);
      setStatus("error");
      throw e;
    }
  }

  return { submitClaim, status, txHash, error, setStatus };
}
