// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PrecompileConsumer} from "./PrecompileConsumer.sol";

interface IRitualWallet {
    function deposit(uint256 lockBlocks) external payable;
    function balanceOf(address account) external view returns (uint256);
}

contract LieDetector is PrecompileConsumer, Ownable {
    struct StorageRef {
        string provider;
        string pointer;
        string credentialKey;
    }

    address public constant LLM_PRECOMPILE = address(0x0802);
    address public constant RITUAL_WALLET = 0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948;
    uint256 public constant SUBMISSION_FEE = 0.001 ether;

    struct Verdict {
        address submitter;
        string claim;
        bool isTrue;
        string response;
        uint256 timestamp;
        uint256 blockNumber;
    }

    Verdict[] public verdicts;
    mapping(address => uint256[]) public playerVerdicts;
    mapping(address => uint256) public truthCount;
    mapping(address => uint256) public lieCount;
    uint256 public totalTruths;
    uint256 public totalLies;
    address public executor;
    string public systemPrompt;

    event VerdictIssued(
        uint256 indexed verdictId,
        address indexed submitter,
        bool isTrue,
        string claim,
        string response,
        uint256 timestamp
    );

    constructor(address _executor, string memory _systemPrompt) Ownable(msg.sender) {
        executor = _executor;
        systemPrompt = _systemPrompt;
    }

    function submitClaim(string calldata claim, bytes calldata llmInput) external payable returns (uint256 verdictId) {
        require(msg.value >= SUBMISSION_FEE, "Insufficient fee");
        require(bytes(claim).length > 0, "Empty claim");
        require(bytes(claim).length <= 500, "Claim too long");

        (bool ok, bytes memory data) =
            RITUAL_WALLET.staticcall(abi.encodeWithSelector(IRitualWallet.balanceOf.selector, address(this)));
        if (ok && data.length >= 32) {
            uint256 bal = abi.decode(data, (uint256));
            require(bal > 0, "RitualWallet not funded");
        }

        bytes memory rawOutput = _executePrecompile(LLM_PRECOMPILE, llmInput);

        (bool hasError, bytes memory completionData,, string memory errorMessage,) =
            abi.decode(rawOutput, (bool, bytes, bytes, string, StorageRef));

        require(!hasError, string.concat("LLM error: ", errorMessage));

        string memory responseText = string(completionData);

        bytes memory respBytes = bytes(responseText);
        bool isTrue = false;
        if (respBytes.length >= 13) {
            bytes memory prefix = new bytes(13);
            for (uint256 i = 0; i < 13; i++) {
                prefix[i] = respBytes[i];
            }
            isTrue = keccak256(prefix) == keccak256(bytes("VERDICT: TRUE"));
        }

        verdictId = verdicts.length;
        verdicts.push(Verdict({
            submitter: msg.sender,
            claim: claim,
            isTrue: isTrue,
            response: responseText,
            timestamp: block.timestamp,
            blockNumber: block.number
        }));

        playerVerdicts[msg.sender].push(verdictId);

        if (isTrue) {
            truthCount[msg.sender]++;
            totalTruths++;
        } else {
            lieCount[msg.sender]++;
            totalLies++;
        }

        emit VerdictIssued(verdictId, msg.sender, isTrue, claim, responseText, block.timestamp);
    }

    function getVerdict(uint256 verdictId) external view returns (Verdict memory) {
        require(verdictId < verdicts.length, "Verdict not found");
        return verdicts[verdictId];
    }

    function getPlayerVerdicts(address player) external view returns (uint256[] memory verdictIds) {
        return playerVerdicts[player];
    }

    function getPlayerStats(address player) external view returns (uint256 truths, uint256 lies, uint256 total) {
        truths = truthCount[player];
        lies = lieCount[player];
        total = truths + lies;
    }

    function getRecentVerdicts(uint256 count) external view returns (Verdict[] memory) {
        uint256 length = verdicts.length;
        uint256 n = count > length ? length : count;
        Verdict[] memory recent = new Verdict[](n);

        for (uint256 i = 0; i < n; i++) {
            recent[i] = verdicts[length - 1 - i];
        }
        return recent;
    }

    function getTotalVerdicts() external view returns (uint256) {
        return verdicts.length;
    }

    function setSystemPrompt(string calldata newPrompt) external onlyOwner {
        systemPrompt = newPrompt;
    }

    function setExecutor(address newExecutor) external onlyOwner {
        executor = newExecutor;
    }

    function withdrawFees(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        (bool ok,) = payable(owner()).call{value: amount}("");
        require(ok, "Withdraw failed");
    }

    function refuelWallet(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        IRitualWallet(RITUAL_WALLET).deposit{value: amount}(500);
    }
}
