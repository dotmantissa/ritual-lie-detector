// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LieDetector} from "../src/LieDetector.sol";

contract LieDetectorTest is Test {
    LieDetector internal detector;

    address internal owner = address(this);
    address internal user = address(0xBEEF);

    bytes internal encodedLlmInput = hex"1234";

    function setUp() public {
        detector = new LieDetector(address(0x1234), "system");
        vm.deal(user, 10 ether);
        vm.deal(address(detector), 10 ether);
    }

    function _mockPrecompileTrue() internal {
        LieDetector.StorageRef memory history = LieDetector.StorageRef("", "", "");
        vm.mockCall(
            address(0x0802),
            encodedLlmInput,
            abi.encode(
                false,
                bytes("VERDICT: TRUE\n\nYour claim is correct. Well done."),
                bytes(""),
                "",
                history
            )
        );
    }

    function _mockPrecompileFalse() internal {
        LieDetector.StorageRef memory history = LieDetector.StorageRef("", "", "");
        vm.mockCall(
            address(0x0802),
            encodedLlmInput,
            abi.encode(
                false,
                bytes("VERDICT: FALSE\n\nThat is incorrect."),
                bytes(""),
                "",
                history
            )
        );
    }

    function testSubmitClaim_requiresFee() public {
        vm.prank(user);
        vm.expectRevert("Insufficient fee");
        detector.submitClaim("The sky is blue", encodedLlmInput);
    }

    function testSubmitClaim_rejectsEmptyClaim() public {
        vm.prank(user);
        vm.expectRevert("Empty claim");
        detector.submitClaim{value: 0.001 ether}("", encodedLlmInput);
    }

    function testSubmitClaim_rejectsTooLongClaim() public {
        string memory longClaim = new string(501);
        vm.prank(user);
        vm.expectRevert("Claim too long");
        detector.submitClaim{value: 0.001 ether}(longClaim, encodedLlmInput);
    }

    function testGetVerdict_notFound() public {
        vm.expectRevert("Verdict not found");
        detector.getVerdict(999);
    }

    function testGetPlayerVerdicts_empty() public view {
        uint256[] memory ids = detector.getPlayerVerdicts(address(0x1));
        assertEq(ids.length, 0);
    }

    function testGetRecentVerdicts_capAtLength() public {
        _mockPrecompileTrue();
        vm.startPrank(user);
        detector.submitClaim{value: 0.001 ether}("A", encodedLlmInput);
        detector.submitClaim{value: 0.001 ether}("B", encodedLlmInput);
        detector.submitClaim{value: 0.001 ether}("C", encodedLlmInput);
        vm.stopPrank();

        LieDetector.Verdict[] memory recent = detector.getRecentVerdicts(10);
        assertEq(recent.length, 3);
    }

    function testWithdrawFees_onlyOwner() public {
        vm.prank(user);
        vm.expectRevert();
        detector.withdrawFees(0.001 ether);
    }

    function testSetSystemPrompt_onlyOwner() public {
        vm.prank(user);
        vm.expectRevert();
        detector.setSystemPrompt("new");
    }

    function testTotalVerdicts_incrementsCorrectly() public {
        _mockPrecompileTrue();

        vm.startPrank(user);
        detector.submitClaim{value: 0.001 ether}("The sky is blue", encodedLlmInput);
        detector.submitClaim{value: 0.001 ether}("Water is wet", encodedLlmInput);
        detector.submitClaim{value: 0.001 ether}("Earth orbits sun", encodedLlmInput);
        vm.stopPrank();

        assertEq(detector.getTotalVerdicts(), 3);
    }

    function testStatsTracking() public {
        _mockPrecompileTrue();
        vm.prank(user);
        detector.submitClaim{value: 0.001 ether}("Claim 1", encodedLlmInput);
        vm.prank(user);
        detector.submitClaim{value: 0.001 ether}("Claim 2", encodedLlmInput);

        _mockPrecompileFalse();
        vm.prank(user);
        detector.submitClaim{value: 0.001 ether}("Claim 3", encodedLlmInput);

        (uint256 truths, uint256 lies, uint256 total) = detector.getPlayerStats(user);
        assertEq(truths, 2);
        assertEq(lies, 1);
        assertEq(total, 3);
    }
}
