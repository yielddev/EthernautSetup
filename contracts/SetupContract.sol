// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "./Dex.sol";

contract SetupContract {
    Dex instance;
    address token1;
    address token2;
    address echidna;

    constructor () {
        echidna = address(this);
        //createInstance(echidna);
        instance = new Dex();
        address instanceAddress = address(instance);

        SwappableToken tokenInstance = new SwappableToken(instanceAddress, "Token 1", "TKN1", 110);
        SwappableToken tokenInstanceTwo = new SwappableToken(instanceAddress, "Token) 2", "TKN2", 110);

        address tokenInstanceAddress = address(tokenInstance);
        address tokenInstanceTwoAddress = address(tokenInstanceTwo);

        token1 = tokenInstanceAddress;
        token2 = tokenInstanceTwoAddress;

        instance.setTokens(tokenInstanceAddress, tokenInstanceTwoAddress);

        tokenInstance.approve(instanceAddress, 110);
        tokenInstanceTwo.approve(instanceAddress, 110);

        instance.addLiquidity(tokenInstanceAddress, 100);
        instance.addLiquidity(tokenInstanceTwoAddress, 100);

        tokenInstance.transfer(echidna, 10);
        tokenInstanceTwo.transfer(echidna, 10);

    }

    function test_swap(address _t1, address _t2, uint256 amount) public {
        instance.swap(_t1, _t2, amount);
        assert(IERC20(token1).balanceOf(address(instance)) > 80);
        assert(IERC20(token2).balanceOf(address(instance)) > 80);
    }
}