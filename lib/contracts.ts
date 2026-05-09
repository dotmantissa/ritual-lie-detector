export const LIE_DETECTOR_ADDRESS =
  (process.env.NEXT_PUBLIC_LIE_DETECTOR_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const LIE_DETECTOR_ABI = [
  { name: "submitClaim", type: "function", stateMutability: "payable", inputs: [{ name: "claim", type: "string" }, { name: "llmInput", type: "bytes" }], outputs: [{ name: "verdictId", type: "uint256" }] },
  { name: "getVerdict", type: "function", stateMutability: "view", inputs: [{ name: "verdictId", type: "uint256" }], outputs: [{ type: "tuple", components: [{ name: "submitter", type: "address" }, { name: "claim", type: "string" }, { name: "isTrue", type: "bool" }, { name: "response", type: "string" }, { name: "timestamp", type: "uint256" }, { name: "blockNumber", type: "uint256" }] }] },
  { name: "getRecentVerdicts", type: "function", stateMutability: "view", inputs: [{ name: "count", type: "uint256" }], outputs: [{ type: "tuple[]", components: [{ name: "submitter", type: "address" }, { name: "claim", type: "string" }, { name: "isTrue", type: "bool" }, { name: "response", type: "string" }, { name: "timestamp", type: "uint256" }, { name: "blockNumber", type: "uint256" }] }] },
  { name: "getPlayerStats", type: "function", stateMutability: "view", inputs: [{ name: "player", type: "address" }], outputs: [{ name: "truths", type: "uint256" }, { name: "lies", type: "uint256" }, { name: "total", type: "uint256" }] },
  { name: "getTotalVerdicts", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalTruths", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "totalLies", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { name: "VerdictIssued", type: "event", inputs: [{ name: "verdictId", type: "uint256", indexed: true }, { name: "submitter", type: "address", indexed: true }, { name: "isTrue", type: "bool", indexed: false }, { name: "claim", type: "string", indexed: false }, { name: "response", type: "string", indexed: false }, { name: "timestamp", type: "uint256", indexed: false }] }
] as const;
