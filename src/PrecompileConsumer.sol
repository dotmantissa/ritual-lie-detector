// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

abstract contract PrecompileConsumer {
    function _executePrecompile(address target, bytes memory input) internal returns (bytes memory output) {
        (bool ok, bytes memory data) = target.call(input);
        require(ok, "Precompile call failed");
        return data;
    }
}
