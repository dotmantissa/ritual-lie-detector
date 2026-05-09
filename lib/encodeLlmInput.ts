import { encodeAbiParameters, keccak256, parseAbiParameters, toBytes } from "viem";

export function encodeLlmInput(
  claim: string,
  systemPrompt: string
): `0x${string}` {
  const executorAddress = process.env.NEXT_PUBLIC_EXECUTOR_ADDRESS as `0x${string}`;
  if (!executorAddress) {
    throw new Error("NEXT_PUBLIC_EXECUTOR_ADDRESS is not set");
  }
  const claimHash = keccak256(toBytes(claim)).slice(2, 10);
  const messagesJson = JSON.stringify([
    { role: "system", content: systemPrompt },
    { role: "user", content: `CLAIM: ${claim}` }
  ]);

  return encodeAbiParameters(
    parseAbiParameters(
      "address, bytes[], uint256, bytes[], bytes, string, string, int256, string, bool, int256, string, string, uint256, bool, int256, string, bytes, int256, string, string, bool, int256, bytes, bytes, int256, int256, string, bool, (string,string,string)"
    ),
    [
      executorAddress,
      [],
      30n,
      [],
      "0x",
      messagesJson,
      "zai-org/GLM-4.7-FP8",
      0n,
      "",
      false,
      -1n,
      "",
      "",
      1n,
      false,
      0n,
      "",
      "0x",
      -1n,
      "",
      "",
      false,
      700n,
      "0x",
      "0x",
      -1n,
      1000n,
      "",
      false,
      ["gcs", `lie-detector/session-${Date.now()}-${claimHash}.jsonl`, "GCS_CREDS"] as [string, string, string]
    ]
  );
}
