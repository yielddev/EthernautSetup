// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./Dex.sol";

/// @dev Run the template with
///      ```
///      solc-select use 0.8.0
///      echidna program-analysis/echidna/exercises/exercise3/template.sol --contract TestToken
///      ```
contract TestDex is Dex {
    address echidna = msg.sender;

    // TODO: update the constructor
    constructor() Dex() {
        address instanceAddress = address(this);

        SwappableToken tokenInstance = new SwappableToken(instanceAddress, "Token 1", "TKN1", 110);
        SwappableToken tokenInstanceTwo = new SwappableToken(instanceAddress, "Token 2", "TKN2", 110); 

        address tokenInstanceAddress = address(tokenInstance);
        address tokenInstanceTwoAddress = address(tokenInstanceTwo);

        setTokens(tokenInstanceAddress, tokenInstanceTwoAddress);

        tokenInstance.approve(instanceAddress, 110);
        tokenInstanceTwo.approve(instanceAddress, 110);

        addLiquidity(tokenInstanceAddress, 100);
        addLiquidity(tokenInstanceTwoAddress, 100);

        tokenInstance.transfer(echidna, 10);
        tokenInstanceTwo.transfer(echidna, 10);
    }

    function echidna_test_balance() public view returns (bool) {
        return IERC20(token1).balanceOf(address(this)) != 0 || IERC20(token2).balanceOf(address(this)) != 0;
    }
}
